"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter } from "lucide-react";
import { useProjects } from "@/hooks/useProjects";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { AnimatedSection } from "@/components/common/AnimatedSection";

export default function ProjectsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const { data: projects, isLoading } = useProjects({
    search: search || undefined,
    category: category === "All" ? undefined : category,
  });

  const { data: allProjects } = useProjects({});
  const categories = ["All", ...Array.from(new Set((allProjects ?? []).map((p) => p.category).filter(Boolean)))];

  return (
    <div className="pt-28 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <AnimatedSection className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            My Projects
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A comprehensive collection of my work in AI, Data Analytics,
            Business Intelligence, and more.
          </p>
        </AnimatedSection>

        {/* Search & Filter */}
        <AnimatedSection className="mb-10" delay={0.1}>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-dark w-full pl-10"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Filter size={14} className="text-muted-foreground" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                    category === cat
                      ? "bg-primary/15 text-primary border border-primary/30"
                      : "bg-white/5 text-muted-foreground border border-white/10 hover:border-white/20 hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="glass-card h-80 skeleton rounded-2xl" />
            ))}
          </div>
        ) : projects && projects.length > 0 ? (
          <>
            <p className="text-sm text-muted-foreground mb-6">
              Showing {projects.length} project{projects.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No projects found
            </h3>
            <p className="text-muted-foreground">
              {search
                ? `No projects match "${search}"`
                : "No projects in this category yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
