import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { Plus, Edit, Trash2, Eye, Star } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { DeleteProjectButton } from "./DeleteProjectButton";

export const metadata: Metadata = { title: "Manage Projects" };

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    include: { _count: { select: { images: true } } },
  });

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-1">Projects</h1>
          <p className="text-muted-foreground">{projects.length} total projects</p>
        </div>
        <Link href="/admin/projects/new" className="btn-primary flex items-center gap-2">
          <Plus size={16} />
          New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <div className="text-5xl mb-4">📁</div>
          <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
          <p className="text-muted-foreground mb-6">Create your first project to get started.</p>
          <Link href="/admin/projects/new" className="btn-primary">
            Create Project
          </Link>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left p-4 text-xs text-muted-foreground uppercase tracking-wider">Project</th>
                <th className="text-left p-4 text-xs text-muted-foreground uppercase tracking-wider hidden md:table-cell">Category</th>
                <th className="text-left p-4 text-xs text-muted-foreground uppercase tracking-wider hidden md:table-cell">Status</th>
                <th className="text-left p-4 text-xs text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Created</th>
                <th className="text-right p-4 text-xs text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {projects.map((p) => (
                <tr key={p.id} className="hover:bg-white/2 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {p.featured && (
                        <Star size={12} className="text-yellow-400 fill-yellow-400 flex-shrink-0" />
                      )}
                      <div>
                        <p className="text-sm text-foreground font-medium">{p.title}</p>
                        <p className="text-xs text-muted-foreground">{p._count.images} images</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <span className="text-xs text-muted-foreground">{p.category}</span>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <span className={`px-2 py-0.5 rounded text-xs border ${
                      p.status === "completed"
                        ? "text-accent border-accent/30 bg-accent/5"
                        : "text-yellow-400 border-yellow-400/30 bg-yellow-400/5"
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4 hidden lg:table-cell">
                    <span className="text-xs text-muted-foreground">{formatDate(p.createdAt)}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/projects/${p.slug}`}
                        target="_blank"
                        className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-primary transition-all"
                      >
                        <Eye size={13} />
                      </Link>
                      <Link
                        href={`/admin/projects/${p.id}/edit`}
                        className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-primary transition-all"
                      >
                        <Edit size={13} />
                      </Link>
                      <DeleteProjectButton id={p.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
