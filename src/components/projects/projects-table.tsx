"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Project } from "@/types/project";
import { ProjectCreateModal } from "@/components/projects/project-create-modal";
import { RowActionsMenu } from "@/components/row-actions-menu";

type ProjectsTableProps = {
  projects: Project[];
  onSaveProject: (project: Project) => void;
};

export function ProjectsTable({ projects, onSaveProject }: ProjectsTableProps) {
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

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

  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / pageSize));
  const visiblePage = Math.min(currentPage, totalPages);
  const paginatedProjects = filteredProjects.slice((visiblePage - 1) * pageSize, visiblePage * pageSize);
  const firstVisibleRow = filteredProjects.length === 0 ? 0 : (visiblePage - 1) * pageSize + 1;
  const lastVisibleRow = Math.min(visiblePage * pageSize, filteredProjects.length);

  return (
    <section className="mt-8 overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
      <header className="flex justify-end border-b border-border px-6 py-4">
        <label className="block w-full md:max-w-sm">
          <span className="sr-only">Buscar proyecto</span>
          <input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setCurrentPage(1);
            }}
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
            {paginatedProjects.map((project) => (
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
                  <RowActionsMenu>
                    <Link href={`/proyectos/${project.id}`} className="block rounded-md px-3 py-2 text-left text-xs font-medium text-foreground hover:bg-surface-muted">
                      Ver detalle
                    </Link>
                    <ProjectCreateModal project={project} onSave={onSaveProject} menuItem />
                  </RowActionsMenu>
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

      <footer className="flex flex-col gap-3 border-t border-border px-6 py-4 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <span>{filteredProjects.length === 0 ? "No hay registros para mostrar" : `Mostrando ${firstVisibleRow}-${lastVisibleRow} de ${filteredProjects.length} proyectos`}</span>
        <div className="flex flex-wrap items-center justify-end gap-3">
          <label htmlFor="project-page-size" className="whitespace-nowrap">Filas por página:</label>
          <select
            id="project-page-size"
            value={pageSize}
            onChange={(event) => {
              setPageSize(Number(event.target.value));
              setCurrentPage(1);
            }}
            className="rounded-lg border border-border bg-surface px-2 py-1.5 text-sm text-foreground outline-none focus:border-primary"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
          </select>
          <button type="button" disabled={visiblePage === 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} className="rounded-lg border border-border px-3 py-1.5 text-foreground disabled:cursor-not-allowed disabled:opacity-40">Anterior</button>
          <span className="whitespace-nowrap text-foreground">Página {visiblePage} de {totalPages}</span>
          <button type="button" disabled={visiblePage === totalPages} onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} className="rounded-lg border border-border px-3 py-1.5 text-foreground disabled:cursor-not-allowed disabled:opacity-40">Siguiente</button>
        </div>
      </footer>
    </section>
  );
}
