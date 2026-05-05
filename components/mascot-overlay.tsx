"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { usePathname } from "next/navigation";

type MascotOverlayProps = {
  src?: string;
  sizePx?: number;
  className?: string;
};

export function MascotOverlay({
  src = "/NeuralNexusMascot.mp4",
  sizePx = 80,
  className,
}: MascotOverlayProps) {
  const pathname = usePathname();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const hasInitCanvasRef = useRef(false);
  const [aspectRatio, setAspectRatio] = React.useState(1);

  const styles = useMemo(
    () => ({
      width: `${sizePx}px`,
      height: `${sizePx / aspectRatio}px`,
    }),
    [sizePx, aspectRatio]
  );

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    let disposed = false;

    const ensurePlaying = async () => {
      try {
        await video.play();
      } catch {
        return;
      }
    };

    const step = () => {
      if (disposed) return;

      const w = video.videoWidth;
      const h = video.videoHeight;

      if (!w || !h) {
        rafRef.current = requestAnimationFrame(step);
        return;
      }

      if (!hasInitCanvasRef.current) {
        canvas.width = w;
        canvas.height = h;
        setAspectRatio(w / h);
        hasInitCanvasRef.current = true;
      }

      try {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = frame.data;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i] || 0;
          const g = data[i + 1] || 0;
          const b = data[i + 2] || 0;

          const max = r > g ? (r > b ? r : b) : g > b ? g : b;
          const min = r < g ? (r < b ? r : b) : g < b ? g : b;
          const delta = max - min;

          let hue = 0;
          if (delta !== 0) {
            if (max === r) {
              hue = (60 * ((g - b) / delta) + 360) % 360;
            } else if (max === g) {
              hue = 60 * ((b - r) / delta + 2);
            } else {
              hue = 60 * ((r - g) / delta + 4);
            }
          }

          const sat = max === 0 ? 0 : delta / max;
          const val = max / 255;

          const isGreenHue = hue >= 70 && hue <= 170;
          const isGreenDominant = g > 18 && g >= r * 1.08 && g >= b * 1.08;

          if ((isGreenHue && sat >= 0.18 && val >= 0.10) || (isGreenDominant && val >= 0.08)) {
            data[i + 3] = 0;
          }
        }

        ctx.putImageData(frame, 0, 0);
      } catch (err) {
        console.error("[Mascot] Error de seguridad o renderizado en Canvas:", err);
        // Si hay un error de seguridad (CORS), detenemos el bucle para no inundar la consola
        if (err instanceof DOMException && err.name === 'SecurityError') {
          disposed = true;
          return;
        }
      }
      rafRef.current = requestAnimationFrame(step);
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
        return;
      }

      ensurePlaying().finally(() => {
        if (rafRef.current === null) rafRef.current = requestAnimationFrame(step);
      });
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    ensurePlaying().finally(() => {
      rafRef.current = requestAnimationFrame(step);
    });

    return () => {
      disposed = true;
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, []);

  if (pathname === "/reels") return null;

  return (
    <div
      className={[
        "fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 pointer-events-none select-none",
        className || "",
      ].join(" ")}
      style={styles}
      aria-hidden="true"
    >
      <video
        ref={videoRef}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        crossOrigin="anonymous"
        className="absolute inset-0 w-px h-px opacity-0"
      />
      <canvas
        ref={canvasRef}
        className="w-full h-full rounded-2xl drop-shadow-[0_10px_25px_rgba(0,0,0,0.55)]"
      />
    </div>
  );
}
