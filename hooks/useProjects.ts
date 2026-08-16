"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Project } from "@/types";

async function fetchProjects(params?: {
  search?: string;
  category?: string;
  featured?: boolean;
}): Promise<Project[]> {
  const searchParams = new URLSearchParams();
  if (params?.search) searchParams.set("search", params.search);
  if (params?.category && params.category !== "All")
    searchParams.set("category", params.category);
  if (params?.featured) searchParams.set("featured", "true");

  const res = await fetch(`/api/projects?${searchParams.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch projects");
  return res.json();
}

async function fetchProject(id: string): Promise<Project> {
  const res = await fetch(`/api/projects/${id}`);
  if (!res.ok) throw new Error("Failed to fetch project");
  return res.json();
}

async function deleteProject(id: string): Promise<void> {
  const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete project");
}

export function useProjects(params?: {
  search?: string;
  category?: string;
  featured?: boolean;
}) {
  return useQuery({
    queryKey: ["projects", params],
    queryFn: () => fetchProjects(params),
    staleTime: 1000 * 60 * 5,
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ["project", id],
    queryFn: () => fetchProject(id),
    enabled: !!id,
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}
