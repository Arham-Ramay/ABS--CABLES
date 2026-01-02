"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Package,
  Warehouse,
  ShoppingCart,
  ShoppingCart as PurchaseCart,
  Users,
  FileText,
  Settings,
  Menu,
  X,
  LogOut,
  User,
} from "lucide-react";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
}

const sidebarItems: SidebarItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <BarChart3 className="w-5 h-5" />,
    href: "/dashboard",
  },
  {
    id: "production",
    label: "Production",
    icon: <Package className="w-5 h-5" />,
    href: "/production",
  },
  {
    id: "inventory",
    label: "Inventory",
    icon: <Warehouse className="w-5 h-5" />,
    href: "/inventory",
  },
  {
    id: "sales",
    label: "Sales",
    icon: <ShoppingCart className="w-5 h-5" />,
    href: "/sales",
  },
  {
    id: "purchase",
    label: "Purchase",
    icon: <PurchaseCart className="w-5 h-5" />,
    href: "/purchase",
  },
  {
    id: "employees",
    label: "Employees",
    icon: <Users className="w-5 h-5" />,
    href: "/employees",
  },
  {
    id: "billing",
    label: "Billing",
    icon: <FileText className="w-5 h-5" />,
    href: "/billing",
  },
  {
    id: "settings",
    label: "Settings",
    icon: <Settings className="w-5 h-5" />,
    href: "/settings",
  },
];

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobile: boolean;
  onMobileClose?: () => void;
  user: { email: string; role: string };
  onLogout: () => void;
}

export default function Sidebar({
  isCollapsed,
  setIsCollapsed,
  isMobile,
  onMobileClose,
  user,
  onLogout,
}: SidebarProps) {
  const pathname = usePathname();

  const handleItemClick = () => {
    if (isMobile && onMobileClose) {
      onMobileClose();
    }
  };

  return (
    <div
      className={cn(
        "bg-white border-r border-gray-200 flex flex-col transition-all duration-300",
        isCollapsed ? "w-24" : "w-96",
        isMobile && !isCollapsed && "fixed inset-y-0 left-0 z-50 w-96",
        isMobile && isCollapsed && "hidden",
        !isMobile && "relative"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h1 className="text-xl font-bold text-blue-600">ABS Cables</h1>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              isMobile ? onMobileClose?.() : setIsCollapsed(!isCollapsed)
            }
            className="p-2 cursor-pointer"
          >
            {isMobile ? (
              <X className="w-4 h-4" />
            ) : isCollapsed ? (
              <Menu className="w-4 h-4" />
            ) : (
              <X className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6 space-y-4">
        {sidebarItems.map((item) => (
          <Link key={item.id} href={item.href} onClick={handleItemClick}>
            <Button
              variant={pathname === item.href ? "default" : "ghost"}
              className={cn(
                "w-full justify-start cursor-pointer h-12 py-3",
                pathname === item.href
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                isCollapsed && "px-2"
              )}
            >
              {item.icon}
              {!isCollapsed && (
                <span className="ml-4 text-base">{item.label}</span>
              )}
            </Button>
          </Link>
        ))}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-blue-600" />
          </div>
          {!isCollapsed && (
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{user.email}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="p-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-gray-500" />
          </Button>
        </div>
      </div>
    </div>
  );
}
