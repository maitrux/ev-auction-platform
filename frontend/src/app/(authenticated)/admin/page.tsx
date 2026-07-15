import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <main className="p-6">
      <h1 className="mb-2 text-2xl font-bold">Admin dashboard</h1>
      <p className="mb-8 text-gray-600">
        Manage EV auctions and monitor bidding activity.
      </p>

      <div className="flex gap-4">
        <Link
          href="/admin/auctions"
          className="rounded border bg-white px-6 py-4 text-sm font-medium hover:bg-gray-50"
        >
          View auctions
        </Link>

        <Link
          href="/admin/auctions/new"
          className="rounded bg-blue-600 px-6 py-4 text-sm font-medium text-white hover:bg-blue-700"
        >
          Create auction
        </Link>
      </div>
    </main>
  );
}
