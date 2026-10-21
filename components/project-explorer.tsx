"use client";

import { useState } from "react";
import { projects, type ProjectCategory } from "@/lib/profile";
import { ArrowUpRight } from "./icons";

const filters: Array<"All" | ProjectCategory> = [
  "All",
  "AI & Backend",
  "Data & ML",
  "Full Stack",
];

export function ProjectExplorer() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const visibleProjects =
    filter === "All"
      ? projects
      : projects.filter((project) => project.categories.includes(filter));

  return (
    <div>
      <div className="filterBar" role="group" aria-label="Filter projects by discipline">
        {filters.map((item) => (
          <button
            className={filter === item ? "filterButton filterButtonActive" : "filterButton"}
            key={item}
            onClick={() => setFilter(item)}
            type="button"
            aria-pressed={filter === item}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="projectGrid" aria-live="polite">
        {visibleProjects.map((project, index) => (
          <article className={project.featured ? "projectCard projectCardFeatured" : "projectCard"} key={project.title}>
            <div className="projectTopline">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <span>{project.eyebrow}</span>
            </div>
            <h3>{project.title}</h3>
            <p>{project.summary}</p>
            <div className="projectOutcome">
              <span>Outcome</span>
              <p>{project.outcome}</p>
            </div>
            <div className="tagRow">
              {project.tags.map((tag) => (
                <span className="tag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
            {project.href ? (
              <a className="textLink" href={project.href} target="_blank" rel="noreferrer">
                {project.linkLabel}
                <ArrowUpRight width={17} height={17} />
              </a>
            ) : (
              <span className="confidentialLabel">Case study summary · client details protected</span>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
