import Link from "next/link";
import type { Guarantee } from "@/types/guarantee";
import type { Project } from "@/types/project";

type ProjectDetailViewProps = {
  project: Project;
  guarantees: Guarantee[];
};

const moneyFormatter = new Intl.NumberFormat("es-PE", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

function isActiveGuarantee(guarantee: Guarantee) {
  return guarantee.status === "Activa";
}

export function ProjectDetailView({ project, guarantees }: ProjectDetailViewProps) {
  const activeGuarantees = guarantees.filter(isActiveGuarantee).length;
  const requestedGuarantees = guarantees.filter((guarantee) => guarantee.status === "Solicitud").length;

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
      <div className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link
              href="/proyectos"
              className="inline-flex rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-surface-muted"
            >
              ← Volver a proyectos
            </Link>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-primary">
              Detalle del proyecto
            </p>
            <h1 className="mt-2 text-2xl font-bold text-foreground">{project.referenceName}</h1>
          </div>

          <Link
            href="/cartas-fianza"
            className="inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-surface-muted"
          >
            Ver módulo de cartas
          </Link>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="xl:col-span-3">
            <DetailField label="Nombre formal del proyecto" value={project.formalName} />
          </div>
          <DetailField label="Cartas activas" value={`${activeGuarantees} de ${guarantees.length}`} />
          <DetailField label="Cartas solicitadas" value={`${requestedGuarantees} pendientes`} />
          <DetailField label="Código / CUI" value={`${project.projectCode} · CUI ${project.cui}`} />
          <DetailField label="Entidad" value={project.entityName} />
          <DetailField label="Etapa del proyecto" value={project.projectStage} />
          <DetailField label="Valor del proyecto" value={`S/ ${moneyFormatter.format(project.projectValue)}`} />
          <DetailField label="Proceso de selección" value={project.selectionProcess || "No registrado"} />
          <DetailField label="Consorciado con" value={project.consortiumWith || "No registrado"} />
          <DetailField label="Ganado con" value={project.wonWith || "No registrado"} />
        </div>
      </div>

      <div className="border-t border-border px-6 pt-5">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-bold text-foreground">Historial de cartas fianza</h2>
            <p className="text-sm text-muted">Las cartas vigentes se resaltan; las anteriores permanecen como historial.</p>
          </div>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-[950px] divide-y divide-border text-sm">
          <thead className="bg-surface-muted">
            <tr>
              {['#', 'N.° carta fianza', 'Motivo detallado', 'Monto', 'Vencimiento', 'Días pendientes', 'Encaje', 'Estado'].map((heading) => (
                <th key={heading} className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {guarantees.map((guarantee, index) => {
              const active = isActiveGuarantee(guarantee);

              return (
                <tr key={guarantee.id} className={active ? "bg-emerald-50/70" : "bg-surface hover:bg-surface-muted"}>
                  <td className="px-6 py-4 text-muted">{String(index + 1).padStart(2, "0")}</td>
                  <td className="px-6 py-4 font-semibold text-foreground">{guarantee.guaranteeNumber}</td>
                  <td className="px-6 py-4 text-muted">{guarantee.guaranteeReason}</td>
                  <td className="whitespace-nowrap px-6 py-4 font-semibold text-foreground">S/ {moneyFormatter.format(guarantee.guaranteeValue)}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-muted">{guarantee.expiresAt}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${active ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                      {active ? `${guarantee.renewalDays} días` : "Histórica"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-muted">S/ {moneyFormatter.format(guarantee.collateral)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${active ? "bg-emerald-100 text-emerald-700" : "bg-violet-100 text-violet-700"}`}>
                      {guarantee.status}
                    </span>
                  </td>
                </tr>
              );
            })}
            {guarantees.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-10 text-center text-sm text-muted">
                  Este proyecto todavía no tiene cartas fianza relacionadas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface-muted px-4 py-3">
      <p className="text-xs font-medium text-muted">{label}</p>
      <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}
