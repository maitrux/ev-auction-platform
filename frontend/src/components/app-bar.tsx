"use client";

import { logout } from "@/lib/api";
import { useRouter } from "next/navigation";

function LogOutIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  );
}

interface AppBarProps {
  userName: string;
}

export function AppBar({ userName }: AppBarProps) {
  const router = useRouter();

  async function handleLogout() {
    try {
      await logout();
      router.push("/");
      router.refresh();
    } catch {
      // Do nothing
    }
  }

  return (
    <header className="border-b border-gray-200 bg-white px-6 py-3">
      <div className="flex items-center justify-end gap-3">
        <span className="text-sm font-medium text-gray-900">{userName}</span>
        <button
          type="button"
          onClick={handleLogout}
          aria-label="Log out"
          className="rounded p-1.5 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
        >
          <LogOutIcon />
        </button>
      </div>
    </header>
  );
}
