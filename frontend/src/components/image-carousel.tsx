"use client";

import Image from "next/image";
import { useState } from "react";

interface ImageCarouselProps {
  photos: string[];
  title: string;
}

export default function ImageCarousel({ photos, title }: ImageCarouselProps) {
  const [current, setCurrent] = useState(0);

  if (photos.length === 0) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-100 text-gray-400 mb-6 rounded-md p-4">
        No images available
      </div>
    );
  }

  return (
    <div className="relative h-96 w-full overflow-hidden rounded-lg">
      <Image
        src={photos[current]}
        alt={title}
        fill
        className="object-contain"
        priority={current === 0}
      />

      {photos.length > 1 && (
        <>
          <button
            onClick={() =>
              setCurrent((prev) => (prev === 0 ? photos.length - 1 : prev - 1))
            }
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 px-3 py-2 text-white"
          >
            ←
          </button>

          <button
            onClick={() =>
              setCurrent((prev) => (prev === photos.length - 1 ? 0 : prev + 1))
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 px-3 py-2 text-white"
          >
            →
          </button>

          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {photos.map((_, index) => (
              <button
                key={index}
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
