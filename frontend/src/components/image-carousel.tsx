"use client";

import { LoadingImage } from "@/components/loading-image";
import { useState } from "react";

interface ImageCarouselProps {
  photos: string[];
  title: string;
}

export default function ImageCarousel({ photos, title }: ImageCarouselProps) {
  const [current, setCurrent] = useState(0);

  if (photos.length === 0) {
    return (
      <div className="mb-6 flex h-96 items-center justify-center rounded-lg bg-gray-100 p-4 text-gray-400">
        No images available
      </div>
    );
  }

  const currentPhoto = photos[current];

  return (
    <div className="relative mb-6 h-96 w-full overflow-hidden rounded-lg bg-gray-100">
      <LoadingImage
        key={currentPhoto}
        src={currentPhoto}
        alt={title}
        fill
        className="object-contain"
        priority={current === 0}
        sizes="(max-width: 768px) 100vw, 768px"
      />

      {photos.length > 1 && (
        <>
          <button
            type="button"
            onClick={() =>
              setCurrent((prev) => (prev === 0 ? photos.length - 1 : prev - 1))
            }
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 px-3 py-2 text-white"
          >
            ←
          </button>

          <button
            type="button"
            onClick={() =>
              setCurrent((prev) => (prev === photos.length - 1 ? 0 : prev + 1))
            }
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 px-3 py-2 text-white"
          >
            →
          </button>

          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {photos.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrent(index)}
                className={`h-2 w-2 rounded-full ${
                  index === current ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
