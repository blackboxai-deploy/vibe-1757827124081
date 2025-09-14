"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/providers/auth-provider";
import Link from "next/link";

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: "📊",
    description: "Overview & Analytics"
  },
  {
    title: "Bookings",
    href: "/admin/bookings",
    icon: "📅",
    description: "Manage reservations"
  },
  {
    title: "Areas & Products",
    href: "/admin/areas",
    icon: "🏢",
    description: "Space management"
  },
  {
    title: "Customers",
    href: "/admin/customers",
    icon: "👥",
    description: "User management"
  },
  {
    title: "Payments",
    href: "/admin/payments",
    icon: "💳",
    description: "Transaction history"
  },
  {
    title: "Parking",
    href: "/admin/parking",
    icon: "🅿️",
    description: "Vehicle management"
  },
  {
    title: "Forum",
    href: "/admin/forum",
    icon: "💬",
    description: "Community moderation"
  },
  {
    title: "Feedback",
    href: "/admin/feedback",
    icon: "⭐",
    description: "NPS & Reviews"
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: "⚙️",
    description: "System configuration"
  }
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  const Sidebar = ({ className = "" }: { className?: string }) => (
    <div className={`bg-white border-r border-gray-200 ${className}`}>
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">CODEN</h1>
              <p className="text-sm text-gray-600">Admin Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors group"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="text-xl">{item.icon}</span>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">
                  {item.title}
                </div>
                <div className="text-xs text-gray-500">
                  {item.description}
                </div>
              </div>
            </Link>
          ))}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">
                {user?.name}
              </div>
              <div className="text-xs text-gray-500">
                {user?.employeeId && `ID: ${user.employeeId}`}
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              {user?.role}
            </Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="w-full"
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="fixed top-4 left-4 z-50 md:hidden"
          >
            <span className="text-xl">☰</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-80">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <Sidebar className="hidden md:block fixed left-0 top-0 h-full w-80 z-40" />

      {/* Main content */}
      <div className="md:ml-80">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}