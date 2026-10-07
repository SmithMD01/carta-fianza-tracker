"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Project } from "@/types/project";
import { ProjectCreateModal } from "@/components/projects/project-create-modal";
import { RowActionsMenu } from "@/components/row-actions-menu";
import {DataTablePagination} from "@/components/data-table/data-table-pagination";

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

      <DataTablePagination
        currentPage={visiblePage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalRows={filteredProjects.length}
        itemLabel="proyectos"
        onPageChange={setCurrentPage}
        onPageSizeChange={(newPageSize) => {
          setPageSize(newPageSize);
          setCurrentPage(1);
        }}
      />
    </section>
  );
}
