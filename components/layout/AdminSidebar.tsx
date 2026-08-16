"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, FolderKanban, User, Briefcase, BookOpen,
  Trophy, Settings, LogOut, Zap, ChevronRight, Star, GraduationCap, Pencil,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sections = [
  {
    label: null,
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
      { href: "/admin/visual-editor", label: "Visual Editor", icon: Pencil, exact: true },
    ],
  },
  {
    label: "About Section",
    items: [
      { href: "/admin/profile", label: "Profile", icon: User },
      { href: "/admin/education", label: "Education", icon: GraduationCap },
      { href: "/admin/awards", label: "Awards", icon: Trophy },
    ],
  },
  {
    label: "Experience Section",
    items: [{ href: "/admin/experiences", label: "Experience", icon: Briefcase }],
  },
  {
    label: "Skills Section",
    items: [{ href: "/admin/skills", label: "Skills", icon: Star }],
  },
  {
    label: "Projects Section",
    items: [
      { href: "/admin/projects", label: "Projects", icon: FolderKanban },
      { href: "/admin/research", label: "Research Papers", icon: BookOpen },
    ],
  },
  {
    label: null,
    items: [{ href: "/admin/settings", label: "Settings", icon: Settings }],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const isActive = (href: string, exact?: boolean) => exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-card border-r border-white/5 flex flex-col z-30">
      <div className="p-6 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
            <Zap size={16} className="text-primary" />
          </div>
          <div>
            <p className="font-bold text-sm gradient-text-cyan leading-none">BuuTanh</p>
            <p className="text-xs text-muted-foreground mt-0.5">Admin Panel</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-4 overflow-y-auto">
        {sections.map((section, si) => (
          <div key={si}>
            {section.label && (
              <p className="text-xs text-muted-foreground/50 uppercase tracking-widest px-3 mb-1">{section.label}</p>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const active = isActive(item.href, (item as any).exact);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                      active ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    )}
                  >
                    <item.icon size={16} className={cn("flex-shrink-0", active ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                    {item.label}
                    {active && <ChevronRight size={14} className="ml-auto text-primary" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all mb-1">
          <Zap size={16} /> View Portfolio
        </Link>
        <button onClick={() => signOut({ callbackUrl: "/admin/login" })} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-red-400 hover:bg-red-400/5 transition-all">
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </aside>
  );
}
