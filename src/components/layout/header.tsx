"use client";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";

interface HeaderProps {
  onMobileMenuOpen: () => void;
  user: { email: string; role: string };
}

interface Breadcrumb {
  name: string;
  href: string;
  isLast: boolean;
}

export default function Header({ onMobileMenuOpen, user }: HeaderProps) {
  const pathname = usePathname();

  // Generate breadcrumbs from pathname
  const generateBreadcrumbs = () => {
    const segments = pathname.split("/").filter((segment) => segment);
    const breadcrumbs: Breadcrumb[] = [];

    segments.forEach((segment) => {
      const isDynamic = segment.startsWith("[") && segment.endsWith("]");
      const displayName = isDynamic
        ? segment.slice(1, -1).charAt(0).toUpperCase() + segment.slice(2, -1)
        : segment.charAt(0).toUpperCase() + segment.slice(1);

      const href =
        "/" + segments.slice(0, segments.indexOf(segment) + 1).join("/");
      breadcrumbs.push({
        name: displayName,
        href,
        isLast: segment === segments[segments.length - 1],
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMobileMenuOpen}
            className="lg:hidden cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </Button>

          {/* Breadcrumbs - Don't show on dashboard */}
          {pathname !== "/dashboard" && (
            <nav className="flex items-center space-x-2 text-sm">
              <a
                href="/dashboard"
                className="text-gray-500 hover:text-gray-700"
              >
                Dashboard
              </a>
              {breadcrumbs.map((breadcrumb) => (
                <div
                  key={breadcrumb.href}
                  className="flex items-center space-x-2"
                >
                  <span className="text-gray-400">/</span>
                  {breadcrumb.isLast ? (
                    <span className="text-black font-medium">
                      {breadcrumb.name}
                    </span>
                  ) : (
                    <a
                      href={breadcrumb.href}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {breadcrumb.name}
                    </a>
                  )}
                </div>
              ))}
            </nav>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-medium text-sm">
                {user.email.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-black">{user.email}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
