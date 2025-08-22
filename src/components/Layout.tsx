"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  BookOpen,
  TrendingUp,
  User,
  MessageCircle,
  Home,
} from "lucide-react";

const navItems = [
  { name: "Home", path: "/", icon: Home },
  { name: "Today", path: "/today", icon: Calendar },
  { name: "Plan", path: "/plan", icon: Calendar },
  { name: "Library", path: "/library", icon: BookOpen },
  { name: "Insights", path: "/insights", icon: TrendingUp },
  { name: "Profile", path: "/profile", icon: User },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header for larger screens */}
      <header className="hidden md:block bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">ByteSized</h1>
          </div>

          <nav className="flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
            <Link
              href="/copilot"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Copilot</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 pb-20 md:pb-0">{children}</main>

      {/* Bottom navigation for mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="grid grid-cols-5 py-2">
          {navItems.slice(0, 5).map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className={`flex flex-col items-center justify-center py-2 px-1 ${
                isActive(item.path) ? "text-indigo-600" : "text-gray-400"
              }`}
            >
              <item.icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Floating Copilot button for mobile */}
      <Link
        href="/copilot"
        className="md:hidden fixed bottom-24 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-indigo-700 transition-colors z-50"
      >
        <MessageCircle className="w-6 h-6" />
      </Link>
    </div>
  );
}
