"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  ShoppingBag,
  Users,
  BarChart3,
  Palette,
  Heart,
  CreditCard,
  Settings,
  Bell,
  Search,
  Plus,
  MoreHorizontal,
  ArrowUpRight,
  Eye,
} from "lucide-react";

const stats = [
  {
    title: "Total Invitations",
    value: "1,248",
    change: "+12%",
    icon: FileText,
  },
  {
    title: "Orders",
    value: "324",
    change: "+8%",
    icon: ShoppingBag,
  },
  {
    title: "Customers",
    value: "892",
    change: "+18%",
    icon: Users,
  },
  {
    title: "Revenue",
    value: "₹3.8L",
    change: "+24%",
    icon: CreditCard,
  },
];

const invitations = [
  {
    id: "#INV-1024",
    couple: "Rahul & Anjali",
    theme: "Luna",
    views: 432,
    status: "Published",
  },
  {
    id: "#INV-1025",
    couple: "Arjun & Meera",
    theme: "Aura",
    views: 218,
    status: "Draft",
  },
  {
    id: "#INV-1026",
    couple: "John & Maria",
    theme: "Nexa",
    views: 582,
    status: "Published",
  },
];

const orders = [
  {
    id: "#ORD-2048",
    customer: "Rahul Kumar",
    plan: "Premium",
    amount: "₹1,499",
  },
  {
    id: "#ORD-2049",
    customer: "Anjali Nair",
    plan: "Gold",
    amount: "₹999",
  },
  {
    id: "#ORD-2050",
    customer: "Arjun Menon",
    plan: "Premium",
    amount: "₹1,499",
  },
];

const menuItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Invitations",
    icon: FileText,
  },
  {
    label: "Orders",
    icon: ShoppingBag,
  },
  {
    label: "Customers",
    icon: Users,
  },
  {
    label: "Analytics",
    icon: BarChart3,
  },
  {
    label: "Themes",
    icon: Palette,
  },
  {
    label: "Wishes",
    icon: Heart,
  },
  {
    label: "Payments",
    icon: CreditCard,
  },
  {
    label: "Settings",
    icon: Settings,
  },
];

export default function Dashboard() {
  const [active, setActive] = useState("Dashboard");

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {/* Sidebar */}
      <aside className="hidden w-72 border-r border-neutral-200 bg-white lg:flex lg:flex-col">
        <div className="border-b border-neutral-200 p-6">
          <h1 className="text-xl font-bold">Evllyne Studio</h1>
          <p className="mt-1 text-sm text-neutral-500">Admin Dashboard</p>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.label}
                  onClick={() => setActive(item.label)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                    active === item.label ? "bg-black text-white" : "text-neutral-600 hover:bg-neutral-100"
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-neutral-200 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-neutral-100 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white">A</div>

            <div>
              <p className="text-sm font-semibold">Admin User</p>
              <p className="text-xs text-neutral-500">admin@evllyne.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Content */}
      <div className="flex flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="relative w-full max-w-md">
              <Search size={18} className="absolute top-1/2 left-3 -translate-y-1/2 text-neutral-400" />

              <input
                placeholder="Search invitations..."
                className="h-11 w-full rounded-xl border border-neutral-200 bg-neutral-50 pr-4 pl-10 text-sm outline-none focus:border-black"
              />
            </div>

            <div className="flex items-center gap-3">
              <button className="flex h-11 w-11 items-center justify-center rounded-xl border border-neutral-200 bg-white">
                <Bell size={18} />
              </button>

              <button className="flex items-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-medium text-white">
                <Plus size={16} />
                Create Invite
              </button>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 p-6">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold">Dashboard</h2>
            <p className="mt-2 text-neutral-500">Welcome back. Here's an overview of your invitation business.</p>
          </div>

          {/* Stats */}
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.title} className="rounded-2xl border border-neutral-200 bg-white p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-500">{item.title}</span>

                    <div className="rounded-xl bg-neutral-100 p-2">
                      <Icon size={18} />
                    </div>
                  </div>

                  <div className="mt-4 flex items-end gap-2">
                    <h3 className="text-3xl font-bold">{item.value}</h3>

                    <span className="mb-1 text-sm font-medium text-green-600">{item.change}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Grid */}
          <div className="mt-8 grid gap-6 xl:grid-cols-3">
            {/* Chart */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 xl:col-span-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Invitation Views</h3>

                <button className="text-sm text-neutral-500">Last 30 Days</button>
              </div>

              <div className="mt-6 flex h-72 items-end gap-3">
                {[35, 55, 40, 72, 62, 90, 80, 100, 85, 120].map((height, i) => (
                  <div key={i} className="flex-1 rounded-t-xl bg-black/90" style={{ height: `${height}%` }} />
                ))}
              </div>
            </div>

            {/* Activity */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <h3 className="font-semibold">Recent Activity</h3>

              <div className="mt-6 space-y-4">
                {["New order received", "Invitation published", "Theme updated", "Payment completed", "New RSVP submitted"].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="mt-2 h-2 w-2 rounded-full bg-black" />
                    <p className="text-sm text-neutral-600">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tables */}
          <div className="mt-8 grid gap-6 xl:grid-cols-2">
            {/* Invitations */}
            <div className="rounded-2xl border border-neutral-200 bg-white">
              <div className="flex items-center justify-between border-b p-5">
                <h3 className="font-semibold">Recent Invitations</h3>

                <button>
                  <ArrowUpRight size={18} />
                </button>
              </div>

              <div>
                {invitations.map((invite) => (
                  <div key={invite.id} className="flex items-center justify-between border-b px-5 py-4 last:border-none">
                    <div>
                      <h4 className="font-medium">{invite.couple}</h4>

                      <p className="text-sm text-neutral-500">{invite.theme}</p>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-1 text-sm text-neutral-500">
                        <Eye size={14} />
                        {invite.views}
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          invite.status === "Published" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {invite.status}
                      </span>

                      <button>
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Orders */}
            <div className="rounded-2xl border border-neutral-200 bg-white">
              <div className="border-b p-5">
                <h3 className="font-semibold">Recent Orders</h3>
              </div>

              <div>
                {orders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between border-b px-5 py-4 last:border-none">
                    <div>
                      <h4 className="font-medium">{order.customer}</h4>

                      <p className="text-sm text-neutral-500">{order.plan}</p>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold">{order.amount}</p>

                      <p className="text-sm text-neutral-500">{order.id}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
