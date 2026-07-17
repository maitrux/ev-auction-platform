"use client";

import { useEffect, useRef, useState } from "react";

import { formatDateTime } from "@/lib/format";
import type { AuctionStatus } from "@/types/auction";

interface AuctionCountdownProps {
  status: AuctionStatus;
  startsAt: string | null;
  endsAt: string | null;
  onExpire?: () => void;
}

function getTargetTimestamp(
  status: AuctionStatus,
  startsAt: string | null,
  endsAt: string | null,
): number | null {
  if (status === "LIVE" && endsAt) {
    return new Date(endsAt).getTime();
  }

  if (status === "SCHEDULED" && startsAt) {
    return new Date(startsAt).getTime();
  }

  return null;
}

function formatRemaining(milliseconds: number): string {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const days = Math.floor(totalSeconds / 86_400);
  const hours = Math.floor((totalSeconds % 86_400) / 3_600);
  const minutes = Math.floor((totalSeconds % 3_600) / 60);
  const seconds = totalSeconds % 60;

  const parts: string[] = [];

  if (days > 0) {
    parts.push(`${days}d`);
  }

  if (hours > 0 || days > 0) {
    parts.push(`${hours}h`);
  }

  parts.push(`${minutes}m`);
  parts.push(`${seconds}s`);

  return parts.join(" ");
}

function CountdownLine({
  formattedDate,
  children,
  className = "text-gray-900",
}: {
  formattedDate: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={`text-sm font-medium ${className}`}>
      {children}
      <span className="text-gray-400"> · </span>
      <span className="font-normal text-gray-600">{formattedDate}</span>
    </p>
  );
}

export function AuctionCountdown({
  status,
  startsAt,
  endsAt,
  onExpire,
}: AuctionCountdownProps) {
  const targetTimestamp = getTargetTimestamp(status, startsAt, endsAt);
  const [remainingMs, setRemainingMs] = useState<number | null>(null);
  const onExpireRef = useRef(onExpire);
  const hasExpiredRef = useRef(false);

  onExpireRef.current = onExpire;

  useEffect(() => {
    if (targetTimestamp == null) {
      return;
    }

    hasExpiredRef.current = false;

    const updateRemaining = () => {
      const nextRemaining = targetTimestamp - Date.now();
      setRemainingMs(nextRemaining);

      if (nextRemaining <= 0 && !hasExpiredRef.current) {
        hasExpiredRef.current = true;
        onExpireRef.current?.();
      }
    };

    updateRemaining();
    const intervalId = window.setInterval(updateRemaining, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [targetTimestamp]);

  if (targetTimestamp == null) {
    return null;
  }

  const prefix = status === "LIVE" ? "Ends in" : "Starts in";
  const formattedDate = formatDateTime(new Date(targetTimestamp));

  if (remainingMs === null) {
    return (
      <CountdownLine formattedDate={formattedDate}>
        {prefix}{" "}
        <span className="font-semibold text-blue-700">...</span>
      </CountdownLine>
    );
  }

  if (remainingMs <= 0) {
    return (
      <CountdownLine
        formattedDate={formattedDate}
        className="text-gray-700"
      >
        {status === "LIVE" ? "Ended" : "Starting soon"}
      </CountdownLine>
    );
  }

  return (
    <CountdownLine formattedDate={formattedDate}>
      {prefix}{" "}
      <span className="font-semibold text-blue-700">
        {formatRemaining(remainingMs)}
      </span>
    </CountdownLine>
  );
}
