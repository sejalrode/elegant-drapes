import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { BarChart3, ClipboardList, Home, PlusCircle, Users } from "lucide-react";
import { AuthButton } from "@/components/AuthButton";
import "./globals.css";

export const metadata: Metadata = {
  title: "Elegant Drapes Order Tracker",
  description: "Mobile-first order and profit tracker for Elegant Drapes",
  applicationName: "Elegant Drapes",
  appleWebApp: {
    capable: true,
    title: "Elegant Drapes",
    statusBarStyle: "default"
  },
  formatDetection: {
    telephone: true
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0f766e"
};

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/orders", label: "Orders", icon: ClipboardList },
  { href: "/orders/new", label: "Add Order", icon: PlusCircle },
  { href: "/source-groups", label: "Groups", icon: Users },
  { href: "/reports", label: "Reports", icon: BarChart3 }
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen pb-24 md:pb-0">
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
              <Link href="/dashboard" className="flex items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-palm text-lg font-bold text-white">ED</span>
                <span>
                  <span className="block text-base font-bold leading-tight text-ink">Elegant Drapes</span>
                  <span className="block text-xs text-slate-500">Order Tracker</span>
                </span>
              </Link>
              <div className="hidden items-center gap-2 md:flex">
                <AuthButton />
                <Link href="/orders/new" className="rounded-md bg-palm px-4 py-2 text-sm font-bold text-white">
                  Add Booked Item
                </Link>
              </div>
            </div>
          </header>
          <main className="mx-auto max-w-6xl px-4 py-5 sm:px-5">{children}</main>
          <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)] md:hidden">
            <div className="grid grid-cols-5">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href} className="flex min-h-20 flex-col items-center justify-center gap-1 px-1 text-center text-[11px] font-semibold leading-tight text-slate-600">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      </body>
    </html>
  );
}
