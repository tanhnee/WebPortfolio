import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import {
  FolderKanban,
  BookOpen,
  Briefcase,
  MessageSquare,
  TrendingUp,
  Plus,
  Eye,
} from "lucide-react";
import { formatFullDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin Dashboard" };

export default async function AdminDashboard() {
  const [projectCount, researchCount, experienceCount, messageCount, recentProjects, recentMessages] =
    await Promise.all([
      prisma.project.count(),
      prisma.research.count(),
      prisma.experience.count(),
      prisma.message.count({ where: { read: false } }),
      prisma.project.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: { id: true, title: true, category: true, status: true, createdAt: true, slug: true },
      }),
      prisma.message.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, email: true, subject: true, read: true, createdAt: true },
      }),
    ]);

  const stats = [
    { label: "Total Projects", value: projectCount, icon: FolderKanban, href: "/admin/projects", color: "text-primary" },
    { label: "Research Papers", value: researchCount, icon: BookOpen, href: "/admin/research", color: "text-accent" },
    { label: "Experiences", value: experienceCount, icon: Briefcase, href: "/admin/experiences", color: "text-secondary" },
    { label: "Unread Messages", value: messageCount, icon: MessageSquare, href: "#", color: "text-yellow-400" },
  ];

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-1">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, Tanh!</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <div className="glass-card p-5 card-hover flex items-start gap-4">
              <div className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <div>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-foreground">Recent Projects</h2>
            <Link href="/admin/projects/new" className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1">
              <Plus size={12} />
              New
            </Link>
          </div>

          {recentProjects.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">No projects yet</p>
          ) : (
            <div className="space-y-3">
              {recentProjects.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-foreground truncate">{p.title}</p>
                    <p className="text-xs text-muted-foreground">{p.category}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <span className={`px-2 py-0.5 rounded text-xs border ${
                      p.status === "completed"
                        ? "text-accent border-accent/30"
                        : "text-yellow-400 border-yellow-400/30"
                    }`}>
                      {p.status}
                    </span>
                    <Link href={`/admin/projects/${p.id}/edit`} className="text-muted-foreground hover:text-primary">
                      <Eye size={13} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Messages */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-foreground">Recent Messages</h2>
            <span className="text-xs text-muted-foreground">{messageCount} unread</span>
          </div>

          {recentMessages.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">No messages yet</p>
          ) : (
            <div className="space-y-3">
              {recentMessages.map((msg) => (
                <div key={msg.id} className={`flex items-start gap-3 py-2 border-b border-white/5 last:border-0 ${!msg.read ? "opacity-100" : "opacity-60"}`}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-foreground font-medium">{msg.name}</p>
                      {!msg.read && (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{msg.subject || "No subject"}</p>
                    <p className="text-xs text-muted-foreground/60">{formatFullDate(msg.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
