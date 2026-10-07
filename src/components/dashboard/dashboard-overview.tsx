"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Guarantee } from "@/types/guarantee";
import { ColumnFilter } from "@/components/column-filter";
import { GUARANTEE_STATUSES } from "@/config/business-options";
import type {
  GuaranteeColumnFilters,
  GuaranteeQuestion,
} from "@/types/guarantee-filters";
import {
  isActiveGuarantee,
  isNearExpiry,
} from "@/lib/guarantees/guarantee-filter-rules";
import {
  createInitialGuaranteeColumnFilters,
  GUARANTEE_QUESTION_OPTIONS,
} from "@/config/guarantee-filter-options";
import { filterGuarantees } from "@/lib/guarantees/filter-guarantees";

type DashboardOverviewProps = { guarantees: Guarantee[] };

const inputClassName = "rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-primary";

export function DashboardOverview({ guarantees }: DashboardOverviewProps) {
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedInsurer, setSelectedInsurer] = useState("all");
  const [selectedQuestion, setSelectedQuestion] = useState<GuaranteeQuestion>("all");
  const [columnFilters, setColumnFilters] = useState<GuaranteeColumnFilters>(createInitialGuaranteeColumnFilters());
  const [tablePage, setTablePage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const insurers = useMemo(() => [...new Set(guarantees.map((guarantee) => guarantee.insurerName))], [guarantees]);
  const statuses = useMemo(() => [...new Set([...GUARANTEE_STATUSES, ...guarantees.map((guarantee) => guarantee.status)])], [guarantees]);
  const guaranteeGroups = useMemo(() => [...new Set(guarantees.flatMap((guarantee) => guarantee.guaranteeGroups))], [guarantees]);

  const filteredGuarantees = useMemo(
    () =>
      filterGuarantees(guarantees, {
        search,
        selectedStatus,
        selectedInsurer,
        selectedQuestion,
        columnFilters,
      }),
    [
      guarantees,
      search,
      selectedStatus,
      selectedInsurer,
      selectedQuestion,
      columnFilters,
    ],
  );
  
  const updateColumnFilter = (field: keyof GuaranteeColumnFilters, value: string) => {
    setTablePage(1);
    setColumnFilters((currentFilters) => ({ ...currentFilters, [field]: value }));
  };

  const clearAllFilters = () => {
    setSearch("");
    setSelectedStatus("all");
    setSelectedInsurer("all");
    setSelectedQuestion("all");
    setTablePage(1);
    setColumnFilters(createInitialGuaranteeColumnFilters());
  };

  const hasActiveFilters = search || selectedStatus !== "all" || selectedInsurer !== "all" || selectedQuestion !== "all" || Object.values(columnFilters).some(Boolean);

  const insurerSummary = useMemo(() => {
    return insurers.map((insurer) => ({
      insurer,
      count: filteredGuarantees.filter((guarantee) => guarantee.insurerName === insurer).length,
    })).filter((item) => item.count > 0).sort((a, b) => b.count - a.count);
  }, [filteredGuarantees, insurers]);

  const expiringGuarantees = filteredGuarantees.filter(isNearExpiry).sort((a, b) => a.renewalDays - b.renewalDays).slice(0, 5);
  const orderedGuarantees = selectedQuestion === "por-vencer"
    ? [...filteredGuarantees].sort((a, b) => a.renewalDays - b.renewalDays)
    : selectedQuestion === "solicitadas"
      ? [...filteredGuarantees].sort((a, b) => a.validFrom.localeCompare(b.validFrom))
      : filteredGuarantees;
  const totalPages = Math.max(1, Math.ceil(orderedGuarantees.length / pageSize));
  const currentPage = Math.min(tablePage, totalPages);
  const paginatedGuarantees = orderedGuarantees.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const totalValue = filteredGuarantees.reduce((total, guarantee) => total + guarantee.guaranteeValue, 0);
  const activeCount = filteredGuarantees.filter(isActiveGuarantee).length;
  const expiringCount = filteredGuarantees.filter(isNearExpiry).length;
  const collateralValue = filteredGuarantees.reduce((total, guarantee) => total + guarantee.collateral, 0);
  const summaryAmount = selectedQuestion === "encaje-pendiente" ? collateralValue : totalValue;
  const summaryLabel = "Encaje registrado";
  const maxInsurerCount = Math.max(1, ...insurerSummary.map((item) => item.count));

  return (
    <div className="mt-6 space-y-5">
      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Cartas solicitadas" value={String(filteredGuarantees.filter((guarantee) => guarantee.status === "Solicitud").length)} detail="Pendientes de gestión" />
        <KpiCard label="Cartas activas" value={String(activeCount)} detail="Vigentes o en renovación" />
        <KpiCard label="Próximas a renovar" value={String(expiringCount)} detail="Requieren seguimiento" />
        <KpiCard label={summaryLabel} value={`S/ ${summaryAmount.toLocaleString("es-PE")}`} detail={selectedQuestion === "encaje-pendiente" ? "Suma del encaje registrado" : `Valor CF: S/ ${totalValue.toLocaleString("es-PE")}`} />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_1.35fr]">
        <section className="rounded-xl border border-border bg-surface px-5 py-4">
          <div className="flex items-start justify-between gap-3">
            <div><h2 className="text-base font-bold text-foreground">Cartas por aseguradora</h2></div>
            <Link href="/cartas-fianza" className="text-sm font-semibold text-primary hover:underline">Ver módulo →</Link>
          </div>
          <div className="mt-5 space-y-4">
            {insurerSummary.map((item) => (
              <div key={item.insurer}>
                <div className="mb-1 flex justify-between text-sm"><span>{item.insurer}</span><span className="font-semibold">{item.count}</span></div>
                <div className="h-2 rounded-full bg-surface-muted"><div className="h-2 rounded-full bg-primary" style={{ width: `${(item.count / maxInsurerCount) * 100}%` }} /></div>
              </div>
            ))}
            {insurerSummary.length === 0 && <p className="text-sm text-muted">No hay datos para los filtros seleccionados.</p>}
          </div>
        </section>

        <section className="rounded-xl border border-border bg-surface px-5 py-4">
          <div className="flex items-start justify-between gap-3">
            <div><h2 className="text-base font-bold text-foreground">Cartas próximas a renovar</h2></div>
            <Link href="/cartas-fianza" className="text-sm font-semibold text-primary hover:underline">Ver detalle →</Link>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="border-b border-border text-left text-[11px] uppercase tracking-wide text-muted"><tr><th className="py-2 pr-4">N.° carta</th><th className="py-2 pr-4">Obra referencial</th><th className="py-2 pr-4">Vencimiento</th><th className="py-2">Días</th></tr></thead>
              <tbody className="divide-y divide-border">
                {expiringGuarantees.map((guarantee) => <tr key={guarantee.id}><td className="py-3 pr-4 font-semibold">{guarantee.guaranteeNumber}</td><td className="max-w-[220px] truncate py-3 pr-4 text-muted">{guarantee.projectName}</td><td className="whitespace-nowrap py-3 pr-4 text-muted">{guarantee.expiresAt}</td><td className="py-3"><span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">{guarantee.renewalDays} días</span></td></tr>)}
                {expiringGuarantees.length === 0 && <tr><td colSpan={4} className="py-6 text-center text-muted">No hay cartas próximas a renovar.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      </section>

      <section className="overflow-hidden rounded-xl border border-border bg-surface">
        <header className="border-b border-border px-5 py-4">
          <h2 className="text-base font-bold text-foreground">Resumen de cartas fianza</h2>
          <div className="mt-4 grid gap-3 xl:grid-cols-12">
            <input value={search} onChange={(event) => { setSearch(event.target.value); setTablePage(1); }} placeholder="Buscar carta, entidad u obra..." className={`${inputClassName} w-full text-xs xl:col-span-6`} />
            <select value={selectedStatus} onChange={(event) => { setSelectedStatus(event.target.value); setTablePage(1); }} className={`${inputClassName} w-full text-xs xl:col-span-3`}><option value="all">Todos los estados</option>{statuses.map((status) => <option key={status} value={status}>{status}</option>)}</select>
            <div className="xl:col-span-3">
              <ColumnFilter label="agrupación" value={columnFilters.guaranteeGroups} onChange={(value) => updateColumnFilter("guaranteeGroups", value)} options={guaranteeGroups} multiple appearance="select" />
            </div>
            <div className="flex min-w-0 items-center gap-3 xl:col-span-6">
              <label htmlFor="dashboard-question-filter" className="shrink-0 text-xs font-semibold text-foreground">Responder pregunta:</label>
              <select id="dashboard-question-filter" value={selectedQuestion} onChange={(event) => { setSelectedQuestion(event.target.value as GuaranteeQuestion); setTablePage(1);}} className="min-w-0 flex-1 rounded-lg border border-primary bg-primary-soft px-3 py-2 text-xs font-semibold text-primary outline-none focus:ring-2 focus:ring-primary/20">{GUARANTEE_QUESTION_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
            </div>
            <select value={selectedInsurer} onChange={(event) => { setSelectedInsurer(event.target.value); setTablePage(1); }} className={`${inputClassName} w-full text-xs xl:col-span-3`}><option value="all">Todas las aseguradoras</option>{insurers.map((insurer) => <option key={insurer} value={insurer}>{insurer}</option>)}</select>
            <button
              type="button"
              onClick={clearAllFilters}
              disabled={!hasActiveFilters}
              className="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:border-border disabled:bg-surface disabled:text-muted xl:col-span-3"
            >
              Limpiar filtros
            </button>
          </div>
        </header>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-sm">
            <thead className="bg-surface-muted text-left text-[11px] uppercase tracking-wide text-muted"><tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">N.° carta fianza <ColumnFilter label="número de carta" value={columnFilters.guaranteeNumber} onChange={(value) => updateColumnFilter("guaranteeNumber", value)} /></th>
              <th className="px-4 py-3">Entidad <ColumnFilter label="entidad" value={columnFilters.entity} onChange={(value) => updateColumnFilter("entity", value)} /></th>
              <th className="px-4 py-3">Obra referencial <ColumnFilter label="obra" value={columnFilters.projectName} onChange={(value) => updateColumnFilter("projectName", value)} /></th>
              <th className="px-4 py-3">Concepto / detalle <ColumnFilter label="concepto" value={columnFilters.reason} onChange={(value) => updateColumnFilter("reason", value)} /></th>
              <th className="px-4 py-3">Estado <ColumnFilter label="estado" value={columnFilters.status} onChange={(value) => updateColumnFilter("status", value)} options={statuses} multiple /></th>
              <th className="px-4 py-3">Valor carta</th><th className="px-4 py-3">Vencimiento</th><th className="px-4 py-3">Días restantes</th>
            </tr></thead>
            <tbody className="divide-y divide-border">
              {paginatedGuarantees.map((guarantee, index) => <tr key={guarantee.id} className={isActiveGuarantee(guarantee) ? "bg-emerald-50/50" : "hover:bg-surface-muted"}><td className="px-4 py-3 text-muted">{String((currentPage - 1) * pageSize + index + 1).padStart(2, "0")}</td><td className="px-4 py-3 font-semibold">{guarantee.guaranteeNumber}</td><td className="px-4 py-3 font-semibold">{guarantee.entityName}</td><td className="px-4 py-3 font-semibold">{guarantee.projectName}</td><td className="px-4 py-3 text-muted">{guarantee.guaranteeReason}</td><td className="px-4 py-3"><span className="rounded-full bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary">{guarantee.status}</span></td><td className="whitespace-nowrap px-4 py-3 font-semibold">S/ {guarantee.guaranteeValue.toLocaleString("es-PE")}</td><td className="whitespace-nowrap px-4 py-3 text-muted">{guarantee.expiresAt}</td><td className="px-4 py-3 text-muted">{guarantee.renewalDays} días</td></tr>)}
              {filteredGuarantees.length === 0 && <tr><td colSpan={9} className="px-4 py-8 text-center text-muted">No hay cartas para los filtros seleccionados.</td></tr>}
            </tbody>
          </table>
        </div>
        <footer className="flex flex-col gap-3 border-t border-border px-5 py-3 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>Mostrando {orderedGuarantees.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, orderedGuarantees.length)} de {orderedGuarantees.length} cartas</span>
          <div className="flex items-center gap-2">
            <label htmlFor="dashboard-page-size" className="whitespace-nowrap text-xs">Filas por página:</label>
            <select
              id="dashboard-page-size"
              value={pageSize}
              onChange={(event) => { setPageSize(Number(event.target.value)); setTablePage(1); }}
              className="rounded-lg border border-border bg-surface px-2 py-1.5 text-xs text-foreground outline-none focus:border-primary"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
            </select>
            <button type="button" onClick={() => setTablePage((page) => Math.max(1, page - 1))} disabled={currentPage === 1} className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-40">Anterior</button>
            <span className="text-xs">Página {currentPage} de {totalPages}</span>
            <button type="button" onClick={() => setTablePage((page) => Math.min(totalPages, page + 1))} disabled={currentPage === totalPages} className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-40">Siguiente</button>
          </div>
        </footer>
      </section>
    </div>
  );
}

function KpiCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <div className="rounded-xl border border-border bg-surface px-4 py-4"><p className="text-sm text-muted">{label}</p><p className="mt-2 text-2xl font-bold text-primary">{value}</p><p className="mt-1 text-xs text-muted">{detail}</p></div>;
}
