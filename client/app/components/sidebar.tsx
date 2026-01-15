"use client";

import { usePathname } from "next/navigation";
import { Home, BarChart3, Trophy, Newspaper } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/weekly-blog", label: "Blog", icon: Newspaper },
];

interface SidebarProps {
  activePage?: string;
  onNavigate?: (page: string) => void;
}

export function Sidebar({ activePage, onNavigate }: SidebarProps) {
  const pathname = usePathname();

  const handleNavClick = (href: string, e: React.MouseEvent) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(href);
    }
  };

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <span className="sidebar-brand-text">LayComplain</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isActive = activePage ? activePage === item.href : pathname === item.href;
          return (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => handleNavClick(item.href, e)}
              className={cn(
                "sidebar-nav-item",
                isActive && "sidebar-nav-item-active"
              )}
            >
              <item.icon className="sidebar-nav-icon" />
              <span>{item.label}</span>
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
