"use client";

import type { AuctionListItem } from "@/types";
import Link from "next/link";
import { AuctionsTable } from "./auctions-table";

interface AuctionsPageProps {
  auctions: AuctionListItem[];
  error: string | null;
}

export function AuctionsPageClient({ auctions, error }: AuctionsPageProps) {
  return (
    <>
      {error && (
        <div
          className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700"
          role="alert"
        >
          {error}
        </div>
      )}

      {!error && (
        <AuctionsTable
          auctions={auctions}
          headerActions={
            <Link
              href="/admin/auctions/new"
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              + Add auction
            </Link>
          }
        />
      )}
    </>
  );
}
