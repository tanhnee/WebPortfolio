"use client";

import { MapPin, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Experience } from "@/types";

interface ExperienceCardProps {
  experience: Experience;
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
  return (
    <div className="glass-card p-5 card-hover">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <h3 className="font-semibold text-foreground">{experience.position}</h3>
          <p className="text-primary text-sm">{experience.company}</p>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          {experience.current && (
            <span className="badge-green text-xs">Current</span>
          )}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar size={11} />
            {formatDate(experience.startDate)} –{" "}
            {experience.current ? "Present" : formatDate(experience.endDate)}
          </div>
        </div>
      </div>

      {experience.location && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
          <MapPin size={11} />
          {experience.location}
        </div>
      )}

      <p className="text-sm text-muted-foreground leading-relaxed">
        {experience.description}
      </p>
    </div>
  );
}
