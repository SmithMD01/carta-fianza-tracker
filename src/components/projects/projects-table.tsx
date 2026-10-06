"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Project } from "@/types/project";
import { ProjectCreateModal } from "@/components/projects/project-create-modal";

type ProjectsTableProps = {
  projects: Project[];
  onSaveProject: (project: Project) => void;
};

export function ProjectsTable({ projects, onSaveProject }: ProjectsTableProps) {
  const [search, setSearch] = useState("");

  const filteredProjects = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();

    if (!normalizedSearch) return projects;

    return projects.filter((project) =>
      [
        project.projectCode,
        project.cui,
        project.referenceName,
        project.formalName,
        project.entityName,
        project.projectStage,
      ].some((value) => value.toLowerCase().includes(normalizedSearch)),
    );
  }, [projects, search]);

  return (
    <section className="mt-8 overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
      <header className="flex flex-col gap-4 border-b border-border px-6 py-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Proyectos</h1>
          <p className="mt-1 text-sm text-muted">
            Listado de proyectos registrados y acceso a su historial de cartas fianza.
          </p>
        </div>

        <label className="block w-full md:max-w-sm">
          <span className="sr-only">Buscar proyecto</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar proyecto..."
            className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
          />
        </label>
      </header>

      <div className="overflow-x-auto">
        <table className="min-w-[1100px] divide-y divide-border text-sm">
          <thead className="bg-surface-muted">
            <tr>
              {[
                "Código P. / CUI",
                "Nombre referencial",
                "Nombre formal del proyecto",
                "Entidad",
                "Cartas activas",
                "Etapa",
                "Acciones",
              ].map((heading) => (
                <th key={heading} className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {filteredProjects.map((project) => (
              <tr key={project.id} className="hover:bg-surface-muted">
                <td className="px-6 py-4">
                  <Link href={`/proyectos/${project.id}`} className="font-semibold text-primary hover:underline">
                    {project.projectCode}
                  </Link>
                  <div className="text-sm text-muted"><em>{project.cui}</em></div>
                </td>
                <td className="max-w-[220px] px-6 py-4 font-semibold text-foreground">{project.referenceName}</td>
                <td className="max-w-[300px] px-6 py-4 text-muted">{project.formalName}</td>
                <td className="max-w-[220px] px-6 py-4 font-semibold text-foreground">{project.entityName}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
                    {project.activeGuarantees} {project.activeGuarantees === 1 ? "activa" : "activas"}
                  </span>
                </td>
                <td className="px-6 py-4 text-muted">{project.projectStage}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/proyectos/${project.id}`}
                      className="inline-flex whitespace-nowrap rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary-soft"
                    >
                      Ver detalle
                    </Link>
                    <ProjectCreateModal project={project} onSave={onSaveProject} />
                  </div>
                </td>
              </tr>
            ))}

            {filteredProjects.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-sm text-muted">
                  No se encontraron proyectos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <footer className="flex items-center justify-between border-t border-border px-6 py-4 text-sm text-muted">
        <span>{filteredProjects.length} proyectos registrados</span>
        <div className="flex gap-2">
          <button className="rounded-lg bg-primary px-3 py-1.5 text-white">1</button>
          <button className="rounded-lg border border-border px-3 py-1.5">2</button>
        </div>
      </footer>
    </section>
  );
}
