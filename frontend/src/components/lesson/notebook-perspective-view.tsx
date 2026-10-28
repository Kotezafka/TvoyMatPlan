'use client';

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';

export type NotebookCorner = { x: number; y: number };
export type NotebookCorners = [NotebookCorner, NotebookCorner, NotebookCorner, NotebookCorner];

type Props = {
  trackRef: any;
  corners: NotebookCorners;
  editing: boolean;
  applied: boolean;
  rotation: 0 | 90 | 180 | 270;
  mirrorHorizontal: boolean;
  onCornersChange: (corners: NotebookCorners) => void;
};

type Homography = [number, number, number, number, number, number, number, number];
const GRID_SIZE = 8;
const MAX_RENDER_FPS = 15;

function clamp(value: number) {
  return Math.max(0, Math.min(1, value));
}

function distance(a: NotebookCorner, b: NotebookCorner) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** Reject crossed or nearly collapsed corners so the perspective transform stays usable. */
function isValidQuad(corners: NotebookCorners) {
  const turns = corners.map((point, index) => {
    const next = corners[(index + 1) % 4];
    const afterNext = corners[(index + 2) % 4];
    return (next.x - point.x) * (afterNext.y - next.y) - (next.y - point.y) * (afterNext.x - next.x);
  });
  return turns.every((turn) => Number.isFinite(turn) && turn > 1e-5);
}

/** Solve a small 8x8 linear system for a projective transform. */
function solveLinearSystem(matrix: number[][], values: number[]) {
  const augmented = matrix.map((row, index) => [...row, values[index]]);
  for (let column = 0; column < 8; column += 1) {
    let pivot = column;
    for (let row = column + 1; row < 8; row += 1) {
      if (Math.abs(augmented[row][column]) > Math.abs(augmented[pivot][column])) pivot = row;
    }
    if (Math.abs(augmented[pivot][column]) < 1e-9) return null;
    [augmented[column], augmented[pivot]] = [augmented[pivot], augmented[column]];
    const divisor = augmented[column][column];
    for (let item = column; item <= 8; item += 1) augmented[column][item] /= divisor;
    for (let row = 0; row < 8; row += 1) {
      if (row === column) continue;
      const factor = augmented[row][column];
      if (!factor) continue;
      for (let item = column; item <= 8; item += 1) {
        augmented[row][item] -= factor * augmented[column][item];
      }
    }
  }
  return augmented.map((row) => row[8]) as Homography;
}

/** Maps a point in the output rectangle (0..1) to the selected source quad. */
function createHomography(corners: NotebookCorners): Homography | null {
  const destination = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 0, y: 1 },
  ];
  const matrix: number[][] = [];
  const values: number[] = [];
  destination.forEach((point, index) => {
    const source = corners[index];
    matrix.push([point.x, point.y, 1, 0, 0, 0, -point.x * source.x, -point.y * source.x]);
    values.push(source.x);
    matrix.push([0, 0, 0, point.x, point.y, 1, -point.x * source.y, -point.y * source.y]);
    values.push(source.y);
  });
  return solveLinearSystem(matrix, values);
}

function mapPoint(transform: Homography, x: number, y: number): NotebookCorner {
  const denominator = transform[6] * x + transform[7] * y + 1;
  return {
    x: (transform[0] * x + transform[1] * y + transform[2]) / denominator,
    y: (transform[3] * x + transform[4] * y + transform[5]) / denominator,
  };
}

function affineTransform(source: NotebookCorner[], destination: NotebookCorner[]) {
  const [s0, s1, s2] = source;
  const [d0, d1, d2] = destination;
  const determinant =
    s0.x * (s1.y - s2.y) + s1.x * (s2.y - s0.y) + s2.x * (s0.y - s1.y);
  if (Math.abs(determinant) < 1e-7) return null;
  const a =
    (d0.x * (s1.y - s2.y) + d1.x * (s2.y - s0.y) + d2.x * (s0.y - s1.y)) /
    determinant;
  const c =
    (d0.x * (s2.x - s1.x) + d1.x * (s0.x - s2.x) + d2.x * (s1.x - s0.x)) /
    determinant;
  const e =
    (d0.x * (s1.x * s2.y - s2.x * s1.y) +
      d1.x * (s2.x * s0.y - s0.x * s2.y) +
      d2.x * (s0.x * s1.y - s1.x * s0.y)) /
    determinant;
  const b =
    (d0.y * (s1.y - s2.y) + d1.y * (s2.y - s0.y) + d2.y * (s0.y - s1.y)) /
    determinant;
  const d =
    (d0.y * (s2.x - s1.x) + d1.y * (s0.x - s2.x) + d2.y * (s1.x - s0.x)) /
    determinant;
  const f =
    (d0.y * (s1.x * s2.y - s2.x * s1.y) +
      d1.y * (s2.x * s0.y - s0.x * s2.y) +
      d2.y * (s0.x * s1.y - s1.x * s0.y)) /
    determinant;
  return { a, b, c, d, e, f };
}

function rotatedPoint(point: NotebookCorner, width: number, height: number, rotation: Props['rotation']) {
  if (rotation === 90) return { x: height - point.y, y: point.x };
  if (rotation === 180) return { x: width - point.x, y: height - point.y };
  if (rotation === 270) return { x: point.y, y: width - point.x };
  return point;
}

function drawPerspective(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  corners: NotebookCorners,
  rotation: Props['rotation'],
  mirrorHorizontal: boolean,
) {
  const sourceWidth = video.videoWidth;
  const sourceHeight = video.videoHeight;
  if (!sourceWidth || !sourceHeight || !isValidQuad(corners)) return;
  const transform = createHomography(corners);
  if (!transform) return;

  const sourceCorners = corners.map((point) => ({
    x: point.x * sourceWidth,
    y: point.y * sourceHeight,
  })) as NotebookCorners;
  const rawWidth = Math.max(
    1,
    Math.round((distance(sourceCorners[0], sourceCorners[1]) + distance(sourceCorners[3], sourceCorners[2])) / 2),
  );
  const rawHeight = Math.max(
    1,
    Math.round((distance(sourceCorners[0], sourceCorners[3]) + distance(sourceCorners[1], sourceCorners[2])) / 2),
  );
  const rawScale = Math.min(960 / rawWidth, 1200 / rawHeight, 1);
  const scaledWidth = Math.max(320, Math.round(rawWidth * rawScale));
  const scaledHeight = Math.max(240, Math.round(rawHeight * rawScale));
  const finalWidth = rotation === 90 || rotation === 270 ? scaledHeight : scaledWidth;
  const finalHeight = rotation === 90 || rotation === 270 ? scaledWidth : scaledHeight;
  if (canvas.width !== finalWidth || canvas.height !== finalHeight) {
    canvas.width = finalWidth;
    canvas.height = finalHeight;
  }
  const context = canvas.getContext('2d');
  if (!context) return;
  context.clearRect(0, 0, finalWidth, finalHeight);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';

  const drawDestination = (point: NotebookCorner) => {
    const rotated = rotatedPoint(
      { x: point.x * scaledWidth, y: point.y * scaledHeight },
      scaledWidth,
      scaledHeight,
      rotation,
    );
    return mirrorHorizontal ? { x: finalWidth - rotated.x, y: rotated.y } : rotated;
  };

  for (let row = 0; row < GRID_SIZE; row += 1) {
    for (let column = 0; column < GRID_SIZE; column += 1) {
      const u0 = column / GRID_SIZE;
      const u1 = (column + 1) / GRID_SIZE;
      const v0 = row / GRID_SIZE;
      const v1 = (row + 1) / GRID_SIZE;
      const s00 = mapPoint(transform, u0, v0);
      const s10 = mapPoint(transform, u1, v0);
      const s11 = mapPoint(transform, u1, v1);
      const s01 = mapPoint(transform, u0, v1);
      const sourcePoints = [
        { x: s00.x * sourceWidth, y: s00.y * sourceHeight },
        { x: s10.x * sourceWidth, y: s10.y * sourceHeight },
        { x: s11.x * sourceWidth, y: s11.y * sourceHeight },
        { x: s01.x * sourceWidth, y: s01.y * sourceHeight },
      ];
      const destinationPoints = [
        drawDestination({ x: u0, y: v0 }),
        drawDestination({ x: u1, y: v0 }),
        drawDestination({ x: u1, y: v1 }),
        drawDestination({ x: u0, y: v1 }),
      ];
      ([
        [0, 1, 2],
        [0, 2, 3],
      ] as const).forEach(([a, b, c]) => {
        const transform2d = affineTransform(
          [sourcePoints[a], sourcePoints[b], sourcePoints[c]],
          [destinationPoints[a], destinationPoints[b], destinationPoints[c]],
        );
        if (!transform2d) return;
        context.save();
        context.setTransform(
          transform2d.a,
          transform2d.b,
          transform2d.c,
          transform2d.d,
          transform2d.e,
          transform2d.f,
        );
        context.beginPath();
        context.moveTo(sourcePoints[a].x, sourcePoints[a].y);
        context.lineTo(sourcePoints[b].x, sourcePoints[b].y);
        context.lineTo(sourcePoints[c].x, sourcePoints[c].y);
        context.closePath();
        context.clip();
        context.drawImage(video, 0, 0, sourceWidth, sourceHeight);
        context.restore();
      });
    }
  }
}

function defaultCorners(): NotebookCorners {
  return [
    { x: 0.04, y: 0.04 },
    { x: 0.96, y: 0.04 },
    { x: 0.96, y: 0.96 },
    { x: 0.04, y: 0.96 },
  ];
}

export function NotebookPerspectiveView({
  trackRef,
  corners,
  editing,
  applied,
  rotation,
  mirrorHorizontal,
  onCornersChange,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [activePoint, setActivePoint] = useState<number | null>(null);
  const track = trackRef?.publication?.track;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !track) return undefined;
    video.muted = true;
    track.attach(video);
    const markReady = () => setReady(true);
    video.addEventListener('loadedmetadata', markReady);
    void video.play().catch(() => undefined);
    if (video.readyState >= 1) setReady(true);
    return () => {
      video.removeEventListener('loadedmetadata', markReady);
      track.detach(video);
      setReady(false);
    };
  }, [track]);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !applied || editing || !ready) return undefined;
    let frameHandle: number | null = null;
    let timer: ReturnType<typeof setInterval> | null = null;
    let lastRenderTime = 0;
    const render = () => drawPerspective(video, canvas, corners, rotation, mirrorHorizontal);
    const frameVideo = video as unknown as {
      requestVideoFrameCallback?: (callback: (now: number, metadata: unknown) => void) => number;
      cancelVideoFrameCallback?: (handle: number) => void;
    };
    const requestFrame = (now?: number) => {
      const currentTime = now ?? performance.now();
      if (currentTime - lastRenderTime >= 1000 / MAX_RENDER_FPS) {
        render();
        lastRenderTime = currentTime;
      }
      if (typeof frameVideo.requestVideoFrameCallback === 'function') {
        frameHandle = frameVideo.requestVideoFrameCallback((frameTime) => requestFrame(frameTime));
      }
    };
    if (typeof frameVideo.requestVideoFrameCallback === 'function') {
      render();
      lastRenderTime = performance.now();
      frameHandle = frameVideo.requestVideoFrameCallback((frameTime) => requestFrame(frameTime));
    }
    else timer = setInterval(render, 1000 / 15);
    return () => {
      if (frameHandle !== null) frameVideo.cancelVideoFrameCallback?.(frameHandle);
      if (timer) clearInterval(timer);
    };
  }, [applied, corners, editing, mirrorHorizontal, ready, rotation]);

  const movePoint = (event: ReactPointerEvent<HTMLButtonElement>, index: number) => {
    if (!editing) return;
    const bounds = event.currentTarget.parentElement?.getBoundingClientRect();
    if (!bounds) return;
    const next = [...corners] as NotebookCorners;
    next[index] = {
      x: clamp((event.clientX - bounds.left) / bounds.width),
      y: clamp((event.clientY - bounds.top) / bounds.height),
    };
    if (isValidQuad(next)) onCornersChange(next);
  };

  const cornersValid = isValidQuad(corners);
  const visibleVideoClass = editing || !applied || !cornersValid ? 'opacity-100' : 'opacity-0';
  const canvasClass = applied && !editing && ready && cornersValid ? 'opacity-100' : 'opacity-0';

  return (
    <div
      className={`notebook-camera-perspective relative h-full w-full overflow-hidden bg-black ${editing ? 'notebook-camera-crop-editor' : ''}`}
      data-testid="notebook-camera-perspective-view"
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`absolute inset-0 h-full w-full object-fill transition-opacity ${visibleVideoClass}`}
      />
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 h-full w-full object-contain transition-opacity ${canvasClass}`}
        aria-label="Исправленная область тетради"
      />
      {!ready && <div className="absolute inset-0 flex items-center justify-center text-xs text-white/70">Ожидаем видеопоток…</div>}
      {editing && ready && (
        <div className="absolute inset-0">
          <div className="pointer-events-none absolute inset-0 border border-white/70" />
          {corners.map((corner, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Угол тетради ${index + 1}`}
              className={`absolute h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#7F1D2D] text-xs font-bold text-white shadow-lg ${activePoint === index ? 'scale-110' : ''}`}
              style={{ left: `${corner.x * 100}%`, top: `${corner.y * 100}%`, touchAction: 'none' }}
              onPointerDown={(event) => {
                event.preventDefault();
                event.currentTarget.setPointerCapture(event.pointerId);
                setActivePoint(index);
              }}
              onPointerMove={(event) => movePoint(event, index)}
              onPointerUp={() => setActivePoint(null)}
              onPointerCancel={() => setActivePoint(null)}
            >
              {index + 1}
            </button>
          ))}
          <div className="pointer-events-none absolute left-2 top-2 rounded-md bg-black/65 px-2 py-1 text-[10px] text-white">
            Перетащите точки по углам тетради
          </div>
        </div>
      )}
    </div>
  );
}

export function getDefaultNotebookCorners() {
  return defaultCorners();
}
