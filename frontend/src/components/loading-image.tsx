"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

function ImagePlaceholder() {
  return (
    <div
      className="absolute inset-0 animate-pulse bg-gray-200"
      aria-hidden="true"
    />
  );
}

export function ImageUnavailableIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-12 w-12"
      aria-hidden="true"
    >
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
      <circle
        cx="7"
        cy="17"
        r="2"
      />
      <path d="M9 17h6" />
      <circle
        cx="17"
        cy="17"
        r="2"
      />
    </svg>
  );
}

type LoadingImageProps = ImageProps;

export function LoadingImage({
  className = "",
  alt,
  onLoad,
  onError,
  onLoadingComplete,
  ...props
}: LoadingImageProps) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">(
    "loading",
  );

  if (status === "error") {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
        <ImageUnavailableIcon />
      </div>
    );
  }

  return (
    <>
      {status === "loading" ? <ImagePlaceholder /> : null}
      <Image
        {...props}
        alt={alt}
        className={`${className} ${
          status === "loading" ? "opacity-0" : "opacity-100"
        } transition-opacity duration-300`.trim()}
        onLoad={(event) => {
          setStatus("loaded");
          onLoad?.(event);
        }}
        onLoadingComplete={(image) => {
          setStatus("loaded");
          onLoadingComplete?.(image);
        }}
        onError={(event) => {
          setStatus("error");
          onError?.(event);
        }}
      />
    </>
  );
}
