'use client';

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { api } from '@/lib/api';

type LoadedImages = {
  requestKey: string;
  urls: string[];
  status: 'loading' | 'loaded' | 'failed';
};

type ExamTaskImagesProps = {
  examId: string;
  taskId: string;
  imageKeys?: string[];
  fallback: ReactNode;
};

/** Fetches the current task's protected image blobs and displays them without public URLs. */
export function ExamTaskImages({ examId, taskId, imageKeys, fallback }: ExamTaskImagesProps) {
  const [loaded, setLoaded] = useState<LoadedImages | null>(null);
  const [zoomedIndex, setZoomedIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const hasImages = Boolean(imageKeys?.length);
  const requestKey = useMemo(
    () => JSON.stringify([examId, taskId, imageKeys ?? []]),
    [examId, taskId, imageKeys],
  );

  useEffect(() => {
    let cancelled = false;
    const objectUrls: string[] = [];
    setZoomedIndex(null);

    if (!imageKeys?.length) {
      setLoaded({ requestKey, urls: [], status: 'failed' });
      return () => {
        cancelled = true;
      };
    }

    setLoaded({ requestKey, urls: [], status: 'loading' });

    Promise.all(
      imageKeys.map((_, index) => api.getMockExamItemImage(examId, taskId, index)),
    )
      .then((blobs) => {
        if (cancelled) return;
        for (const blob of blobs) objectUrls.push(URL.createObjectURL(blob));
        setLoaded({ requestKey, urls: objectUrls, status: 'loaded' });
      })
      .catch(() => {
        if (!cancelled) setLoaded({ requestKey, urls: [], status: 'failed' });
      });

    return () => {
      cancelled = true;
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [examId, taskId, imageKeys, requestKey]);

  useEffect(() => {
    if (zoomedIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    closeButtonRef.current?.focus();
    document.body.style.overflow = 'hidden';

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setZoomedIndex(null);
    };
    document.addEventListener('keydown', closeOnEscape);

    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.body.style.overflow = previousOverflow;
      if (returnFocusRef.current?.isConnected) returnFocusRef.current.focus();
    };
  }, [zoomedIndex]);

  const current = loaded?.requestKey === requestKey ? loaded : null;
  if (!hasImages) return <>{fallback}</>;
  if (!current || current.status === 'loading') {
    return (
      <div className="space-y-4">
        <p role="status" className="text-sm text-[rgb(var(--text-3))]">Загружаем изображение задания…</p>
        {fallback}
      </div>
    );
  }
  if (current.status === 'failed' || current.urls.length === 0) {
    return (
      <div className="space-y-4">
        <p role="alert" className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-900">
          Не удалось загрузить изображение. Показано текстовое условие задания.
        </p>
        {fallback}
      </div>
    );
  }

  const selectedUrl = zoomedIndex === null ? null : current.urls[zoomedIndex];

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {current.urls.map((url, index) => (
          <div
            key={`${taskId}-${index}`}
            className="overflow-hidden rounded-xl border border-[rgb(var(--border))] bg-white p-2 sm:p-4"
          >
            <button
              type="button"
              className="group mx-auto block max-w-full cursor-zoom-in rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              aria-label={`Увеличить фрагмент ${index + 1}`}
              onClick={(event) => {
                returnFocusRef.current = event.currentTarget;
                setZoomedIndex(index);
              }}
            >
              <img
                src={url}
                alt={`Условие задания, фрагмент ${index + 1}`}
                className="mx-auto block max-h-[75vh] max-w-full object-contain"
                onError={() => {
                  setZoomedIndex(null);
                  setLoaded({ requestKey, urls: [], status: 'failed' });
                }}
              />
            </button>
          </div>
        ))}
      </div>

      <details className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-4 py-3">
        <summary className="cursor-pointer text-sm font-medium text-[rgb(var(--text))]">
          Показать текстовое условие
        </summary>
        <div className="pt-4">{fallback}</div>
      </details>

      {selectedUrl && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-3 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Увеличенное изображение задания"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setZoomedIndex(null);
          }}
        >
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Закрыть увеличенное изображение"
            className="absolute right-3 top-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-gray-900 shadow-lg transition hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-6 sm:top-6"
            onClick={() => setZoomedIndex(null)}
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
          <img
            src={selectedUrl}
            alt={`Условие задания, фрагмент ${(zoomedIndex ?? 0) + 1}`}
            className="max-h-[calc(100dvh-2rem)] max-w-full object-contain sm:max-h-[calc(100dvh-4rem)]"
          />
        </div>
      )}
    </div>
  );
}
