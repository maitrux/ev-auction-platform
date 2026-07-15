"use client";

import { logout } from "@/lib/client/auth";
import Link from "next/link";
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
      <line
        x1="21"
        x2="9"
        y1="12"
        y2="12"
      />
    </svg>
  );
}

interface AppBarProps {
  user: {
    name: string;
    role: "ADMIN" | "DEALER";
  };
}

export function AppBar({ user }: AppBarProps) {
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

  const links =
    user.role === "ADMIN"
      ? [
          {
            href: "/admin/auctions",
            label: "Auctions",
          },
          {
            href: "/admin/vehicles",
            label: "Vehicles",
          },
        ]
      : [
          {
            href: "/auctions",
            label: "Auctions",
          },
        ];

  return (
    <header className="border-b border-gray-200 bg-white px-6 py-3">
      <div className="flex items-center justify-between">
        <nav className="flex gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-900">{user.name}</span>

          <button
            type="button"
            onClick={handleLogout}
            aria-label="Log out"
            className="rounded p-1.5 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
          >
            <LogOutIcon />
          </button>
        </div>
      </div>
    </header>
  );
}
