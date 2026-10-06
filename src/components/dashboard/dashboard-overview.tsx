"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Guarantee } from "@/types/guarantee";
import { ColumnFilter } from "@/components/column-filter";

type DashboardOverviewProps = { guarantees: Guarantee[] };

type DashboardColumnFilters = {
  guaranteeNumber: string;
  entity: string;
  projectName: string;
  reason: string;
  status: string;
};

const initialColumnFilters: DashboardColumnFilters = {
  guaranteeNumber: "",
  entity: "",
  projectName: "",
  reason: "",
  status: "",
};

const questionOptions = [
  { value: "all", label: "Todas las cartas" },
  { value: "convenio", label: "Firma de convenio" },
  { value: "adenda", label: "Firma de adenda" },
  { value: "por-vencer", label: "Cartas próximas a renovar" },
  { value: "encaje-pendiente", label: "¿Cuánto encaje pendiente hay?" },
];

const inputClassName = "rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-primary";

function matchesQuestion(guarantee: Guarantee, question: string) {
  if (question === "all") return true;
  if (question === "por-vencer") return isNearExpiry(guarantee);
  if (question === "encaje-pendiente") return guarantee.projectStage === "Liquidación" && guarantee.status === "Devuelto";

  return [guarantee.guaranteeReason, guarantee.requestStatus, guarantee.observations]
    .join(" ").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(question);
}

function isActive(guarantee: Guarantee) {
  return guarantee.status === "Activa";
}

function isNearExpiry(guarantee: Guarantee) {
  return isActive(guarantee) && guarantee.renewalDays <= 60;
}

function matchesMultiFilter(value: string, filter: string) {
  if (!filter) return true;
  return filter.split("|").includes(value);
}

export function DashboardOverview({ guarantees }: DashboardOverviewProps) {
  const [search, setSearch] = useState("");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedInsurer, setSelectedInsurer] = useState("all");
  const [selectedQuestion, setSelectedQuestion] = useState("all");
  const [columnFilters, setColumnFilters] = useState<DashboardColumnFilters>(initialColumnFilters);

  const insurers = useMemo(() => [...new Set(guarantees.map((guarantee) => guarantee.insurerName))], [guarantees]);
  const years = useMemo(() => [...new Set(guarantees.map((guarantee) => guarantee.expiresAt.slice(0, 4)))], [guarantees]);
  const statuses = useMemo(() => [...new Set(guarantees.map((guarantee) => guarantee.status))], [guarantees]);

  const filteredGuarantees = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();

    return guarantees.filter((guarantee) => {
      const matchesSearch = [guarantee.guaranteeNumber, guarantee.entityName, guarantee.projectName, guarantee.guaranteeReason]
        .some((value) => value.toLowerCase().includes(normalizedSearch));

      return matchesSearch &&
        (selectedYear === "all" || guarantee.expiresAt.startsWith(selectedYear)) &&
        (selectedInsurer === "all" || guarantee.insurerName === selectedInsurer) &&
        matchesQuestion(guarantee, selectedQuestion) &&
        guarantee.guaranteeNumber.toLowerCase().includes(columnFilters.guaranteeNumber.toLowerCase()) &&
        guarantee.entityName.toLowerCase().includes(columnFilters.entity.toLowerCase()) &&
        guarantee.projectName.toLowerCase().includes(columnFilters.projectName.toLowerCase()) &&
        guarantee.guaranteeReason.toLowerCase().includes(columnFilters.reason.toLowerCase()) &&
        matchesMultiFilter(guarantee.status, columnFilters.status);
    });
  }, [guarantees, search, selectedYear, selectedInsurer, selectedQuestion, columnFilters]);

  const updateColumnFilter = (field: keyof DashboardColumnFilters, value: string) => {
    setColumnFilters((currentFilters) => ({ ...currentFilters, [field]: value }));
  };

  const clearAllFilters = () => {
    setSearch("");
    setSelectedYear("all");
    setSelectedInsurer("all");
    setSelectedQuestion("all");
    setColumnFilters(initialColumnFilters);
  };

  const hasActiveFilters = search || selectedYear !== "all" || selectedInsurer !== "all" || selectedQuestion !== "all" || Object.values(columnFilters).some(Boolean);

  const insurerSummary = useMemo(() => {
    return insurers.map((insurer) => ({
      insurer,
      count: filteredGuarantees.filter((guarantee) => guarantee.insurerName === insurer).length,
    })).filter((item) => item.count > 0).sort((a, b) => b.count - a.count);
  }, [filteredGuarantees, insurers]);

  const expiringGuarantees = filteredGuarantees.filter(isNearExpiry).sort((a, b) => a.renewalDays - b.renewalDays).slice(0, 5);
  const orderedGuarantees = selectedQuestion === "por-vencer"
    ? [...filteredGuarantees].sort((a, b) => a.renewalDays - b.renewalDays)
    : filteredGuarantees;
  const totalValue = filteredGuarantees.reduce((total, guarantee) => total + guarantee.guaranteeValue, 0);
  const activeCount = filteredGuarantees.filter(isActive).length;
  const expiringCount = filteredGuarantees.filter(isNearExpiry).length;
  const collateralValue = filteredGuarantees.reduce((total, guarantee) => total + guarantee.collateral, 0);
  const summaryAmount = selectedQuestion === "encaje-pendiente" ? collateralValue : totalValue;
  const summaryLabel = selectedQuestion === "encaje-pendiente" ? "Encaje pendiente" : "Encaje registrado";
  const maxInsurerCount = Math.max(1, ...insurerSummary.map((item) => item.count));

  return (
    <div className="mt-6 space-y-5">
      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Cartas registradas" value={String(filteredGuarantees.length)} detail="Resultado actual" />
        <KpiCard label="Cartas activas" value={String(activeCount)} detail="Vigentes o en renovación" />
        <KpiCard label="Próximas a renovar" value={String(expiringCount)} detail="Requieren seguimiento" />
        <KpiCard label={summaryLabel} value={`S/ ${summaryAmount.toLocaleString("es-PE")}`} detail={selectedQuestion === "encaje-pendiente" ? "Pendiente de recuperación" : `Valor CF: S/ ${totalValue.toLocaleString("es-PE")}`} />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_1.35fr]">
        <section className="rounded-xl border border-border bg-surface px-5 py-4">
          <div className="flex items-start justify-between gap-3">
            <div><h2 className="text-base font-bold text-foreground">Cartas por aseguradora</h2><p className="mt-1 text-sm text-muted">Distribución del resultado filtrado</p></div>
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
            <div><h2 className="text-base font-bold text-foreground">Cartas próximas a renovar</h2><p className="mt-1 text-sm text-muted">Cartas activas que requieren seguimiento</p></div>
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
          <p className="mt-1 text-sm text-muted">Vista simplificada con los mismos filtros del módulo completo</p>
          <div className="mt-4 grid gap-4 xl:grid-cols-3">
            <div className="space-y-3 xl:col-span-2">
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar carta, entidad u obra..." className={`${inputClassName} w-full`} />
              <select value={selectedQuestion} onChange={(event) => setSelectedQuestion(event.target.value)} className={`${inputClassName} w-full`}>{questionOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
            </div>
            <div className="space-y-3 xl:col-span-1">
              <select value={selectedYear} onChange={(event) => setSelectedYear(event.target.value)} className={`${inputClassName} w-full`}><option value="all">Todos los años</option>{years.map((year) => <option key={year} value={year}>{year}</option>)}</select>
              <select value={selectedInsurer} onChange={(event) => setSelectedInsurer(event.target.value)} className={`${inputClassName} w-full`}><option value="all">Todas las aseguradoras</option>{insurers.map((insurer) => <option key={insurer} value={insurer}>{insurer}</option>)}</select>
            </div>
          </div>
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={clearAllFilters}
              disabled={!hasActiveFilters}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary-soft disabled:cursor-not-allowed disabled:opacity-40"
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
              {orderedGuarantees.map((guarantee, index) => <tr key={guarantee.id} className={isActive(guarantee) ? "bg-emerald-50/50" : "hover:bg-surface-muted"}><td className="px-4 py-3 text-muted">{String(index + 1).padStart(2, "0")}</td><td className="px-4 py-3 font-semibold">{guarantee.guaranteeNumber}</td><td className="px-4 py-3 font-semibold">{guarantee.entityName}</td><td className="px-4 py-3 font-semibold">{guarantee.projectName}</td><td className="px-4 py-3 text-muted">{guarantee.guaranteeReason}</td><td className="px-4 py-3"><span className="rounded-full bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary">{guarantee.status}</span></td><td className="whitespace-nowrap px-4 py-3 font-semibold">S/ {guarantee.guaranteeValue.toLocaleString("es-PE")}</td><td className="whitespace-nowrap px-4 py-3 text-muted">{guarantee.expiresAt}</td><td className="px-4 py-3 text-muted">{guarantee.renewalDays} días</td></tr>)}
              {filteredGuarantees.length === 0 && <tr><td colSpan={9} className="px-4 py-8 text-center text-muted">No hay cartas para los filtros seleccionados.</td></tr>}
            </tbody>
          </table>
        </div>
        <footer className="border-t border-border px-5 py-3 text-sm text-muted">Mostrando {filteredGuarantees.length} cartas según la consulta actual</footer>
      </section>
    </div>
  );
}

function KpiCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <div className="rounded-xl border border-border bg-surface px-4 py-4"><p className="text-sm text-muted">{label}</p><p className="mt-2 text-2xl font-bold text-primary">{value}</p><p className="mt-1 text-xs text-muted">{detail}</p></div>;
}
