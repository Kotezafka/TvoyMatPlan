'use client';

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  LiveKitRoom,
  VideoTrack,
  useLocalParticipant,
  useRoomContext,
} from '@livekit/components-react';
import { RoomEvent, Track } from 'livekit-client';
import { Camera, CameraOff, Loader2, RefreshCw, Smartphone } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { resolveLivekitUrl } from '@/lib/livekit-url';

type CameraConnection = {
  token: string;
  url: string;
  lessonId: string;
  expiresAt: string;
};

type FacingMode = 'environment' | 'user';
const NOTEBOOK_CAMERA_TOPIC = 'notebook-camera-control';

type FocusRange = { min: number; max: number; step: number; current: number; autofocus: boolean };
type FocusConstraintSet = MediaTrackConstraintSet & {
  focusMode?: string;
  focusDistance?: ConstrainDouble;
};
type FocusMediaCapabilities = MediaTrackCapabilities & {
  focusMode?: string[];
  focusDistance?: DoubleRange & { step?: number };
};
type FocusMediaSettings = MediaTrackSettings & { focusDistance?: number };

function participantRole(participant?: { metadata?: string }) {
  if (!participant?.metadata) return '';
  try {
    return JSON.parse(participant.metadata).role || '';
  } catch {
    return '';
  }
}

function getFocusRange(track: MediaStreamTrack | undefined): FocusRange | null {
  if (!track || typeof track.getCapabilities !== 'function') return null;
  try {
    const capabilities = track.getCapabilities() as FocusMediaCapabilities;
    const range = capabilities.focusDistance;
    const min = Number(range?.min);
    const max = Number(range?.max);
    const rawStep = Number(range?.step);
    if (
      !range ||
      !Number.isFinite(min) ||
      !Number.isFinite(max) ||
      max <= min ||
      (capabilities.focusMode?.length && !capabilities.focusMode.includes('manual'))
    ) {
      return null;
    }
    const current = (track.getSettings() as FocusMediaSettings).focusDistance;
    return {
      min,
      max,
      step: Number.isFinite(rawStep) && rawStep > 0 ? rawStep : 0.01,
      current: Number.isFinite(current) ? current! : min,
      autofocus: Boolean(
        capabilities.focusMode?.some((mode) => mode === 'continuous' || mode === 'single-shot'),
      ),
    };
  } catch {
    return null;
  }
}

function CameraSession() {
  const { localParticipant, cameraTrack, isCameraEnabled } = useLocalParticipant();
  const room = useRoomContext();
  const [facingMode, setFacingMode] = useState<FacingMode>('environment');
  const [switching, setSwitching] = useState(false);
  const currentMediaTrack = cameraTrack?.track?.mediaStreamTrack;

  const sendFocusMessage = useCallback(
    async (message: Record<string, unknown>, destinationIdentity?: string) => {
      const teacher = destinationIdentity
        ? room.remoteParticipants.get(destinationIdentity)
        : Array.from(room.remoteParticipants.values()).find(
            (participant) => participantRole(participant) === 'teacher',
          );
      if (!teacher || participantRole(teacher) !== 'teacher') return;
      try {
        await localParticipant.publishData(
          new TextEncoder().encode(JSON.stringify(message)),
          {
            reliable: true,
            topic: NOTEBOOK_CAMERA_TOPIC,
            destinationIdentities: [teacher.identity],
          },
        );
      } catch {
        // A short reconnect can make a focus-control packet fail; the teacher
        // can reopen the panel to request capabilities again.
      }
    },
    [localParticipant, room],
  );

  const reportFocusCapabilities = useCallback(
    async (destinationIdentity?: string) => {
      const range = getFocusRange(currentMediaTrack);
      await sendFocusMessage(
        range
          ? { type: 'focus-capabilities', supported: true, ...range }
          : { type: 'focus-capabilities', supported: false },
        destinationIdentity,
      );
    },
    [currentMediaTrack, sendFocusMessage],
  );

  useEffect(() => {
    if (!currentMediaTrack || !isCameraEnabled) return;
    const first = window.setTimeout(() => void reportFocusCapabilities(), 600);
    const retry = window.setTimeout(() => void reportFocusCapabilities(), 1800);
    return () => {
      window.clearTimeout(first);
      window.clearTimeout(retry);
    };
  }, [currentMediaTrack, isCameraEnabled, reportFocusCapabilities]);

  useEffect(() => {
    const handleData = (
      payload: Uint8Array,
      participant?: { identity: string; metadata?: string },
      _kind?: unknown,
      topic?: string,
    ) => {
      if (!participant || topic !== NOTEBOOK_CAMERA_TOPIC || participantRole(participant) !== 'teacher') return;
      let message: Record<string, unknown>;
      try {
        message = JSON.parse(new TextDecoder().decode(payload));
      } catch {
        return;
      }

      if (message.type === 'focus-probe') {
        void reportFocusCapabilities(participant.identity);
        return;
      }
      if (message.type !== 'set-focus' && message.type !== 'autofocus') return;
      if (!currentMediaTrack) return;

      void (async () => {
        try {
          const focusModes = (currentMediaTrack.getCapabilities() as FocusMediaCapabilities).focusMode || [];
          if (message.type === 'autofocus') {
            const mode = focusModes.includes('continuous')
              ? 'continuous'
              : focusModes.includes('single-shot')
                ? 'single-shot'
                : null;
            if (!mode) throw new Error('Автофокус недоступен');
            await currentMediaTrack.applyConstraints({
              advanced: [{ focusMode: mode } as FocusConstraintSet],
            });
          } else {
            const value = Number(message.value);
            const range = getFocusRange(currentMediaTrack);
            if (!range || !Number.isFinite(value)) throw new Error('Фокус недоступен');
            const focusDistance = Math.max(range.min, Math.min(range.max, value));
            try {
              await currentMediaTrack.applyConstraints({
                advanced: [
                  { focusMode: 'manual', focusDistance } as FocusConstraintSet,
                ],
              });
            } catch {
              // Some mobile browsers expose the distance range without listing
              // focusMode; use their supported distance-only constraint.
              await currentMediaTrack.applyConstraints({
                advanced: [{ focusDistance } as FocusConstraintSet],
              });
            }
          }
          const settings = currentMediaTrack.getSettings() as FocusMediaSettings;
          await sendFocusMessage(
            {
              type: 'focus-result',
              ok: true,
              value: settings.focusDistance,
              autofocus: message.type === 'autofocus',
            },
            participant.identity,
          );
        } catch {
          await sendFocusMessage(
            { type: 'focus-result', ok: false },
            participant.identity,
          );
        }
      })();
    };

    room.on(RoomEvent.DataReceived, handleData);
    return () => {
      room.off(RoomEvent.DataReceived, handleData);
    };
  }, [currentMediaTrack, reportFocusCapabilities, room, sendFocusMessage]);

  const toggleCamera = async () => {
    setSwitching(true);
    try {
      if (isCameraEnabled) {
        await localParticipant.setCameraEnabled(false);
      } else {
        await localParticipant.setCameraEnabled(true, {
          facingMode,
          resolution: { width: 1280, height: 720 },
          frameRate: 15,
        });
      }
    } finally {
      setSwitching(false);
    }
  };

  const flipCamera = async () => {
    const next = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(next);
    setSwitching(true);
    try {
      await localParticipant.setCameraEnabled(false);
      await localParticipant.setCameraEnabled(true, {
        facingMode: next,
        resolution: { width: 1280, height: 720 },
        frameRate: 15,
      });
    } finally {
      setSwitching(false);
    }
  };

  const trackRef = cameraTrack
    ? ({
        participant: localParticipant,
        publication: cameraTrack,
        source: Track.Source.Camera,
      } as any)
    : undefined;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col gap-5 px-4 py-6">
      <header className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-500/12 text-primary-600">
          <Smartphone className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-[rgb(var(--text))]">Камера тетради</h1>
          <p className="text-sm text-[rgb(var(--text-2))]">Телефон передаёт изображение преподавателю</p>
        </div>
      </header>

      <section className="mx-auto w-full max-w-sm overflow-hidden rounded-2xl border border-[rgb(var(--border))] bg-black shadow-sm">
        <div className="aspect-[9/16] w-full">
          {trackRef ? (
            <VideoTrack trackRef={trackRef} className="h-full w-full object-contain" />
          ) : (
            <div className="flex h-full items-center justify-center text-center text-sm text-white/70">
              Камера выключена
            </div>
          )}
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => void toggleCamera()}
          disabled={switching}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-primary-600 disabled:opacity-60"
        >
          {switching ? <Loader2 className="h-4 w-4 animate-spin" /> : isCameraEnabled ? <CameraOff className="h-4 w-4" /> : <Camera className="h-4 w-4" />}
          {isCameraEnabled ? 'Выключить' : 'Включить камеру'}
        </button>
        <button
          type="button"
          onClick={() => void flipCamera()}
          disabled={switching || !isCameraEnabled}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-4 py-3 text-sm font-medium text-[rgb(var(--text))] transition hover:bg-[rgb(var(--surface-2))] disabled:opacity-50"
        >
          <RefreshCw className="h-4 w-4" />
          Сменить камеру
        </button>
      </div>

      <p className="rounded-xl bg-[rgb(var(--surface-2))] px-4 py-3 text-center text-sm leading-6 text-[rgb(var(--text-2))]">
        Поставьте телефон над тетрадью и включите камеру. Для лучшего качества используйте заднюю камеру и устойчивое соединение Wi‑Fi.
      </p>
    </main>
  );
}

function LessonCameraContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code') || '';
  const [connection, setConnection] = useState<CameraConnection | null>(null);
  const [error, setError] = useState('');
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const requestNumber = useRef(0);

  const loadConnection = useCallback(async () => {
    const request = ++requestNumber.current;
    setLoading(true);
    setError('');
    if (!code) {
      setError('QR-код неполный. Попросите преподавателя создать новый код.');
      setLoading(false);
      return null;
    }
    try {
      const value = await api.post<CameraConnection>('/video/camera-token', { code });
      if (request === requestNumber.current) {
        setConnection({ ...value, url: resolveLivekitUrl(value.url) });
        setError('');
      }
      return value;
    } catch (requestError: any) {
      if (request === requestNumber.current) {
        setError(
          requestError.response?.data?.message ||
            'Не удалось получить доступ к камере. Проверьте соединение и повторите попытку.',
        );
      }
      return null;
    } finally {
      if (request === requestNumber.current) setLoading(false);
    }
  }, [code]);

  useEffect(() => {
    void loadConnection();
    return () => {
      requestNumber.current += 1;
    };
  }, [loadConnection]);

  const startCamera = async () => {
    setConnecting(true);
    const freshConnection = await loadConnection();
    if (freshConnection) setStarted(true);
    setConnecting(false);
  };

  const expiresText = useMemo(() => {
    if (!connection?.expiresAt) return '';
    return new Intl.DateTimeFormat('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(connection.expiresAt));
  }, [connection?.expiresAt]);

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center px-5 py-8 text-center">
        <div className="max-w-sm rounded-2xl border border-red-500/20 bg-red-500/8 p-6">
          <CameraOff className="mx-auto h-8 w-8 text-red-600" />
          <h1 className="mt-3 text-lg font-semibold text-[rgb(var(--text))]">Не удалось подключить камеру</h1>
          <p className="mt-2 text-sm leading-6 text-[rgb(var(--text-2))]">{error}</p>
          {code && (
            <button
              type="button"
              onClick={() => void startCamera()}
              disabled={loading || connecting}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
            >
              {loading || connecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Переподключить камеру
            </button>
          )}
        </div>
      </main>
    );
  }

  if (!connection || loading) {
    return (
      <main className="flex min-h-screen items-center justify-center gap-3 text-sm text-[rgb(var(--text-2))]">
        <Loader2 className="h-5 w-5 animate-spin text-primary-500" />
        Подключаем камеру…
      </main>
    );
  }

  if (!started) {
    return (
      <main className="flex min-h-screen items-center justify-center px-5 py-8">
        <section className="w-full max-w-sm rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-6 text-center shadow-sm">
          <Camera className="mx-auto h-10 w-10 text-primary-500" />
          <h1 className="mt-4 text-xl font-semibold text-[rgb(var(--text))]">Готовы показать тетрадь?</h1>
          <p className="mt-2 text-sm leading-6 text-[rgb(var(--text-2))]">
            Разрешите доступ к камере, поставьте телефон над тетрадью и нажмите кнопку подключения.
          </p>
          <button
            type="button"
            onClick={() => void startCamera()}
            disabled={connecting}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-primary-600 disabled:opacity-60"
          >
            {connecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
            {connecting ? 'Подключаем…' : 'Подключить камеру'}
          </button>
          {expiresText && <p className="mt-3 text-xs text-[rgb(var(--text-3))]">Ссылка действует до {expiresText}</p>}
        </section>
      </main>
    );
  }

  return (
    <LiveKitRoom
      key={connection.token}
      serverUrl={connection.url}
      token={connection.token}
      connect
      video={{
        facingMode: 'environment',
        resolution: { width: 1280, height: 720 },
        frameRate: 15,
      }}
      audio={false}
      options={{ disconnectOnPageLeave: true }}
      connectOptions={{ autoSubscribe: false }}
      onError={() => {
        setStarted(false);
        setError('Не удалось передать видео. Проверьте соединение и нажмите «Переподключить камеру».');
      }}
      onDisconnected={() => {
        setStarted(false);
        setError('Связь с уроком прервалась. Нажмите «Переподключить камеру», чтобы начать новую попытку.');
      }}
      style={{ minHeight: '100vh', display: 'block' }}
    >
      <CameraSession />
    </LiveKitRoom>
  );
}

export default function LessonCameraPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center gap-3 text-sm text-[rgb(var(--text-2))]">
          <Loader2 className="h-5 w-5 animate-spin text-primary-500" />
          Загружаем подключение…
        </main>
      }
    >
      <LessonCameraContent />
    </Suspense>
  );
}
