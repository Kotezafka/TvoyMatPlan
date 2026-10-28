'use client';

import { useCallback, useEffect, useRef, useState, type ChangeEvent, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
  useDataChannel,
  useLocalParticipant,
  useRoomContext,
  useTracks,
} from '@livekit/components-react';
import '@livekit/components-styles';
import '@excalidraw/excalidraw/index.css';
import { DisconnectReason, RoomEvent, Track } from 'livekit-client';
import { ArrowLeft, Loader2, Video, PenLine, LayoutPanelLeft, MonitorOff, PictureInPicture2, PanelRight, Maximize2, Minimize2, StopCircle, Mic, MicOff, QrCode, Copy, Smartphone, RotateCw, ZoomIn, ZoomOut, Crop, Check, Undo2, FlipHorizontal, Focus, Lightbulb, ChevronUp, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';
import { isPdfFile, pdfFileToImages } from '@/lib/pdf-to-images';
import { api } from '@/lib/api';
import {
  WB_BROADCAST_MS,
  WB_PAYLOAD_MAX,
  changedElements,
  chunkBoardElements,
  elementSyncKey,
  isNewerElement,
} from '@/lib/board-sync';
import { PracticePanel } from '@/components/lesson/practice-panel';
import { getDefaultNotebookCorners, NotebookPerspectiveView, type NotebookCorner, type NotebookCorners } from '@/components/lesson/notebook-perspective-view';
import type { LessonStatus } from '@/types';

const DOCK_DEFAULT = 280;
const DOCK_MIN = 180;
const DOCK_MAX_RATIO = 0.75;
const DOCK_COMPACT = 240;
const PIP_W = 300;
const PIP_H = 220;
const WB_FILE_SYNC_MAX = 8_000;
const NOTEBOOK_CAMERA_TOPIC = 'notebook-camera-control';

type NotebookCropPreferences = {
  version: 1;
  corners: NotebookCorners;
  rotation: 0 | 90 | 180 | 270;
  mirrorHorizontal: boolean;
  orientation: 'portrait' | 'landscape';
  applied: boolean;
};

type NotebookFocusState = {
  supported: boolean;
  min: number;
  max: number;
  step: number;
  current: number;
  autofocus: boolean;
};

type LiveAssistResult = {
  topic?: { id: string; title: string } | null;
  suggestion?: { id: string; title: string; task: string; reason?: string } | null;
  reason?: string;
};

function isNotebookCorners(value: unknown): value is NotebookCorners {
  return (
    Array.isArray(value) &&
    value.length === 4 &&
    value.every(
      (point) =>
        point &&
        typeof point === 'object' &&
        Number.isFinite((point as NotebookCorner).x) &&
        Number.isFinite((point as NotebookCorner).y) &&
        (point as NotebookCorner).x >= 0 &&
        (point as NotebookCorner).x <= 1 &&
        (point as NotebookCorner).y >= 0 &&
        (point as NotebookCorner).y <= 1,
    )
  );
}

function saveNotebookCropPreferences(key: string, preferences: NotebookCropPreferences) {
  try {
    localStorage.setItem(key, JSON.stringify(preferences));
  } catch {
    // The live camera controls remain usable when browser storage is disabled.
  }
}

// ─── Excalidraw: browser-only, no SSR ───────────────────────────────────────
const ExcalidrawComponent = dynamic(
  () =>
    import('@excalidraw/excalidraw').then((m) => {
      function ExcalidrawWithOpen(props: Record<string, any>) {
        const { onRequestOpenFile, ...rest } = props;
        return (
          <m.Excalidraw
            {...rest}
            UIOptions={{
              ...rest.UIOptions,
              canvasActions: {
                ...rest.UIOptions?.canvasActions,
                // Replace built-in loader (rejects PDF) with our handler via menu item
                loadScene: false,
              },
            }}
          >
            <m.MainMenu>
              <m.MainMenu.Item onSelect={() => onRequestOpenFile?.()}>
                Открыть файл
              </m.MainMenu.Item>
              <m.MainMenu.DefaultItems.SaveToActiveFile />
              <m.MainMenu.DefaultItems.Export />
              <m.MainMenu.DefaultItems.SaveAsImage />
              <m.MainMenu.DefaultItems.ClearCanvas />
              <m.MainMenu.DefaultItems.ChangeCanvasBackground />
            </m.MainMenu>
          </m.Excalidraw>
        );
      }
      return { default: ExcalidrawWithOpen };
    }),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-white dark:bg-zinc-900">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
      </div>
    ),
  },
);

// ─── Whiteboard with real-time sync via LiveKit data channel ─────────────────

function WhiteboardPanel({
  lessonId,
  onRegisterFlush,
  onBoardText,
}: {
  lessonId: string;
  onRegisterFlush?: (flush: (() => Promise<void>) | null) => void;
  onBoardText?: (text: string) => void;
}) {
  const apiRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const openInputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipRef = useRef(false);
  const boardLoadedRef = useRef(false);
  const boardRevisionRef = useRef(0);
  const clientIdRef = useRef(
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2),
  );
  const sentSyncRef = useRef(new Map<string, string>());
  const sentFilesRef = useRef(new Set<string>());
  const filesInFlightRef = useRef(new Set<string>());
  const pendingSceneRef = useRef<{
    elements: readonly any[];
    files?: Record<string, any>;
  } | null>(null);
  const sendingRef = useRef(false);
  const sendDirtyRef = useRef(false);
  const saveQueueRef = useRef<Promise<void>>(Promise.resolve());
  const latestSceneRef = useRef<{
    elements: readonly any[];
    appState: Record<string, any>;
    files: Record<string, any>;
    revision?: number;
    clientId?: string;
  } | null>(null);
  const enc = useRef(new TextEncoder());
  const dec = useRef(new TextDecoder());
  const panRef = useRef<{
    active: boolean;
    lastX: number;
    lastY: number;
    moved: boolean;
  } | null>(null);
  const importingRef = useRef(false);
  const remoteAssetsRef = useRef<Record<string, string>>({});

  const blobToDataURL = (blob: Blob) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });

  const packFileForSync = useCallback(
    async (file: any) => {
      if (!file?.id) return null;
      const knownAsset = remoteAssetsRef.current[file.id] || file.assetId;
      if (knownAsset) {
        return {
          id: file.id,
          mimeType: file.mimeType,
          assetId: knownAsset,
          created: file.created,
        };
      }
      const dataURL = file.dataURL as string | undefined;
      if (dataURL && dataURL.length <= WB_FILE_SYNC_MAX) {
        return file;
      }
      if (!dataURL) return null;
      try {
        const blob = await (await fetch(dataURL)).blob();
        const form = new FormData();
        form.append(
          'file',
          blob,
          `${file.id}.${(file.mimeType || 'image/png').split('/')[1] || 'png'}`,
        );
        const uploaded = await api.post<{ assetId: string; mimeType: string }>(
          `/lessons/${lessonId}/board-assets`,
          form,
        );
        remoteAssetsRef.current[file.id] = uploaded.assetId;
        return {
          id: file.id,
          mimeType: file.mimeType || uploaded.mimeType,
          assetId: uploaded.assetId,
          created: file.created,
        };
      } catch {
        toast.message('Не удалось загрузить изображение на сервер — синхронизация без файла');
        return null;
      }
    },
    [lessonId],
  );

  const resolveRemoteFiles = useCallback(
    async (files: any[]) => {
      const resolved: any[] = [];
      for (const file of files) {
        if (file?.assetId && !file.dataURL) {
          try {
            const blob = await api.getBlob(
              `/lessons/${lessonId}/board-assets/${file.assetId}`,
            );
            const dataURL = await blobToDataURL(blob);
            remoteAssetsRef.current[file.id] = file.assetId;
            resolved.push({ ...file, dataURL });
          } catch {
            /* skip missing remote file */
          }
        } else if (file) {
          if (file.assetId) remoteAssetsRef.current[file.id] = file.assetId;
          resolved.push(file);
        }
      }
      return resolved;
    },
    [lessonId],
  );

  const buildSnapshot = useCallback(
    (
      elements: readonly any[],
      appState: Record<string, any>,
      files: Record<string, any>,
    ) => ({
      elements: [...elements],
      appState: {
        viewBackgroundColor: appState?.viewBackgroundColor,
        gridSize: appState?.gridSize,
        gridStep: appState?.gridStep,
        gridModeEnabled: appState?.gridModeEnabled,
        scrollX: appState?.scrollX,
        scrollY: appState?.scrollY,
        zoom: appState?.zoom,
      },
      files: files || {},
      revision: boardRevisionRef.current,
      clientId: clientIdRef.current,
    }),
    [],
  );

  const mergeSnapshots = useCallback((remote: any, local: any) => {
    const elements = new Map<string, any>();
    for (const element of remote.elements || []) {
      elements.set(element.id, element);
    }
    for (const element of local.elements || []) {
      const previous = elements.get(element.id);
      if (!previous || isNewerElement(element, previous)) {
        elements.set(element.id, element);
      }
    }
    return {
      ...local,
      elements: Array.from(elements.values()),
      files: { ...(remote.files || {}), ...(local.files || {}) },
      revision: Number(remote.revision || 0),
      clientId: clientIdRef.current,
    };
  }, []);

  const saveSnapshot = useCallback(
    async (original: any) => {
      let snapshot = {
        ...original,
        revision: boardRevisionRef.current,
        clientId: clientIdRef.current,
      };
      try {
        const result = await api.put<{ revision: number }>(
          `/lessons/${lessonId}/board`,
          snapshot,
        );
        boardRevisionRef.current = result.revision;
      } catch (error: any) {
        if (error.response?.status !== 409) throw error;

        const remote = await api.get<any>(`/lessons/${lessonId}/board`);
        boardRevisionRef.current = Number(remote.revision || 0);
        snapshot = mergeSnapshots(remote, snapshot);
        snapshot.revision = boardRevisionRef.current;

        const result = await api.put<{ revision: number }>(
          `/lessons/${lessonId}/board`,
          snapshot,
        );
        boardRevisionRef.current = result.revision;

        const excalidrawApi = apiRef.current;
        if (excalidrawApi) {
          const missingFiles = Object.values(snapshot.files || {});
          if (missingFiles.length) excalidrawApi.addFiles(missingFiles);
          skipRef.current = true;
          excalidrawApi.updateScene({
            elements: snapshot.elements,
            captureUpdate: 'NEVER',
          });
        }
      }
    },
    [lessonId, mergeSnapshots],
  );

  const enqueueSave = useCallback(
    (snapshot: any) => {
      saveQueueRef.current = saveQueueRef.current
        .catch(() => undefined)
        .then(() => saveSnapshot(snapshot));
      return saveQueueRef.current;
    },
    [saveSnapshot],
  );

  const persistBoard = useCallback(
    (
      elements: readonly any[],
      appState: Record<string, any>,
      files: Record<string, any>,
      immediately = false,
    ) => {
      const snapshot = buildSnapshot(elements, appState, files);
      latestSceneRef.current = snapshot;
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

      const save = () => {
        void enqueueSave(snapshot).catch((error) =>
          console.warn('Не удалось сохранить доску', error),
        );
      };
      if (immediately) save();
      else saveTimerRef.current = setTimeout(save, 2_500);
    },
    [buildSnapshot, enqueueSave],
  );

  const applyRemoteElements = useCallback(
    (incoming: any[]) => {
      const excalidrawApi = apiRef.current;
      if (!excalidrawApi || !incoming?.length) return;
      const localElements =
        excalidrawApi.getSceneElementsIncludingDeleted?.() ||
        excalidrawApi.getSceneElements();
      const merged = mergeSnapshots(
        { elements: incoming, files: {}, revision: 0 },
        { elements: localElements, files: excalidrawApi.getFiles?.() || {} },
      );
      for (const remote of incoming) {
        const kept = merged.elements.find((element: any) => element.id === remote.id);
        if (kept && elementSyncKey(kept) === elementSyncKey(remote)) {
          sentSyncRef.current.set(remote.id, elementSyncKey(remote));
        }
      }
      skipRef.current = true;
      excalidrawApi.updateScene({
        elements: merged.elements,
        captureUpdate: 'NEVER',
      });
      persistBoard(
        merged.elements,
        excalidrawApi.getAppState(),
        excalidrawApi.getFiles?.() || {},
      );
    },
    [mergeSnapshots, persistBoard],
  );

  const { send } = useDataChannel('wb', (msg) => {
    let payload: { elements?: any[]; files?: any[] };
    try {
      payload = JSON.parse(dec.current.decode(msg.payload));
    } catch {
      return;
    }
    if (payload.elements?.length) applyRemoteElements(payload.elements);
    if (payload.files?.length) {
      void resolveRemoteFiles(payload.files).then((remoteFiles) => {
        if (remoteFiles.length && apiRef.current) {
          apiRef.current.addFiles(remoteFiles);
        }
      });
    }
  });

  const publishBoardPayload = useCallback(
    async (payload: { elements: any[]; files: any[] }) => {
      const body = enc.current.encode(JSON.stringify(payload));
      if (body.byteLength > WB_PAYLOAD_MAX) return false;
      await send(body, { reliable: true });
      return true;
    },
    [send],
  );

  const publishChangedElements = useCallback(
    async (elements: readonly any[]) => {
      const pending = changedElements(elements, sentSyncRef.current);
      if (!pending.length) return;
      const chunks = chunkBoardElements(pending);
      const sentIds = new Set(chunks.flat().map((element) => element.id));
      for (const chunk of chunks) {
        const delivered = await publishBoardPayload({ elements: chunk, files: [] });
        if (!delivered) throw new Error('board sync packet was not delivered');
      }
      for (const element of pending) {
        if (sentIds.has(element.id)) {
          sentSyncRef.current.set(element.id, elementSyncKey(element));
        }
      }
    },
    [publishBoardPayload],
  );

  const publishNewFiles = useCallback(
    async (files?: Record<string, any>) => {
      if (!files) return;
      const fresh = Object.values(files).filter(
        (file) =>
          file?.id &&
          !sentFilesRef.current.has(file.id) &&
          !filesInFlightRef.current.has(file.id),
      );
      if (!fresh.length) return;
      for (const file of fresh) filesInFlightRef.current.add(file.id);
      try {
        const packed: any[] = [];
        for (const file of fresh) {
          const next = await packFileForSync(file);
          if (next) packed.push(next);
        }
        let batch: any[] = [];
        const flush = async () => {
          if (!batch.length) return;
          const delivered = await publishBoardPayload({ elements: [], files: batch });
          if (!delivered) return;
          for (const file of batch) sentFilesRef.current.add(file.id);
          batch = [];
        };
        for (const file of packed) {
          const next = [...batch, file];
          if (
            batch.length &&
            enc.current.encode(JSON.stringify({ elements: [], files: next })).byteLength >
              WB_PAYLOAD_MAX
          ) {
            await flush();
            batch = [file];
          } else {
            batch = next;
          }
        }
        await flush();
      } finally {
        for (const file of fresh) filesInFlightRef.current.delete(file.id);
      }
    },
    [packFileForSync, publishBoardPayload],
  );

  const flushLiveBoard = useCallback(async () => {
    if (sendingRef.current) {
      sendDirtyRef.current = true;
      return;
    }
    sendingRef.current = true;
    try {
      do {
        sendDirtyRef.current = false;
        const pending = pendingSceneRef.current;
        if (!pending) break;
        await publishChangedElements(pending.elements);
        void publishNewFiles(pending.files).catch(() => undefined);
      } while (sendDirtyRef.current);
    } catch {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        void flushLiveBoard();
      }, 300);
    } finally {
      sendingRef.current = false;
    }
  }, [publishChangedElements, publishNewFiles]);

  const broadcast = useCallback(
    (elements: readonly any[], files?: Record<string, any>) => {
      pendingSceneRef.current = { elements, files };
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        void flushLiveBoard();
      }, WB_BROADCAST_MS);
    },
    [flushLiveBoard],
  );

  const handleChange = useCallback(
    (elements: readonly any[], appState: any, files: Record<string, any>) => {
      onBoardText?.(elements.filter((element: any) => !element.isDeleted && element.text).map((element: any) => element.text).join(' '));
      persistBoard(elements, appState, files);
      if (skipRef.current) {
        skipRef.current = false;
        return;
      }
      broadcast(elements, files);
    },
    [broadcast, onBoardText, persistBoard],
  );

  const loadSavedBoard = useCallback(
    async (excalidrawApi: any) => {
      if (boardLoadedRef.current) return;
      boardLoadedRef.current = true;
      try {
        const scene = await api.get<{
          elements?: any[];
          appState?: Record<string, any>;
          files?: Record<string, any>;
          revision?: number;
        }>(`/lessons/${lessonId}/board`);
        boardRevisionRef.current = Number(scene.revision || 0);
        if (scene.files && Object.keys(scene.files).length) {
          excalidrawApi.addFiles(Object.values(scene.files));
        }
        const localElements =
          excalidrawApi.getSceneElementsIncludingDeleted?.() ||
          excalidrawApi.getSceneElements();
        const merged = mergeSnapshots(
          { elements: scene.elements || [], files: scene.files || {}, revision: scene.revision },
          { elements: localElements, files: excalidrawApi.getFiles?.() || {} },
        );
        if (merged.elements.length || scene.appState) {
          skipRef.current = true;
          excalidrawApi.updateScene({
            elements: merged.elements,
            appState: scene.appState || {},
            captureUpdate: 'NEVER',
          });
        }
        for (const remote of scene.elements || []) {
          const kept = merged.elements.find((element: any) => element.id === remote.id);
          if (kept && elementSyncKey(kept) === elementSyncKey(remote)) {
            sentSyncRef.current.set(remote.id, elementSyncKey(remote));
          }
        }
      } catch (error) {
        boardLoadedRef.current = false;
        console.warn('Не удалось загрузить сохранённую доску', error);
      }
    },
    [lessonId, mergeSnapshots],
  );

  useEffect(() => {
    let cancelled = false;

    const mergeFromStorage = async () => {
      const excalidrawApi = apiRef.current;
      if (!excalidrawApi || !boardLoadedRef.current) return;
      try {
        const scene = await api.get<{
          elements?: any[];
          files?: Record<string, any>;
          revision?: number;
        }>(`/lessons/${lessonId}/board`);
        if (cancelled) return;
        boardRevisionRef.current = Math.max(
          boardRevisionRef.current,
          Number(scene.revision || 0),
        );

        const localFiles = excalidrawApi.getFiles() || {};
        const missingFiles = Object.values(scene.files || {}).filter(
          (file: any) => !localFiles[file.id],
        );
        if (missingFiles.length) excalidrawApi.addFiles(missingFiles);

        const localElements =
          excalidrawApi.getSceneElementsIncludingDeleted?.() ||
          excalidrawApi.getSceneElements();
        const merged = new Map<string, any>(
          localElements.map((element: any) => [element.id, element]),
        );
        let changed = false;

        for (const remote of scene.elements || []) {
          const local = merged.get(remote.id);
          if (isNewerElement(remote, local)) {
            merged.set(remote.id, remote);
            sentSyncRef.current.set(remote.id, elementSyncKey(remote));
            changed = true;
          }
        }

        if (changed) {
          skipRef.current = true;
          excalidrawApi.updateScene({
            elements: Array.from(merged.values()),
            captureUpdate: 'NEVER',
          });
        }
      } catch {
        // Autosave may briefly be unavailable; retry on the next interval.
      }
    };

    const interval = window.setInterval(mergeFromStorage, 1_000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [lessonId]);

  const flushBoard = useCallback(async () => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    const excalidrawApi = apiRef.current;
    if (!excalidrawApi) return;
    const snapshot = buildSnapshot(
      excalidrawApi.getSceneElementsIncludingDeleted?.() ||
        excalidrawApi.getSceneElements(),
      excalidrawApi.getAppState(),
      excalidrawApi.getFiles(),
    );
    latestSceneRef.current = snapshot;
    await enqueueSave(snapshot);
  }, [buildSnapshot, enqueueSave]);

  useEffect(() => {
    onRegisterFlush?.(flushBoard);
    return () => onRegisterFlush?.(null);
  }, [flushBoard, onRegisterFlush]);

  const unloadSentRef = useRef(false);

  useEffect(() => {
    const onLeave = () => {
      if (unloadSentRef.current) return;
      unloadSentRef.current = true;
      const latest = latestSceneRef.current;
      if (!latest) return;
      api.putKeepalive(`/lessons/${lessonId}/board`, {
        ...latest,
        revision: boardRevisionRef.current,
        clientId: clientIdRef.current,
      });
    };
    window.addEventListener('pagehide', onLeave);
    return () => window.removeEventListener('pagehide', onLeave);
  }, [lessonId]);

  useEffect(
    () => () => {
      if (unloadSentRef.current) return;
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      const latest = latestSceneRef.current;
      if (latest) {
        void enqueueSave({
          ...latest,
          revision: boardRevisionRef.current,
          clientId: clientIdRef.current,
        });
      }
    },
    [enqueueSave, lessonId],
  );

  const insertPdfAsImages = useCallback(
    async (file: File) => {
      const api = apiRef.current;
      if (!api) return;
      const mod = await import('@excalidraw/excalidraw');
      toast.message('Загрузка PDF…');
      const { pages, truncated } = await pdfFileToImages(file);
      if (truncated) {
        toast.message('PDF обрезан до 15 страниц');
      }
      const appState = api.getAppState();
      const startX = -appState.scrollX + 40 / appState.zoom.value;
      let y = -appState.scrollY + 40 / appState.zoom.value;
      const gap = 24;
      const maxW = 720;

      const binaryFiles: any[] = [];
      const skeletons: any[] = [];

      for (const page of pages) {
        const scale = Math.min(1, maxW / page.width);
        const w = page.width * scale;
        const h = page.height * scale;
        const fileId = `pdf-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        binaryFiles.push({
          id: fileId,
          dataURL: page.dataURL,
          mimeType: 'image/jpeg',
          created: Date.now(),
          lastRetrieved: Date.now(),
        });
        skeletons.push({
          type: 'image',
          fileId,
          x: startX,
          y,
          width: w,
          height: h,
          status: 'saved',
        });
        y += h + gap;
      }

      api.addFiles(binaryFiles);
      const imageElements = mod.convertToExcalidrawElements(skeletons as any);
      const next = [...api.getSceneElements(), ...imageElements];
      api.updateScene({ elements: next });
      broadcast(next, api.getFiles());
      toast.success(
        pages.length === 1
          ? 'PDF добавлен на доску'
          : `PDF: ${pages.length} стр. добавлено на доску`,
      );
    },
    [broadcast],
  );

  const loadSceneOrImage = useCallback(
    async (file: File) => {
      const api = apiRef.current;
      if (!api) return;
      const mod = await import('@excalidraw/excalidraw');

      if (file.type.startsWith('image/') || /\.(png|jpe?g|gif|webp|svg|bmp)$/i.test(file.name)) {
        // Try as Excalidraw scene embedded in PNG first
        if (/\.excalidraw\.png$/i.test(file.name) || file.type === 'image/png') {
          try {
            const contents = await mod.loadFromBlob(file, api.getAppState(), api.getSceneElements());
            api.updateScene({
              elements: contents.elements,
              appState: { ...(contents.appState || {}), collaborators: new Map() },
            });
            if (contents.files) api.addFiles(Object.values(contents.files));
            broadcast(contents.elements, contents.files || api.getFiles());
            toast.success('Сцена загружена');
            return;
          } catch {
            /* plain image */
          }
        }

        const fileId = `img-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        const dataURL = await mod.getDataURL(file);
        api.addFiles([
          {
            id: fileId,
            dataURL,
            mimeType: file.type || 'image/png',
            created: Date.now(),
            lastRetrieved: Date.now(),
          },
        ]);
        const dims = await new Promise<{ w: number; h: number }>((resolve) => {
          const img = new Image();
          img.onload = () => resolve({ w: img.naturalWidth || 400, h: img.naturalHeight || 300 });
          img.onerror = () => resolve({ w: 400, h: 300 });
          img.src = dataURL;
        });
        const appState = api.getAppState();
        const maxW = Math.min(dims.w, 640);
        const scale = maxW / dims.w;
        const w = maxW;
        const h = dims.h * scale;
        const x = -appState.scrollX + appState.width / 2 / appState.zoom.value - w / 2;
        const y = -appState.scrollY + appState.height / 2 / appState.zoom.value - h / 2;
        const [el] = mod.convertToExcalidrawElements([
          { type: 'image', fileId, x, y, width: w, height: h, status: 'saved' } as any,
        ]);
        const next = [...api.getSceneElements(), el];
        api.updateScene({ elements: next });
        broadcast(next, api.getFiles());
        toast.success('Изображение добавлено');
        return;
      }

      // .excalidraw / .json scene
      const contents = await mod.loadFromBlob(file, api.getAppState(), api.getSceneElements());
      api.updateScene({
        elements: contents.elements,
        appState: { ...(contents.appState || {}), collaborators: new Map() },
      });
      if (contents.files) api.addFiles(Object.values(contents.files));
      broadcast(contents.elements, contents.files || api.getFiles());
      toast.success('Сцена загружена');
    },
    [broadcast],
  );

  const importFiles = useCallback(
    async (files: File[]) => {
      if (!files.length || importingRef.current) return;
      importingRef.current = true;
      try {
        for (const file of files) {
          if (isPdfFile(file)) {
            await insertPdfAsImages(file);
          } else {
            await loadSceneOrImage(file);
          }
        }
      } catch (err) {
        console.error(err);
        toast.error(err instanceof Error ? err.message : 'Не удалось загрузить файл');
      } finally {
        importingRef.current = false;
      }
    },
    [insertPdfAsImages, loadSceneOrImage],
  );

  const onRequestOpenFile = useCallback(() => {
    openInputRef.current?.click();
  }, []);

  const onOpenInputChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const list = Array.from(e.target.files || []);
      e.target.value = '';
      await importFiles(list);
    },
    [importFiles],
  );

  // Intercept native Excalidraw PDF drops / file inputs so it doesn't throw "invalid file"
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onDragOver = (e: DragEvent) => {
      const items = e.dataTransfer?.items;
      if (!items) return;
      const hasPdf = Array.from(items).some(
        (it) => it.kind === 'file' && (it.type === 'application/pdf' || it.type === ''),
      );
      if (!hasPdf) return;
      e.preventDefault();
      e.stopPropagation();
    };

    const onDrop = (e: DragEvent) => {
      const files = Array.from(e.dataTransfer?.files || []);
      const pdfs = files.filter(isPdfFile);
      if (!pdfs.length) return;
      e.preventDefault();
      e.stopPropagation();
      void importFiles(pdfs);
    };

    const onChangeCapture = (e: Event) => {
      const input = e.target as HTMLInputElement;
      if (!(input instanceof HTMLInputElement) || input.type !== 'file') return;
      if (input === openInputRef.current) return;
      const files = Array.from(input.files || []);
      const pdfs = files.filter(isPdfFile);
      if (!pdfs.length) return;
      // Stop Excalidraw from parsing PDF as a scene → "Error: invalid file"
      e.stopImmediatePropagation();
      e.preventDefault();
      input.value = '';
      void importFiles(pdfs);
    };

    el.addEventListener('dragover', onDragOver, true);
    el.addEventListener('drop', onDrop, true);
    el.addEventListener('change', onChangeCapture, true);
    return () => {
      el.removeEventListener('dragover', onDragOver, true);
      el.removeEventListener('drop', onDrop, true);
      el.removeEventListener('change', onChangeCapture, true);
    };
  }, [importFiles]);

  // Second click on the same toolbar tool collapses the left settings panel
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const resolveToolKey = (target: HTMLElement): string | null => {
      const testIdBtn = target.closest('[data-testid^="toolbar-"]') as HTMLElement | null;
      if (testIdBtn && el.contains(testIdBtn)) {
        const id = (testIdBtn.getAttribute('data-testid') || '').replace(/^toolbar-/i, '').toLowerCase();
        if (id === 'laserpointer') return 'laser';
        if (id && !['container', 'content', 'lock'].includes(id)) return id;
      }

      const label = target.closest('label.ToolIcon') as HTMLLabelElement | null;
      if (label && el.contains(label)) {
        const input = label.querySelector('input') as HTMLInputElement | null;
        const value = input?.value?.toLowerCase();
        if (value) return value;
      }

      return null;
    };

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target || !el.contains(target)) return;
      if (!target.closest('.App-toolbar, .App-toolbar-container')) return;

      const toolKey = resolveToolKey(target);
      if (!toolKey) return;

      const api = apiRef.current;
      if (!api) return;

      const activeBefore = String(api.getAppState().activeTool?.type || '').toLowerCase();
      const handOnBefore = !!el.querySelector('[data-testid="toolbar-hand"] input:checked');
      const wasActive =
        activeBefore === toolKey ||
        (toolKey === 'hand' && (activeBefore === 'hand' || handOnBefore));

      if (wasActive) {
        el.classList.toggle('wb-panel-collapsed');
        if (el.classList.contains('wb-panel-collapsed')) {
          api.updateScene({
            appState: { openMenu: null },
            captureUpdate: 'NEVER',
          });
        }
      } else {
        el.classList.remove('wb-panel-collapsed');
      }
    };

    el.addEventListener('click', onClick, true);
    return () => el.removeEventListener('click', onClick, true);
  }, []);

  // Wheel zoom without Ctrl + RMB pan without context menu popup
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const isUiTarget = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return true;
      return !!target.closest(
        'input, textarea, button, a, label, select, .App-menu, .App-toolbar, .context-menu, .Stack, [class*="dropdown"], [class*="Dialog"], [class*="Island"]',
      );
    };

    const onWheel = (e: WheelEvent) => {
      if (!el.contains(e.target as Node)) return;
      if (isUiTarget(e.target)) return;
      if (e.ctrlKey || e.metaKey) return;

      e.preventDefault();
      e.stopPropagation();

      const zoomEvent = new WheelEvent('wheel', {
        deltaX: e.deltaX,
        deltaY: e.deltaY,
        deltaZ: e.deltaZ,
        deltaMode: e.deltaMode,
        clientX: e.clientX,
        clientY: e.clientY,
        screenX: e.screenX,
        screenY: e.screenY,
        ctrlKey: true,
        bubbles: true,
        cancelable: true,
        view: window,
      });
      (e.target as EventTarget).dispatchEvent(zoomEvent);
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 2) return;
      if (!el.contains(e.target as Node)) return;
      if (isUiTarget(e.target)) return;
      if (!apiRef.current) return;
      e.preventDefault();
      e.stopPropagation();
      panRef.current = { active: true, lastX: e.clientX, lastY: e.clientY, moved: false };
      apiRef.current.setCursor?.('grabbing');
      el.querySelectorAll('.context-menu').forEach((node) => node.remove());
    };

    const onPointerMove = (e: PointerEvent) => {
      const pan = panRef.current;
      if (!pan?.active || !apiRef.current) return;
      const dx = e.clientX - pan.lastX;
      const dy = e.clientY - pan.lastY;
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) pan.moved = true;
      pan.lastX = e.clientX;
      pan.lastY = e.clientY;
      const appState = apiRef.current.getAppState();
      const zoom = appState.zoom?.value ?? 1;
      apiRef.current.updateScene({
        appState: {
          scrollX: appState.scrollX + dx / zoom,
          scrollY: appState.scrollY + dy / zoom,
        },
        captureUpdate: 'NEVER',
      });
    };

    const endPan = () => {
      if (!panRef.current?.active) return;
      panRef.current.active = false;
      apiRef.current?.resetCursor?.();
      requestAnimationFrame(() => {
        el.querySelectorAll('.context-menu').forEach((node) => node.remove());
        document.querySelectorAll('.excalidraw .context-menu').forEach((node) => node.remove());
      });
    };

    const onContextMenu = (e: Event) => {
      if (!el.contains(e.target as Node)) return;
      if (isUiTarget(e.target)) return;
      e.preventDefault();
      e.stopPropagation();
    };

    const refreshBoard = () => {
      requestAnimationFrame(() => apiRef.current?.refresh?.());
    };

    el.addEventListener('wheel', onWheel, { capture: true, passive: false });
    el.addEventListener('pointerdown', onPointerDown, true);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', endPan);
    window.addEventListener('pointercancel', endPan);
    el.addEventListener('contextmenu', onContextMenu, true);
    document.addEventListener('fullscreenchange', refreshBoard);
    window.addEventListener('resize', refreshBoard);

    return () => {
      el.removeEventListener('wheel', onWheel, true);
      el.removeEventListener('pointerdown', onPointerDown, true);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', endPan);
      window.removeEventListener('pointercancel', endPan);
      el.removeEventListener('contextmenu', onContextMenu, true);
      document.removeEventListener('fullscreenchange', refreshBoard);
      window.removeEventListener('resize', refreshBoard);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative lesson-whiteboard"
      style={{ background: 'var(--color-surface)' }}
    >
      <input
        ref={openInputRef}
        type="file"
        className="hidden"
        accept="application/pdf,.pdf,image/*,.excalidraw,.json,.excalidrawlib"
        onChange={onOpenInputChange}
      />
      <ExcalidrawComponent
        langCode="ru-RU"
        excalidrawAPI={(api: any) => {
          apiRef.current = api;
          void loadSavedBoard(api);
        }}
        onChange={handleChange}
        onRequestOpenFile={onRequestOpenFile}
        UIOptions={{
          canvasActions: {
            export: { saveFileToDisk: true },
          },
          tools: { image: true },
        }}
      />
    </div>
  );
}

// ─── Explicit stop screen share (fixes stuck share with audio) ───────────────

function StopScreenShareButton() {
  const room = useRoomContext();
  const { isScreenShareEnabled, localParticipant } = useLocalParticipant();
  const [stopping, setStopping] = useState(false);

  if (!isScreenShareEnabled) return null;

  const stopShare = async () => {
    if (stopping) return;
    setStopping(true);
    try {
      await localParticipant.setScreenShareEnabled(false);
      // Force-unpublish leftover screen tracks (known LiveKit issue with share+audio)
      const pubs = Array.from(localParticipant.trackPublications.values());
      for (const pub of pubs) {
        if (
          pub.track &&
          (pub.source === Track.Source.ScreenShare ||
            pub.source === Track.Source.ScreenShareAudio)
        ) {
          await localParticipant.unpublishTrack(pub.track);
        }
      }
      // Also stop only leftover screen-share MediaStreamTracks if still live.
      for (const pub of pubs) {
        if (
          pub.source === Track.Source.ScreenShare ||
          pub.source === Track.Source.ScreenShareAudio
        ) {
          pub.track?.mediaStreamTrack?.stop();
        }
      }
    } catch (err) {
      console.error('Failed to stop screen share', err);
      try {
        await room.localParticipant.setScreenShareEnabled(false);
      } catch {
        /* ignore */
      }
    } finally {
      setStopping(false);
    }
  };

  return (
    <button
      type="button"
      onClick={stopShare}
      disabled={stopping}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-red-600 text-white hover:bg-red-700 disabled:opacity-60 transition-colors"
      title="Отключить демонстрацию экрана"
    >
      {stopping ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <MonitorOff className="h-3.5 w-3.5" />
      )}
      <span className="hidden sm:inline">Отключить демонстрацию</span>
    </button>
  );
}

function MicrophoneToggle() {
  const { isMicrophoneEnabled, localParticipant } = useLocalParticipant();
  const [changing, setChanging] = useState(false);

  const toggleMicrophone = async () => {
    setChanging(true);
    try {
      await localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled);
    } catch {
      toast.error('Не удалось изменить состояние микрофона');
    } finally {
      setChanging(false);
    }
  };

  return (
    <button
      type="button"
      onClick={() => void toggleMicrophone()}
      disabled={changing}
      aria-pressed={isMicrophoneEnabled}
      aria-label={isMicrophoneEnabled ? 'Выключить микрофон' : 'Включить микрофон'}
      title={isMicrophoneEnabled ? 'Выключить микрофон' : 'Включить микрофон'}
      className={[
        'flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors disabled:opacity-60',
        isMicrophoneEnabled
          ? 'border-emerald-500/35 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20'
          : 'border-red-500/35 bg-red-500/10 text-red-700 hover:bg-red-500/20',
      ].join(' ')}
    >
      {isMicrophoneEnabled ? <Mic className="h-3.5 w-3.5" /> : <MicOff className="h-3.5 w-3.5" />}
      <span className="hidden sm:inline">{isMicrophoneEnabled ? 'Микрофон включён' : 'Микрофон выключен'}</span>
    </button>
  );
}

// ─── View mode toggle ────────────────────────────────────────────────────────

type ViewMode = 'video' | 'split' | 'board';

const VIEW_MODES: { mode: ViewMode; Icon: typeof Video; label: string }[] = [
  { mode: 'video', Icon: Video, label: 'Видео' },
  { mode: 'split', Icon: LayoutPanelLeft, label: 'Видео + Доска' },
  { mode: 'board', Icon: PenLine, label: 'Доска' },
];

/** Renders phone notebook cameras as a live, movable window over the shared board. */
function NotebookCameraBoardOverlay({ lessonId, rightOffset }: { lessonId: string; rightOffset: number }) {
  const cameraTracks = useTracks([Track.Source.Camera], { onlySubscribed: true });
  const { localParticipant } = useLocalParticipant();
  const room = useRoomContext();
  const cameraTrack = cameraTracks
    .filter(
      (track) =>
        track.participant.identity.startsWith('camera-') &&
        Boolean(track.publication.track),
    )
    .at(-1);
  const [collapsed, setCollapsed] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [frameWidth, setFrameWidth] = useState(280);
  const [position, setPosition] = useState({ x: 16, y: 16 });
  const [cropEditing, setCropEditing] = useState(false);
  const [cropApplied, setCropApplied] = useState(false);
  const [cropCorners, setCropCorners] = useState<NotebookCorners>(getDefaultNotebookCorners);
  const [rotation, setRotation] = useState<0 | 90 | 180 | 270>(0);
  const [mirrorHorizontal, setMirrorHorizontal] = useState(false);
  const [focusOpen, setFocusOpen] = useState(false);
  const [focusAvailable, setFocusAvailable] = useState<boolean | null>(null);
  const [focusState, setFocusState] = useState<NotebookFocusState | null>(null);
  const [focusDistance, setFocusDistance] = useState(0);
  const [focusPending, setFocusPending] = useState(false);
  const [focusError, setFocusError] = useState('');
  const cropStorageKey = `lesson-notebook-crop:${lessonId}`;
  const overlayRef = useRef<HTMLDivElement>(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const resizeRef = useRef({ startX: 0, startWidth: 280 });
  const focusSendTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // A phone can reconnect with a new identity while LiveKit still exposes the
  // old publication for one render. Keep the overlay bound to the newest
  // camera publication and force a fresh video element when it changes.
  const cameraKey = cameraTrack
    ? `${cameraTrack.participant.identity}:${cameraTrack.publication.trackSid || cameraTrack.publication.source}`
    : 'no-camera';

  useEffect(() => {
    // A new QR connection can publish a fresh track. Restore the teacher's
    // saved crop for this lesson, or start with a clean frame.
    if (cameraKey === 'no-camera') return;
    setCropEditing(false);
    setCropApplied(false);
    setCropCorners(getDefaultNotebookCorners());
    setRotation(0);
    setMirrorHorizontal(false);
    setOrientation('portrait');
    try {
      const saved = localStorage.getItem(cropStorageKey);
      if (!saved) return;
      const parsed = JSON.parse(saved) as unknown;
      // Earlier builds stored only the four points as a JSON array.
      if (isNotebookCorners(parsed)) {
        setCropCorners(parsed);
        setCropApplied(true);
      } else if (parsed && typeof parsed === 'object') {
        const preferences = parsed as Partial<NotebookCropPreferences>;
        if (isNotebookCorners(preferences.corners)) {
          setCropCorners(preferences.corners);
          setCropApplied(preferences.applied !== false);
        }
        if ([0, 90, 180, 270].includes(preferences.rotation as number)) {
          setRotation(preferences.rotation as 0 | 90 | 180 | 270);
        }
        setMirrorHorizontal(preferences.mirrorHorizontal === true);
        if (
          (preferences.rotation !== undefined && preferences.rotation !== 0) ||
          preferences.mirrorHorizontal === true
        ) {
          setCropApplied(true);
        }
        if (preferences.orientation === 'portrait' || preferences.orientation === 'landscape') {
          setOrientation(preferences.orientation);
        }
      }
    } catch {
      // Ignore malformed local preferences and keep the default frame.
    }
  }, [cameraKey, cropStorageKey]);

  const saveCropPreferences = (
    updates: Partial<Pick<NotebookCropPreferences, 'corners' | 'rotation' | 'mirrorHorizontal' | 'orientation' | 'applied'>> = {},
  ) => {
    saveNotebookCropPreferences(cropStorageKey, {
      version: 1,
      corners: updates.corners ?? cropCorners,
      rotation: updates.rotation ?? rotation,
      mirrorHorizontal: updates.mirrorHorizontal ?? mirrorHorizontal,
      orientation: updates.orientation ?? orientation,
      applied: updates.applied ?? cropApplied,
    });
  };

  const aspectRatio = orientation === 'portrait' ? 9 / 16 : 16 / 9;
  const updateRotation = (next: 0 | 90 | 180 | 270) => {
    setRotation(next);
    setCropApplied(true);
    const nextOrientation = next === 90 || next === 270 ? 'portrait' : 'landscape';
    setOrientation(nextOrientation);
    saveCropPreferences({ rotation: next, orientation: nextOrientation, applied: true });
  };

  const sendFocusCommand = useCallback(
    async (message: Record<string, unknown>) => {
      if (!cameraTrack) return;
      const isFocusChange = message.type === 'set-focus' || message.type === 'autofocus';
      if (isFocusChange) {
        setFocusPending(true);
        setFocusError('');
      }
      try {
        await localParticipant.publishData(
          new TextEncoder().encode(JSON.stringify(message)),
          {
            reliable: true,
            topic: NOTEBOOK_CAMERA_TOPIC,
            destinationIdentities: [cameraTrack.participant.identity],
          },
        );
      } catch {
        if (isFocusChange) {
          setFocusPending(false);
          setFocusError('Не удалось отправить команду телефону. Проверьте связь с камерой.');
        }
      }
    },
    [cameraTrack, localParticipant],
  );

  useEffect(() => {
    if (cameraKey === 'no-camera') {
      setFocusAvailable(null);
      setFocusState(null);
      setFocusPending(false);
      return;
    }
    setFocusAvailable(null);
    setFocusState(null);
    setFocusPending(false);
    setFocusError('');
  }, [cameraKey]);

  useEffect(() => {
    if (!cameraTrack) return;
    const cameraIdentity = cameraTrack.participant.identity;
    const onDataReceived = (
      payload: Uint8Array,
      participant?: { identity: string },
      _kind?: unknown,
      topic?: string,
    ) => {
      if (
        topic !== NOTEBOOK_CAMERA_TOPIC ||
        participant?.identity !== cameraIdentity
      ) {
        return;
      }
      let message: Record<string, unknown>;
      try {
        message = JSON.parse(new TextDecoder().decode(payload));
      } catch {
        return;
      }
      if (message.type === 'focus-capabilities') {
        if (message.supported !== true) {
          setFocusAvailable(false);
          setFocusState(null);
          setFocusPending(false);
          return;
        }
        const min = Number(message.min);
        const max = Number(message.max);
        const step = Number(message.step);
        const current = Number(message.current);
        if (![min, max, step, current].every(Number.isFinite) || max <= min || step <= 0) return;
        setFocusAvailable(true);
        setFocusState({
          supported: true,
          min,
          max,
          step,
          current,
          autofocus: message.autofocus === true,
        });
        setFocusDistance(Math.max(min, Math.min(max, current)));
        setFocusPending(false);
        setFocusError('');
      } else if (message.type === 'focus-result') {
        setFocusPending(false);
        if (message.ok === true) {
          const value = Number(message.value);
          setFocusState((previous) => previous ? {
            ...previous,
            ...(Number.isFinite(value) ? { current: value } : {}),
            autofocus: previous.autofocus || message.autofocus === true,
          } : previous);
          if (Number.isFinite(value)) setFocusDistance(value);
          setFocusError('');
        } else {
          setFocusError('Телефон не смог применить фокус. Верните автофокус и попробуйте ещё раз.');
        }
      }
    };
    room.on(RoomEvent.DataReceived, onDataReceived);
    return () => {
      room.off(RoomEvent.DataReceived, onDataReceived);
    };
  }, [cameraKey, cameraTrack, room]);

  useEffect(() => {
    if (!focusOpen || !cameraTrack) return;
    void sendFocusCommand({ type: 'focus-probe' });
  }, [cameraKey, cameraTrack, focusOpen, sendFocusCommand]);

  const changeFocus = (value: number) => {
    setFocusDistance(value);
    if (focusSendTimerRef.current) clearTimeout(focusSendTimerRef.current);
    focusSendTimerRef.current = setTimeout(() => {
      void sendFocusCommand({ type: 'set-focus', value });
    }, 120);
  };
  const maxFrameWidth = (ratio = aspectRatio) => {
    const stage = overlayRef.current?.parentElement;
    if (!stage) return 560;
    const widthLimit = stage.clientWidth - rightOffset - 32;
    // Keep a portrait frame usable on short laptop screens as well.
    const heightLimit = Math.max(180, (stage.clientHeight - 72) * ratio);
    return Math.max(180, Math.min(560, widthLimit, heightLimit));
  };

  const toggleOrientation = () => {
    const next = orientation === 'portrait' ? 'landscape' : 'portrait';
    const nextRatio = next === 'portrait' ? 9 / 16 : 16 / 9;
    setOrientation(next);
    saveCropPreferences({ orientation: next });
    setFrameWidth((width) => Math.min(next === 'portrait' ? 360 : 480, width, maxFrameWidth(nextRatio)));
  };

  const toggleSize = () => {
    const maxWidth = maxFrameWidth();
    setFrameWidth((width) => (width < maxWidth - 24 ? maxWidth : orientation === 'portrait' ? 280 : 360));
  };

  const startResize = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    resizeRef.current = { startX: event.clientX, startWidth: frameWidth };
    event.currentTarget.setPointerCapture(event.pointerId);
    setResizing(true);
  };

  const resizeOverlay = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!resizing) return;
    const width = resizeRef.current.startWidth + event.clientX - resizeRef.current.startX;
    setFrameWidth(Math.min(maxFrameWidth(), Math.max(180, width)));
  };

  const finishResize = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setResizing(false);
  };

  const startDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest('button')) return;
    event.preventDefault();
    const rect = overlayRef.current?.getBoundingClientRect();
    if (!rect) return;
    dragOffsetRef.current = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
  };

  const moveOverlay = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    const overlay = overlayRef.current;
    const stage = overlay?.parentElement;
    if (!overlay || !stage) return;
    const stageRect = stage.getBoundingClientRect();
    const maxX = Math.max(8, stage.clientWidth - rightOffset - overlay.offsetWidth - 8);
    const maxY = Math.max(8, stage.clientHeight - overlay.offsetHeight - 8);
    setPosition({
      x: Math.min(maxX, Math.max(8, event.clientX - stageRect.left - dragOffsetRef.current.x)),
      y: Math.min(maxY, Math.max(8, event.clientY - stageRect.top - dragOffsetRef.current.y)),
    });
  };

  if (!cameraTrack) return null;

  return (
    <div
      ref={overlayRef}
      data-testid="notebook-camera-board-overlay"
      className={`notebook-camera-board-overlay absolute z-20 overflow-hidden rounded-xl border border-[rgb(var(--border))] shadow-xl ${collapsed ? 'bg-[#3F1116]' : 'bg-black'}`}
      style={{
        left: position.x,
        top: position.y,
        right: 'auto',
        width: collapsed ? 'min(15rem, calc(100% - 2rem))' : `min(${frameWidth}px, calc(100% - ${rightOffset + 32}px))`,
      }}
    >
      <div
        className={`flex h-9 items-center gap-1.5 border-b border-white/10 bg-[#3F1116] px-2 text-[#FFF1E9] ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onPointerDown={startDrag}
        onPointerMove={moveOverlay}
        onPointerUp={() => setDragging(false)}
        onPointerCancel={() => setDragging(false)}
      >
        <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-emerald-400" aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate text-[11px] font-medium">{collapsed ? 'Камера тетради скрыта' : 'Камера тетради · на доске'}</span>
        {collapsed ? (
          <button
            type="button"
            className="shrink-0 rounded px-1.5 py-1 text-[11px] font-medium hover:bg-white/10"
            aria-label="Развернуть камеру тетради"
            aria-expanded="false"
            onClick={() => setCollapsed(false)}
            onPointerDown={(event) => event.stopPropagation()}
          >
            Показать
          </button>
        ) : (
          <>
        <button
          type="button"
          className="rounded p-1 hover:bg-white/10"
          aria-label={cropEditing ? 'Применить область тетради' : 'Настроить область тетради'}
          title={cropEditing ? 'Применить область' : 'Настроить область тетради'}
          onClick={() => {
            if (cropEditing) {
              setCropApplied(true);
              setCropEditing(false);
            saveCropPreferences({ corners: cropCorners, applied: true });
            } else {
              setCropEditing(true);
            }
          }}
          onPointerDown={(event) => event.stopPropagation()}
        >
          {cropEditing ? <Check className="h-3.5 w-3.5" /> : <Crop className="h-3.5 w-3.5" />}
        </button>
        <button
          type="button"
          className="rounded p-1 hover:bg-white/10"
          aria-label="Повернуть изображение тетради"
          title="Повернуть изображение"
          onClick={() => updateRotation(rotation === 270 ? 0 : (rotation + 90) as 0 | 90 | 180 | 270)}
          onPointerDown={(event) => event.stopPropagation()}
        >
          <Smartphone className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          className={`rounded p-1 hover:bg-white/10 ${mirrorHorizontal ? 'bg-white/15' : ''}`}
          aria-label={mirrorHorizontal ? 'Вернуть обычное изображение' : 'Отразить изображение по горизонтали'}
          aria-pressed={mirrorHorizontal}
          title={mirrorHorizontal ? 'Вернуть обычное изображение' : 'Отразить по горизонтали'}
          onClick={() => {
            const next = !mirrorHorizontal;
            setMirrorHorizontal(next);
            setCropApplied(true);
            saveCropPreferences({ mirrorHorizontal: next, applied: true });
          }}
          onPointerDown={(event) => event.stopPropagation()}
        >
          <FlipHorizontal className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          className={`rounded p-1 hover:bg-white/10 ${focusOpen ? 'bg-white/15' : ''}`}
          aria-label="Настроить фокус камеры телефона"
          aria-expanded={focusOpen}
          title="Ручной фокус"
          onClick={() => setFocusOpen((value) => !value)}
          onPointerDown={(event) => event.stopPropagation()}
        >
          <Focus className="h-3.5 w-3.5" />
        </button>
        {cropEditing && (
          <button
            type="button"
            className="rounded p-1 hover:bg-white/10"
            aria-label="Сбросить точки тетради"
            title="Сбросить точки"
            onClick={() => {
              setCropCorners(getDefaultNotebookCorners());
              setCropApplied(false);
              setRotation(0);
              setMirrorHorizontal(false);
              setOrientation('portrait');
              try {
                localStorage.removeItem(cropStorageKey);
              } catch {
                // Resetting the current image must still work without storage.
              }
            }}
            onPointerDown={(event) => event.stopPropagation()}
          >
            <Undo2 className="h-3.5 w-3.5" />
          </button>
        )}
        <button
          type="button"
          className="rounded p-1 hover:bg-white/10"
          aria-label={orientation === 'portrait' ? 'Переключить на альбомный формат' : 'Переключить на формат телефона'}
          title={orientation === 'portrait' ? 'Альбомный формат' : 'Формат телефона'}
          onClick={toggleOrientation}
          onPointerDown={(event) => event.stopPropagation()}
        >
          <RotateCw className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          className="rounded p-1 hover:bg-white/10"
          aria-label={frameWidth < maxFrameWidth() - 24 ? 'Увеличить камеру' : 'Уменьшить камеру'}
          title={frameWidth < maxFrameWidth() - 24 ? 'Увеличить' : 'Уменьшить'}
          onClick={toggleSize}
          onPointerDown={(event) => event.stopPropagation()}
        >
          {frameWidth < maxFrameWidth() - 24 ? <ZoomIn className="h-3.5 w-3.5" /> : <ZoomOut className="h-3.5 w-3.5" />}
        </button>
        <button
          type="button"
          className="rounded px-1.5 py-1 text-[11px] hover:bg-white/10"
          aria-label="Свернуть камеру тетради"
          aria-expanded="true"
          onClick={() => setCollapsed(true)}
          onPointerDown={(event) => event.stopPropagation()}
        >
          Свернуть
        </button>
          </>
        )}
      </div>
      {!collapsed && (
        <>
      {focusOpen && (
        <div className="border-b border-white/10 bg-[#2B0D11] px-3 py-2 text-white" onPointerDown={(event) => event.stopPropagation()}>
          <div className="flex items-center gap-2">
            <Focus className="h-3.5 w-3.5 shrink-0 text-white/75" />
            <span className="flex-1 text-[11px] font-medium">Фокус телефона</span>
            {focusState && (
              <button
                type="button"
                className="rounded-md border border-white/20 px-2 py-1 text-[10px] hover:bg-white/10 disabled:opacity-50"
                disabled={focusPending || !focusState.autofocus}
                onClick={() => void sendFocusCommand({ type: 'autofocus' })}
                title={focusState.autofocus ? 'Включить автофокус' : 'Автофокус этим телефоном не поддерживается'}
              >
                Автофокус
              </button>
            )}
          </div>
          {focusState ? (
            <>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[10px] text-white/60">Мин.</span>
              <input
                type="range"
                aria-label="Ручная фокусировка камеры телефона"
                min={focusState.min}
                max={focusState.max}
                step={focusState.step}
                value={Math.max(focusState.min, Math.min(focusState.max, focusDistance))}
                onChange={(event) => changeFocus(Number(event.target.value))}
                className="h-1.5 min-w-0 flex-1 accent-[#e5a0a8]"
              />
              <span className="min-w-8 text-right text-[10px] tabular-nums text-white/70">{focusDistance.toFixed(2)}</span>
            </div>
            <p className="mt-1 text-[10px] text-white/60">
              {focusState.autofocus
                ? 'Автофокус доступен; ползунок меняет ручную настройку.'
                : 'На этом телефоне доступна только ручная настройка.'}
            </p>
            </>
          ) : (
            <p className="mt-1 text-[10px] leading-4 text-white/65">
              {focusAvailable === false
                ? 'Телефон не поддерживает ручную фокусировку. Автофокус остаётся включён.'
                : 'Проверяем возможности камеры…'}
            </p>
          )}
          {focusPending && <p className="mt-1 text-[10px] text-white/60">Применяем настройку…</p>}
          {focusError && <p role="status" className="mt-1 text-[10px] text-rose-200">{focusError}</p>}
        </div>
      )}
        <div
          className="notebook-camera-board-video w-full bg-black"
          style={{ aspectRatio: `${aspectRatio}` }}
        >
          <NotebookPerspectiveView
            trackRef={cameraTrack}
            corners={cropCorners}
            editing={cropEditing}
            applied={cropApplied}
            rotation={rotation}
            mirrorHorizontal={mirrorHorizontal}
            onCornersChange={setCropCorners}
          />
          <button
            type="button"
            className={`notebook-camera-board-resize ${resizing ? 'is-resizing' : ''}`}
            aria-label="Изменить размер окна камеры"
            title="Потяните, чтобы изменить размер"
            onPointerDown={startResize}
            onPointerMove={resizeOverlay}
            onPointerUp={finishResize}
            onPointerCancel={finishResize}
          />
        </div>
        </>
      )}
    </div>
  );
}

// ─── Main exported component ─────────────────────────────────────────────────

interface LessonRoomProps {
  token: string;
  livekitUrl: string;
  lessonId: string;
  initialStatus: LessonStatus;
  isTeacher: boolean;
  backHref: string;
  title: string;
  initialViewMode?: ViewMode;
}

const LESSON_STATUS: Record<
  LessonStatus,
  { label: string; className: string }
> = {
  waiting: {
    label: 'Ожидаем второго участника',
    className: 'bg-amber-500/15 text-amber-600 dark:text-amber-300',
  },
  starting: {
    label: 'Запускаем запись…',
    className: 'bg-amber-500/15 text-amber-600 dark:text-amber-300',
  },
  active: {
    label: 'Запись идёт',
    className: 'bg-red-500/15 text-red-600 dark:text-red-300',
  },
  ending: {
    label: 'Завершаем…',
    className: 'bg-slate-500/15 text-slate-600 dark:text-slate-300',
  },
  processing: {
    label: 'Готовим отчёт',
    className: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-300',
  },
  completed: {
    label: 'Урок завершён',
    className: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300',
  },
  failed: {
    label: 'Ошибка обработки',
    className: 'bg-red-500/15 text-red-600 dark:text-red-300',
  },
};

export function LessonRoom({
  token,
  livekitUrl,
  lessonId,
  initialStatus,
  isTeacher,
  backHref,
  title,
  initialViewMode = 'split',
}: LessonRoomProps) {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);
  const [lessonStatus, setLessonStatus] =
    useState<LessonStatus>(initialStatus);
  const [endingLesson, setEndingLesson] = useState(false);
  const [dockWidth, setDockWidth] = useState(DOCK_DEFAULT);
  const [dragging, setDragging] = useState(false);
  const [pip, setPip] = useState(false);
  const [pipPos, setPipPos] = useState({ x: 24, y: 24 });
  const [pipDragging, setPipDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [liveAssist, setLiveAssist] = useState<LiveAssistResult | null>(null);
  const [liveAssistState, setLiveAssistState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [boardText, setBoardText] = useState('');
  const [assistTopic, setAssistTopic] = useState('');
  const [assistPanelOpen, setAssistPanelOpen] = useState(true);
  const [cameraLink, setCameraLink] = useState<string | null>(null);
  const [cameraQrOpen, setCameraQrOpen] = useState(false);
  const [cameraLinkLoading, setCameraLinkLoading] = useState(false);
  const [roomDisconnected, setRoomDisconnected] = useState(false);
  const assistTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const assistRequestRef = useRef(0);
  const assistTopicRef = useRef('');
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const boardFlushRef = useRef<(() => Promise<void>) | null>(null);
  const dockWidthRef = useRef(dockWidth);
  const pipDragOffset = useRef({ x: 0, y: 0 });

  const openCameraQr = useCallback(async () => {
    setCameraLinkLoading(true);
    try {
      const result = await api.post<{ code: string }>('/video/camera-link', {
        lessonId,
      });
      const url = new URL('/lesson-camera', window.location.origin);
      url.searchParams.set('code', result.code);
      setCameraLink(url.toString());
      setCameraQrOpen(true);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          'Не удалось подготовить подключение камеры',
      );
    } finally {
      setCameraLinkLoading(false);
    }
  }, [lessonId]);

  const copyCameraLink = useCallback(async () => {
    if (!cameraLink) return;
    try {
      await navigator.clipboard.writeText(cameraLink);
      toast.success('Ссылка камеры скопирована');
    } catch {
      toast.error('Не удалось скопировать ссылку');
    }
  }, [cameraLink]);

  useEffect(() => {
    let cancelled = false;
    const refresh = async () => {
      try {
        const status = await api.get<{ status: LessonStatus }>(
          `/lessons/${lessonId}/status`,
        );
        if (!cancelled) setLessonStatus(status.status);
      } catch {
        // LiveKit reconnects and token errors are handled elsewhere.
      }
    };
    void refresh();
    const interval = window.setInterval(refresh, 5_000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [lessonId]);

  const endLesson = useCallback(async () => {
    if (
      !window.confirm(
        'Завершить урок для всех? После этого начнётся подготовка транскрипта и отчёта.',
      )
    ) {
      return;
    }
    setEndingLesson(true);
    try {
      await boardFlushRef.current?.();
      await api.post(`/lessons/${lessonId}/end`);
      setLessonStatus('processing');
      toast.success('Урок завершён. Отчёт будет готов после обработки.');
      router.push(backHref);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          'Не удалось сохранить доску и завершить урок',
      );
      setEndingLesson(false);
    }
  }, [backHref, lessonId, router]);

  const registerBoardFlush = useCallback(
    (flush: (() => Promise<void>) | null) => {
      boardFlushRef.current = flush;
    },
    [],
  );

  useEffect(() => {
    dockWidthRef.current = dockWidth;
  }, [dockWidth]);

  const clampDockWidth = useCallback((width: number) => {
    const stage = stageRef.current;
    const stageW = stage?.getBoundingClientRect().width ?? 1200;
    const max = Math.max(DOCK_MIN, Math.floor(stageW * DOCK_MAX_RATIO));
    return Math.min(max, Math.max(DOCK_MIN, width));
  }, []);

  const clampPipPos = useCallback((x: number, y: number) => {
    const stage = stageRef.current;
    if (!stage) return { x, y };
    const rect = stage.getBoundingClientRect();
    const maxX = Math.max(8, rect.width - PIP_W - 8);
    const maxY = Math.max(8, rect.height - PIP_H - 8);
    return {
      x: Math.min(maxX, Math.max(8, x)),
      y: Math.min(maxY, Math.max(8, y)),
    };
  }, []);

  const openPip = useCallback(() => {
    const stage = stageRef.current;
    if (stage) {
      const rect = stage.getBoundingClientRect();
      setPipPos(clampPipPos(rect.width - PIP_W - 20, rect.height - PIP_H - 20));
    }
    setPip(true);
  }, [clampPipPos]);

  const closePip = useCallback(() => {
    setPip(false);
    setDockWidth((w) => (w < DOCK_DEFAULT ? DOCK_DEFAULT : w));
    if (viewMode === 'board') setViewMode('split');
  }, [viewMode]);

  const toggleFullscreen = useCallback(async () => {
    const root = rootRef.current;
    if (!root) return;
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        if (viewMode === 'video') setViewMode('board');
        await root.requestFullscreen();
      }
    } catch (err) {
      console.error('Fullscreen failed', err);
    }
  }, [viewMode]);

  useEffect(() => {
    const onFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);

  const setMode = useCallback(
    (mode: ViewMode) => {
      setViewMode(mode);
      if (mode === 'video') setPip(false);
      if (mode === 'board' && !pip) {
        /* board-only: video hidden; keep pip off unless already floating */
      }
    },
    [pip],
  );

  const requestLiveAssist = useCallback((nextBoardText = '', context = '') => {
    if (!isTeacher) return;
    if (assistTimerRef.current) clearTimeout(assistTimerRef.current);
    const requestId = ++assistRequestRef.current;
    const text = nextBoardText.trim();
    const question = context.trim();
    if (!text && !question) {
      setLiveAssist(null);
      setLiveAssistState('idle');
      return;
    }
    if (lessonStatus !== 'active') {
      setLiveAssist({ reason: 'Подсказки доступны после начала урока.' });
      setLiveAssistState('ready');
      return;
    }
    setLiveAssist(null);
    setLiveAssistState('loading');
    assistTimerRef.current = setTimeout(() => {
      void api.post<LiveAssistResult>(`/learning/lessons/${lessonId}/live-assist`, {
        context: question,
        boardText: text,
      })
        .then((result) => {
          if (assistRequestRef.current !== requestId) return;
          setLiveAssist(result);
          setLiveAssistState('ready');
        })
        .catch(() => {
          if (assistRequestRef.current !== requestId) return;
          setLiveAssistState('error');
        });
    }, 650);
  }, [isTeacher, lessonId, lessonStatus]);

  const handleBoardText = useCallback((text: string) => {
    setBoardText(text);
    if (text.trim()) {
      requestLiveAssist(text, assistTopicRef.current);
    } else if (!assistTopicRef.current.trim()) {
      if (assistTimerRef.current) clearTimeout(assistTimerRef.current);
      setLiveAssist(null);
      setLiveAssistState('idle');
    }
  }, [requestLiveAssist]);

  useEffect(() => () => {
    if (assistTimerRef.current) clearTimeout(assistTimerRef.current);
  }, []);

  const onResizeStart = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPipDragStart = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    pipDragOffset.current = {
      x: e.clientX - pipPos.x,
      y: e.clientY - pipPos.y,
    };
    setPipDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, [pipPos.x, pipPos.y]);

  useEffect(() => {
    if (!dragging) return;

    const onMove = (e: PointerEvent) => {
      const stage = stageRef.current;
      if (!stage) return;
      const rect = stage.getBoundingClientRect();
      const next = Math.round(rect.right - e.clientX);
      setDockWidth(clampDockWidth(next));
    };

    const onUp = () => {
      setDragging(false);
      // Dragged to the minimum → detach into a floating mini window
      if (dockWidthRef.current <= DOCK_MIN + 2) {
        openPip();
      }
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [dragging, openPip, clampDockWidth]);

  useEffect(() => {
    if (!pipDragging) return;

    const onMove = (e: PointerEvent) => {
      setPipPos(
        clampPipPos(
          e.clientX - pipDragOffset.current.x,
          e.clientY - pipDragOffset.current.y,
        ),
      );
    };
    const onUp = () => setPipDragging(false);

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [pipDragging, clampPipPos]);

  useEffect(() => {
    const active = dragging || pipDragging;
    document.body.style.cursor = dragging ? 'col-resize' : pipDragging ? 'grabbing' : '';
    document.body.style.userSelect = active ? 'none' : '';
    return () => {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [dragging, pipDragging]);

  const showDock = viewMode === 'split' && !pip;
  const showPip = pip && viewMode !== 'video';
  const videoHidden = viewMode === 'board' && !pip;

  return (
    <div
      ref={rootRef}
      className="lesson-room relative flex flex-col"
      style={
        {
          height: isFullscreen ? '100%' : 'calc(100vh - 56px)',
          ['--lesson-dock-w']: `${dockWidth}px`,
        } as CSSProperties
      }
    >
      {!livekitUrl && (
        <div className="flex flex-1 items-center justify-center bg-[rgb(var(--bg))] p-6 text-center text-sm text-red-700">
          Не настроен адрес видеосервера. Обратитесь к администратору.
        </div>
      )}
      <LiveKitRoom
        key={`${lessonId}:${token}`}
        serverUrl={livekitUrl}
        token={token}
        connect
        video
        audio
        data-lk-theme="default"
        connectOptions={{ peerConnectionTimeout: 300_000 }}
        options={{ disconnectOnPageLeave: false }}
        onConnected={() => setRoomDisconnected(false)}
        onDisconnected={(reason) => {
          setRoomDisconnected(true);
          void boardFlushRef.current?.();
          if (
            reason === DisconnectReason.ROOM_DELETED ||
            reason === DisconnectReason.PARTICIPANT_REMOVED ||
            reason === DisconnectReason.ROOM_CLOSED
          ) {
            router.push(backHref);
          }
        }}
        style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
      >
        {roomDisconnected && (
          <div className="absolute inset-x-4 top-14 z-30 flex items-center justify-between gap-3 rounded-lg border border-amber-500/30 bg-amber-50 px-3 py-2 text-xs text-amber-900 shadow-sm">
            <span>Связь прервалась. Переподключаемся…</span>
            <button
              type="button"
              className="rounded border border-amber-700/30 px-2 py-1 font-medium hover:bg-amber-100"
              onClick={() => window.location.reload()}
            >
              Повторить
            </button>
          </div>
        )}
        {/* Header bar */}
        <div className="flex items-center gap-3 px-4 h-11 shrink-0 border-b border-[rgb(var(--border))] bg-[rgb(var(--surface))]">
          <button
            type="button"
            onClick={() => router.push(backHref)}
            className="flex items-center gap-1.5 text-sm text-[rgb(var(--text-2))] hover:text-[rgb(var(--text))] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Назад
          </button>
          <span className="text-sm font-medium text-[rgb(var(--text))] truncate">
            {title}
          </span>
          {isTeacher && <PracticePanel lessonId={lessonId} />}
          {isTeacher &&
            !['completed', 'failed', 'processing', 'ending'].includes(
              lessonStatus,
            ) && (
              <button
                type="button"
                onClick={() => void openCameraQr()}
                disabled={cameraLinkLoading}
                aria-label="Показать QR-код для камеры телефона"
                className="flex shrink-0 items-center gap-1.5 rounded-md border border-primary-300 bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700 transition-colors hover:bg-primary-100 disabled:opacity-60 dark:border-primary-800 dark:bg-primary-950/40 dark:text-primary-300"
                title="Показать QR-код для камеры телефона"
              >
                {cameraLinkLoading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <QrCode className="h-3.5 w-3.5" />
                )}
                <span className="text-[10px] font-semibold md:hidden">QR</span>
                <span className="hidden md:inline">Камера тетради</span>
              </button>
            )}
          <span
            className={[
              'flex items-center gap-1.5 rounded-full px-2 py-1 text-[11px] font-medium',
              LESSON_STATUS[lessonStatus].className,
            ].join(' ')}
          >
            {lessonStatus === 'active' && (
              <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
            )}
            {LESSON_STATUS[lessonStatus].label}
          </span>
          <span className="flex-1" />

          <MicrophoneToggle />
          <StopScreenShareButton />

          {isTeacher &&
            !['completed', 'failed', 'processing', 'ending'].includes(
              lessonStatus,
            ) && (
              <button
                type="button"
                onClick={endLesson}
                disabled={endingLesson}
                className="flex items-center gap-1.5 rounded-md bg-red-600 px-2.5 py-1 text-xs font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-60"
                title="Завершить урок для всех"
              >
                {endingLesson ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <StopCircle className="h-3.5 w-3.5" />
                )}
                <span className="hidden lg:inline">Завершить урок</span>
              </button>
            )}

          <button
            type="button"
            onClick={toggleFullscreen}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-[rgb(var(--text-2))] hover:text-[rgb(var(--text))] hover:bg-[rgb(var(--surface-2))] transition-colors"
            title={isFullscreen ? 'Свернуть (Esc)' : 'Развернуть доску на весь экран'}
          >
            {isFullscreen ? (
              <Minimize2 className="h-3.5 w-3.5" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5" />
            )}
            <span className="hidden sm:inline">
              {isFullscreen ? 'Свернуть' : 'На весь экран'}
            </span>
          </button>

          {viewMode === 'split' && !pip && (
            <button
              type="button"
              onClick={openPip}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-[rgb(var(--text-2))] hover:text-[rgb(var(--text))] hover:bg-[rgb(var(--surface-2))] transition-colors"
              title="Открепить видео в мини-окно"
            >
              <PictureInPicture2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Мини-окно</span>
            </button>
          )}

          {pip && viewMode !== 'video' && (
            <button
              type="button"
              onClick={closePip}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-[rgb(var(--text-2))] hover:text-[rgb(var(--text))] hover:bg-[rgb(var(--surface-2))] transition-colors"
              title="Вернуть видео в панель"
            >
              <PanelRight className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">В панель</span>
            </button>
          )}

          <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-[rgb(var(--surface-2))] border border-[rgb(var(--border))]">
            {VIEW_MODES.map(({ mode, Icon, label }) => (
              <button
                key={mode}
                type="button"
                title={label}
                onClick={() => setMode(mode)}
                className={[
                  'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all',
                  viewMode === mode
                    ? 'bg-[rgb(var(--surface))] text-[rgb(var(--text))] shadow-sm'
                    : 'text-[rgb(var(--text-3))] hover:text-[rgb(var(--text-2))]',
                ].join(' ')}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <RoomAudioRenderer />

        <div
          ref={stageRef}
          className="lesson-stage relative flex-1 min-h-0 overflow-hidden bg-[rgb(var(--bg))]"
        >
          {/* Board */}
          <div
            className="absolute inset-0"
            style={{
              display: viewMode === 'video' ? 'none' : 'block',
              right: showDock ? dockWidth : 0,
            }}
          >
            <WhiteboardPanel
              lessonId={lessonId}
              onRegisterFlush={registerBoardFlush}
              onBoardText={handleBoardText}
            />
            {isTeacher && viewMode !== 'video' && (
              <section
                aria-label="Ассистент урока"
                className="pointer-events-none absolute bottom-3 left-3 z-20 max-w-[calc(100%-1.5rem)]"
                style={{ width: 'min(22rem, calc(100% - 1.5rem))' }}
              >
                {assistPanelOpen ? (
                  <div className="pointer-events-auto overflow-hidden rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] shadow-lg">
                    <div className="flex items-center justify-between gap-3 px-3 py-2.5">
                      <div className="flex min-w-0 items-center gap-2">
                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[rgb(var(--surface-2))] text-[rgb(var(--primary))]">
                          <Lightbulb className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                          <h2 className="text-xs font-semibold text-[rgb(var(--text))]">Подсказки по доске</h2>
                          <p className="truncate text-[10px] text-[rgb(var(--text-3))]">Подбор задачи из банка по теме урока</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        aria-label="Свернуть подсказки"
                        aria-expanded="true"
                        onClick={() => setAssistPanelOpen(false)}
                        className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-[rgb(var(--text-3))] hover:bg-[rgb(var(--surface-2))] hover:text-[rgb(var(--text))]"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="space-y-2 border-t border-[rgb(var(--border))] px-3 pb-3 pt-2.5">
                      {liveAssistState === 'loading' ? (
                        <p className="flex items-center gap-2 text-xs text-[rgb(var(--text-2))]" role="status">
                          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Подбираю подходящую задачу…
                        </p>
                      ) : liveAssistState === 'error' ? (
                        <p className="text-xs text-red-700" role="alert">Не удалось подключиться к подбору заданий. Проверьте соединение и попробуйте ещё раз.</p>
                      ) : liveAssistState === 'ready' && liveAssist?.suggestion ? (
                        <div className="max-h-36 overflow-y-auto rounded-lg bg-[rgb(var(--surface-2))] p-2.5">
                          {liveAssist.topic?.title && <p className="text-[10px] font-medium uppercase tracking-wide text-[rgb(var(--text-3))]">{liveAssist.topic.title}</p>}
                          <p className="mt-1 whitespace-pre-wrap text-xs leading-5 text-[rgb(var(--text))]">{liveAssist.suggestion.task}</p>
                          {liveAssist.suggestion.reason && <p className="mt-1 text-[10px] text-[rgb(var(--text-3))]">{liveAssist.suggestion.reason}</p>}
                        </div>
                      ) : liveAssistState === 'ready' ? (
                        <p className="text-xs leading-5 text-[rgb(var(--text-2))]" role="status">
                          {liveAssist?.reason || 'По этому тексту задача не нашлась. Уточните тему или формулировку.'}
                        </p>
                      ) : lessonStatus !== 'active' ? (
                        <p className="text-xs leading-5 text-[rgb(var(--text-2))]">Подсказки доступны после начала урока.</p>
                      ) : (
                        <p className="text-xs leading-5 text-[rgb(var(--text-2))]">Добавьте тему текстом на доске или задайте её в поле ниже. Для рисунков и рукописных записей распознавание пока не работает.</p>
                      )}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={assistTopic}
                          onChange={(event) => {
                            assistTopicRef.current = event.target.value;
                            setAssistTopic(event.target.value);
                          }}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' && !event.nativeEvent.isComposing) {
                              event.preventDefault();
                              requestLiveAssist(boardText, assistTopic);
                            }
                          }}
                          placeholder="Например, закон Ома"
                          aria-label="Тема для подбора задачи"
                          disabled={lessonStatus !== 'active'}
                          className="min-w-0 flex-1 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-2.5 py-2 text-xs text-[rgb(var(--text))] outline-none placeholder:text-[rgb(var(--text-3))] focus:border-[rgb(var(--primary))]"
                        />
                        <button
                          type="button"
                          onClick={() => requestLiveAssist(boardText, assistTopic)}
                          disabled={lessonStatus !== 'active' || liveAssistState === 'loading' || (!boardText.trim() && !assistTopic.trim())}
                          className="shrink-0 rounded-lg bg-[rgb(var(--primary))] px-3 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45"
                        >
                          Подобрать
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    aria-label="Развернуть подсказки"
                    aria-expanded="false"
                    onClick={() => setAssistPanelOpen(true)}
                    className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-3 py-2 text-xs font-semibold text-[rgb(var(--text))] shadow-lg hover:bg-[rgb(var(--surface-2))]"
                  >
                    <Lightbulb className="h-4 w-4 text-[rgb(var(--primary))]" />
                    Подсказки
                    <ChevronUp className="h-3.5 w-3.5 text-[rgb(var(--text-3))]" />
                  </button>
                )}
              </section>
            )}
          </div>

          {viewMode !== 'video' && (
            <NotebookCameraBoardOverlay lessonId={lessonId} rightOffset={showDock ? dockWidth + 16 : 16} />
          )}

          {/* Resize handle */}
          {showDock && (
            <div
              role="separator"
              aria-orientation="vertical"
              aria-valuenow={dockWidth}
              aria-valuemin={DOCK_MIN}
              aria-valuemax={Math.round(
                (stageRef.current?.getBoundingClientRect().width ?? 1200) * DOCK_MAX_RATIO,
              )}
              onPointerDown={onResizeStart}
              className={[
                'absolute top-0 bottom-0 z-30 w-1.5 -ml-0.5 cursor-col-resize touch-none',
                'bg-transparent hover:bg-[rgb(var(--primary))]/40',
                dragging ? 'bg-[rgb(var(--primary))]/50' : '',
              ].join(' ')}
              style={{ right: dockWidth }}
              title="Потяните, чтобы изменить размер"
            >
              <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-[rgb(var(--border))]" />
            </div>
          )}

          {/* Video panel: full / dock / pip / hidden */}
          <div
            className={[
              'min-h-0 overflow-hidden',
              showPip
                ? 'absolute z-40 rounded-xl border border-[#9D7960] bg-[#64343C] shadow-2xl shadow-[0_16px_40px_rgb(63_17_22/0.4)]'
                : viewMode === 'video'
                  ? 'absolute inset-0'
                  : showDock
                    ? 'absolute top-0 right-0 bottom-0 border-l border-[rgb(var(--border))] bg-[#64343C]'
                    : 'absolute pointer-events-none opacity-0',
              !dragging && !showPip && viewMode !== 'split' ? 'transition-[width] duration-300 ease-out' : '',
            ].join(' ')}
            style={
              showPip
                ? {
                    left: pipPos.x,
                    top: pipPos.y,
                    width: PIP_W,
                    height: PIP_H,
                    visibility: 'visible',
                  }
                : {
                    width: viewMode === 'video' ? '100%' : showDock ? dockWidth : 0,
                    visibility: videoHidden ? 'hidden' : 'visible',
                    zIndex: videoHidden ? -1 : 2,
                  }
            }
            data-lk-theme="default"
          >
            {/* PiP drag bar */}
            {showPip && (
              <div
                onPointerDown={onPipDragStart}
                className={[
                  'flex items-center gap-2 h-8 px-2 shrink-0 cursor-grab active:cursor-grabbing touch-none',
                  'bg-[#64343C] border-b border-white/10 select-none',
                ].join(' ')}
              >
                <span className="flex-1 text-[11px] text-[#FFF1E9] truncate">Видео</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    closePip();
                  }}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="text-[11px] text-[#FFF1E9] hover:text-[#64343C] px-1.5 py-0.5 rounded hover:bg-[#9D7960]"
                  title="Вернуть в панель"
                >
                  В панель
                </button>
              </div>
            )}

            {/* Compact dock: click to float */}
            {showDock && dockWidth <= DOCK_COMPACT && (
              <button
                type="button"
                onClick={openPip}
                className="absolute inset-x-2 top-2 z-20 rounded-md bg-[#3F1116] text-[#FFF1E9] text-[11px] px-2 py-1.5 hover:bg-[#64343C] transition-colors"
              >
                Нажмите — мини-окно
              </button>
            )}

            <div
              className={[
                'w-full min-h-0',
                showPip ? 'h-[calc(100%-2rem)] lesson-video-pip' : 'h-full',
                showDock && dockWidth <= DOCK_COMPACT + 40 ? 'lesson-video-dock' : '',
              ].join(' ')}
            >
              <VideoConference />
            </div>
          </div>
        </div>
      </LiveKitRoom>

      {cameraQrOpen && cameraLink && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 p-4"
          role="presentation"
          onClick={() => setCameraQrOpen(false)}
        >
          <section
            className="w-full max-w-sm rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-5 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="camera-qr-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-500/12 text-primary-600">
                <Smartphone className="h-5 w-5" />
              </div>
              <div>
                <h2 id="camera-qr-title" className="text-base font-semibold text-[rgb(var(--text))]">
                  Трансляция тетради с телефона
                </h2>
                <p className="mt-1 text-xs leading-5 text-[rgb(var(--text-2))]">
                  Отсканируйте QR-код телефоном, разрешите доступ к камере и направьте её на тетрадь.
                </p>
              </div>
            </div>
            <div className="mx-auto mt-4 flex w-fit rounded-xl bg-white p-3 shadow-sm">
              <QRCodeSVG
                value={cameraLink}
                size={260}
                level="M"
                marginSize={2}
                title="QR-код для подключения камеры телефона"
              />
            </div>
            <div className="mt-3 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-3">
              <p className="text-xs font-medium text-[rgb(var(--text-2))]">Если QR-код не сканируется, откройте ссылку вручную:</p>
              <a
                href={cameraLink}
                target="_blank"
                rel="noreferrer"
                className="mt-1 block break-all text-[11px] text-primary-700 underline dark:text-primary-300"
              >
                {cameraLink}
              </a>
            </div>
            <p className="mt-3 text-center text-[11px] leading-5 text-[rgb(var(--text-3))]">
              Код действует 10 минут и подключает только камеру, без микрофона.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => void copyCameraLink()}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[rgb(var(--border))] px-3 py-2 text-xs font-medium text-[rgb(var(--text-2))] transition hover:bg-[rgb(var(--surface-2))]"
              >
                <Copy className="h-3.5 w-3.5" />
                Скопировать ссылку
              </button>
              <button
                type="button"
                onClick={() => setCameraQrOpen(false)}
                className="rounded-lg bg-primary-500 px-3 py-2 text-xs font-medium text-white transition hover:bg-primary-600"
              >
                Готово
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
