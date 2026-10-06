"use client";

import { useMemo, useState } from "react";
import type { Guarantee } from "@/types/guarantee";
import { GuaranteeEditModal } from "@/components/guarantees/guarantee-edit-modal";
import { ColumnFilter } from "@/components/column-filter";
import { GUARANTEE_STATUSES } from "@/config/business-options";

type GuaranteesExplorerProps = {
  guarantees: Guarantee[];
};

type ColumnFilters = {
  project: string;
  projectName: string;
  insurer: string;
  guaranteeNumber: string;
  reason: string;
  status: string;
  requestStatus: string;
  guaranteeValue: string;
  projectValue: string;
  premium: string;
  premiumPercentage: string;
  collateral: string;
  collateralPercentage: string;
  validFrom: string;
  expiresAt: string;
  renewalDays: string;
  guaranteeGroups: string;
  projectStage: string;
};

const initialColumnFilters: ColumnFilters = {
  project: "",
  projectName: "",
  insurer: "",
  guaranteeNumber: "",
  reason: "",
  status: "",
  requestStatus: "",
  guaranteeValue: "",
  projectValue: "",
  premium: "",
  premiumPercentage: "",
  collateral: "",
  collateralPercentage: "",
  validFrom: "",
  expiresAt: "",
  renewalDays: "",
  guaranteeGroups: "",
  projectStage: "",
};

const questionOptions = [
  { value: "convenio", label: "Cartas para firma de convenio" },
  { value: "adenda", label: "Cartas para firma de adenda" },
  { value: "por-vencer", label: "Cartas próximas a renovar" },
  { value: "encaje-pendiente", label: "¿Cuánto encaje pendiente hay?" },
];

function matchesQuestion(guarantee: Guarantee, question: string) {
  if (question === "all") return true;
  if (question === "por-vencer") {
    return guarantee.status === "Activa" && guarantee.renewalDays <= 60;
  }
  if (question === "encaje-pendiente") {
    return guarantee.projectStage === "Liquidación" && guarantee.status === "Devuelto";
  }

  const searchableText = [
    guarantee.guaranteeReason,
    ...guarantee.guaranteeGroups,
    guarantee.requestStatus,
    guarantee.observations,
  ]
    .join(" ")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  return searchableText.includes(question);
}

function matchesMultiFilter(value: string, filter: string) {
  if (!filter) return true;
  return filter.split("|").includes(value);
}

export function GuaranteesExplorer({
  guarantees,
}: GuaranteesExplorerProps) {
  const [search, setSearch] = useState("");
  const [selectedInsurer, setSelectedInsurer] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedQuery, setSelectedQuery] = useState("all");
  const [columnFilters, setColumnFilters] = useState<ColumnFilters>(initialColumnFilters);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const insurers = [
    ...new Set(guarantees.map((guarantee) => guarantee.insurerName)),
  ];

  const years = [
    ...new Set(
      guarantees.map((guarantee) => guarantee.expiresAt.slice(0, 4)),
    ),
  ];

  const statuses = [...new Set([...GUARANTEE_STATUSES, ...guarantees.map((guarantee) => guarantee.status)])];
  const requestStatuses = [...new Set(guarantees.map((guarantee) => guarantee.requestStatus))];
  const guaranteeGroups = [...new Set(guarantees.flatMap((guarantee) => guarantee.guaranteeGroups))];
  const projectStages = [...new Set(guarantees.map((guarantee) => guarantee.projectStage))];

  const filteredGuarantees = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();

    return guarantees.filter((guarantee) => {
      const matchesSearch =
        guarantee.projectCode.toLowerCase().includes(normalizedSearch) ||
        guarantee.projectName.toLowerCase().includes(normalizedSearch) ||
        guarantee.entityName.toLowerCase().includes(normalizedSearch) ||
        guarantee.insurerName.toLowerCase().includes(normalizedSearch) ||
        guarantee.guaranteeNumber.toLowerCase().includes(normalizedSearch);

      const matchesInsurer =
        selectedInsurer === "all" ||
        guarantee.insurerName === selectedInsurer;

      const matchesYear =
        selectedYear === "all" ||
        guarantee.expiresAt.startsWith(selectedYear);

      const matchesQuery = matchesQuestion(guarantee, selectedQuery);
      const matchesColumnFilters =
        `${guarantee.projectCode} ${guarantee.projectCui}`.toLowerCase().includes(columnFilters.project.toLowerCase()) &&
        guarantee.projectName.toLowerCase().includes(columnFilters.projectName.toLowerCase()) &&
        matchesMultiFilter(guarantee.insurerName, columnFilters.insurer) &&
        guarantee.guaranteeNumber.toLowerCase().includes(columnFilters.guaranteeNumber.toLowerCase()) &&
        guarantee.guaranteeReason.toLowerCase().includes(columnFilters.reason.toLowerCase()) &&
        matchesMultiFilter(guarantee.status, columnFilters.status) &&
        matchesMultiFilter(guarantee.requestStatus, columnFilters.requestStatus) &&
        String(guarantee.guaranteeValue).includes(columnFilters.guaranteeValue) &&
        String(guarantee.projectValue).includes(columnFilters.projectValue) &&
        String(guarantee.premium).includes(columnFilters.premium) &&
        String(guarantee.premiumPercentage).includes(columnFilters.premiumPercentage) &&
        String(guarantee.collateral).includes(columnFilters.collateral) &&
        String(guarantee.collateralPercentage).includes(columnFilters.collateralPercentage) &&
        guarantee.validFrom.includes(columnFilters.validFrom) &&
        guarantee.expiresAt.includes(columnFilters.expiresAt) &&
        String(guarantee.renewalDays).includes(columnFilters.renewalDays) &&
        matchesMultiFilter(guarantee.guaranteeGroups.join("|"), columnFilters.guaranteeGroups) &&
        matchesMultiFilter(guarantee.projectStage, columnFilters.projectStage);

      return (
        matchesSearch &&
        matchesInsurer &&
        matchesYear &&
        matchesQuery &&
        matchesColumnFilters
      );
    });
  }, [
    guarantees,
    search,
    selectedInsurer,
    selectedYear,
    selectedQuery,
    columnFilters,
  ]);

  const updateColumnFilter = (field: keyof ColumnFilters, value: string) => {
    setColumnFilters((currentFilters) => ({ ...currentFilters, [field]: value }));
  };

  const clearAllFilters = () => {
    setSearch("");
    setSelectedYear("all");
    setSelectedInsurer("all");
    setSelectedQuery("all");
    setColumnFilters(initialColumnFilters);
  };

  const hasActiveFilters = search || selectedYear !== "all" || selectedInsurer !== "all" || selectedQuery !== "all" || Object.values(columnFilters).some(Boolean);

  const totalPages = Math.max(1, Math.ceil(filteredGuarantees.length / pageSize));
  const visiblePage = Math.min(currentPage, totalPages);
  const orderedGuarantees = selectedQuery === "por-vencer"
    ? [...filteredGuarantees].sort((a, b) => a.renewalDays - b.renewalDays)
    : filteredGuarantees;
  const paginatedGuarantees = orderedGuarantees.slice(
    (visiblePage - 1) * pageSize,
    visiblePage * pageSize,
  );

  const firstVisibleRow = filteredGuarantees.length === 0
    ? 0
    : (visiblePage - 1) * pageSize + 1;
  const lastVisibleRow = Math.min(visiblePage * pageSize, filteredGuarantees.length);
  const totalFilteredValue = filteredGuarantees.reduce(
    (total, guarantee) => total + guarantee.guaranteeValue,
    0,
  );
  const totalPendingCollateral = filteredGuarantees.reduce(
    (total, guarantee) => total + guarantee.collateral,
    0,
  );
  const summaryAmount = selectedQuery === "encaje-pendiente"
    ? totalPendingCollateral
    : totalFilteredValue;
  const summaryLabel = selectedQuery === "encaje-pendiente"
    ? "Encaje pendiente"
    : "Valor de cartas";


  return (
    <div className="mt-6">

      <section className="rounded-xl border border-border bg-surface-muted px-5 py-4">
        <h2 className="text-sm font-semibold text-foreground">Resumen de resultados</h2>
        <p className="mt-1 text-sm text-muted">Los indicadores se actualizan según los filtros seleccionados.</p>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div className="rounded-lg bg-surface px-4 py-3">
            <p className="text-sm font-medium text-foreground">Registros visibles</p>
            <p className="mt-1 text-2xl font-bold text-primary">{filteredGuarantees.length}</p>
            <p className="mt-1 text-sm text-muted">Cartas que coinciden con la consulta</p>
          </div>
          <div className="rounded-lg bg-surface px-4 py-3">
            <p className="text-sm font-medium text-foreground">{summaryLabel}</p>
            <p className="mt-1 text-2xl font-bold text-primary">
              S/ {summaryAmount.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="mt-1 text-sm text-muted">
              {selectedQuery === "encaje-pendiente" ? "Pendiente de recuperación" : "Suma del resultado filtrado"}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-5 rounded-xl border border-border bg-surface-muted px-5 py-4">
        <h2 className="text-sm font-semibold text-foreground">
          Filtros de búsqueda
        </h2>

        <div className="mt-3 grid gap-4 xl:grid-cols-3">
          <div className="space-y-3 xl:col-span-2">
            <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por proyecto, entidad o carta..." className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary" />
            <div className="flex min-w-0 items-center gap-3">
              <label htmlFor="question-filter" className="shrink-0 text-sm font-semibold text-foreground">Responder pregunta:</label>
              <select id="question-filter" value={selectedQuery} onChange={(event) => setSelectedQuery(event.target.value)} className="min-w-0 flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary">
                <option value="all">Selecciona una consulta para filtrar</option>
                {questionOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </div>
          </div>
          <div className="space-y-3 xl:col-span-1">
            <select value={selectedYear} onChange={(event) => setSelectedYear(event.target.value)} className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"><option value="all">Todos los años</option>{years.map((year) => <option key={year} value={year}>{year}</option>)}</select>
            <select value={selectedInsurer} onChange={(event) => setSelectedInsurer(event.target.value)} className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"><option value="all">Todas las aseguradoras</option>{insurers.map((insurer) => <option key={insurer} value={insurer}>{insurer}</option>)}</select>
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
      </section>

      {

        <section className="mt-5 rounded-xl border border-border bg-surface">
            <section className="overflow-x-auto">
              <table className="min-w-[1600px] divide-y divide-border text-xs leading-5">
                <thead className="bg-surface-muted">
                    <tr>
                        <th className="px-3 py-2 text-left text-[11px] font-medium text-muted uppercase tracking-wider">N°</th>
                        <th className="px-3 py-2 text-left text-[11px] font-medium text-muted uppercase tracking-wider">Código P./Nombre Ref./CUI <ColumnFilter label="proyecto" value={columnFilters.project} onChange={(value) => updateColumnFilter("project", value)} /></th>
                        <th className="px-3 py-2 text-left text-[11px] font-medium text-muted uppercase tracking-wider">Entidad <ColumnFilter label="obra" value={columnFilters.projectName} onChange={(value) => updateColumnFilter("projectName", value)} /></th>
                        <th className="px-3 py-2 text-left text-[11px] font-medium text-muted uppercase tracking-wider">Aseguradora <ColumnFilter label="aseguradora" value={columnFilters.insurer} onChange={(value) => updateColumnFilter("insurer", value)} options={insurers} multiple /></th>
                        <th className="px-3 py-2 text-left text-[11px] font-medium text-muted uppercase tracking-wider">N.° Carta Fianza <ColumnFilter label="número de carta" value={columnFilters.guaranteeNumber} onChange={(value) => updateColumnFilter("guaranteeNumber", value)} /></th>
                        <th className="px-6 py-2 text-left text-[11px] font-medium text-muted uppercase tracking-wider">Motivo Carta <ColumnFilter label="motivo" value={columnFilters.reason} onChange={(value) => updateColumnFilter("reason", value)} /></th>
                        <th className="px-3 py-2 text-left text-[11px] font-medium text-muted uppercase tracking-wider">Valor CF <ColumnFilter label="valor CF" value={columnFilters.guaranteeValue} onChange={(value) => updateColumnFilter("guaranteeValue", value)} /></th>
                        <th className="px-3 py-2 text-left text-[11px] font-medium text-muted uppercase tracking-wider">Valor Proyecto <ColumnFilter label="valor proyecto" value={columnFilters.projectValue} onChange={(value) => updateColumnFilter("projectValue", value)} /></th>
                        <th className="px-3 py-2 text-left text-[11px] font-medium text-muted uppercase tracking-wider">Prima <ColumnFilter label="prima" value={columnFilters.premium} onChange={(value) => updateColumnFilter("premium", value)} /></th>
                        <th className="px-3 py-2 text-left text-[11px] font-medium text-muted uppercase tracking-wider">% Prima <ColumnFilter label="porcentaje de prima" value={columnFilters.premiumPercentage} onChange={(value) => updateColumnFilter("premiumPercentage", value)} /></th>
                        <th className="px-3 py-2 text-left text-[11px] font-medium text-muted uppercase tracking-wider">Encaje <ColumnFilter label="encaje" value={columnFilters.collateral} onChange={(value) => updateColumnFilter("collateral", value)} /></th>
                        <th className="px-3 py-2 text-left text-[11px] font-medium text-muted uppercase tracking-wider">% Encaje <ColumnFilter label="porcentaje de encaje" value={columnFilters.collateralPercentage} onChange={(value) => updateColumnFilter("collateralPercentage", value)} /></th>
                        <th className="px-3 py-2 text-left text-[11px] font-medium text-muted uppercase tracking-wider">Fecha Vigencia <ColumnFilter label="fecha de vigencia" value={columnFilters.validFrom} onChange={(value) => updateColumnFilter("validFrom", value)} /></th>
                        <th className="px-3 py-2 text-left text-[11px] font-medium text-muted uppercase tracking-wider">Fecha Vencimiento <ColumnFilter label="fecha de vencimiento" value={columnFilters.expiresAt} onChange={(value) => updateColumnFilter("expiresAt", value)} /></th>
                        <th className="px-3 py-2 text-left text-[11px] font-medium text-muted uppercase tracking-wider">Días renovar <ColumnFilter label="días para renovar" value={columnFilters.renewalDays} onChange={(value) => updateColumnFilter("renewalDays", value)} /></th>
                        <th className="px-3 py-2 text-left text-[11px] font-medium text-muted uppercase tracking-wider">Estado <ColumnFilter label="estado" value={columnFilters.status} onChange={(value) => updateColumnFilter("status", value)} options={statuses} multiple /></th>
                        <th className="px-3 py-2 text-left text-[11px] font-medium text-muted uppercase tracking-wider">Solicitud <ColumnFilter label="solicitud" value={columnFilters.requestStatus} onChange={(value) => updateColumnFilter("requestStatus", value)} options={requestStatuses} multiple /></th>
                        <th className="px-3 py-2 text-left text-[11px] font-medium text-muted uppercase tracking-wider">Agrupación <ColumnFilter label="agrupación" value={columnFilters.guaranteeGroups} onChange={(value) => updateColumnFilter("guaranteeGroups", value)} options={guaranteeGroups} multiple /></th>
                        <th className="px-3 py-2 text-left text-[11px] font-medium text-muted uppercase tracking-wider">Etapa Proyecto <ColumnFilter label="etapa de proyecto" value={columnFilters.projectStage} onChange={(value) => updateColumnFilter("projectStage", value)} options={projectStages} multiple /></th>
                        <th className="px-3 py-2 text-left text-[11px] font-medium text-muted uppercase tracking-wider">Acciones</th>
                    </tr>
                      </thead>

                      <tbody className="bg-surface divide-y divide-border">
                          {paginatedGuarantees.map((guarantee, index) => (
                      <tr key={guarantee.id} className="hover:bg-surface-muted">
                          <td className="px-3 py-2">{(visiblePage - 1) * pageSize + index + 1}</td>
                          <td className="px-3 py-2 text-xs">
                            <div className="font-semibold text-foreground">{guarantee.projectCode}</div>
                            <div className="text-muted"><em>{guarantee.projectCui}</em></div>
                            <div className="font-semibold text-foreground">{guarantee.projectName}</div>
                          </td>
                          <td className="px-3 py-2 text-xs">
                            <div className="font-semibold">{guarantee.entityName}</div>
                          </td>
                          <td className="px-3 py-2 text-xs">{guarantee.insurerName}</td>
                          <td className="px-3 py-2 text-xs">{guarantee.guaranteeNumber}</td>
                          <td className="px-6 py-2 text-xs">{guarantee.guaranteeReason}</td>
                          <td className="whitespace-nowrap px-3 py-2 text-xs">S/{guarantee.guaranteeValue.toLocaleString("es-PE")}</td>
                          <td className="whitespace-nowrap px-3 py-2 text-xs">S/{guarantee.projectValue.toLocaleString("es-PE")}</td>
                          <td className="whitespace-nowrap px-3 py-2 text-xs">S/{guarantee.premium.toLocaleString("es-PE")}</td>
                          <td className="px-3 py-2 text-xs">{guarantee.premiumPercentage}%</td>
                          <td className="whitespace-nowrap px-3 py-2 text-xs">S/{guarantee.collateral.toLocaleString("es-PE")}</td>
                          <td className="px-3 py-2 text-xs">{guarantee.collateralPercentage}%</td>
                          <td className="whitespace-nowrap px-3 py-2 text-xs">{guarantee.validFrom}</td>
                          <td className="whitespace-nowrap px-3 py-2 text-xs">{guarantee.expiresAt}</td>
                          <td className="px-3 py-2 text-xs">{guarantee.renewalDays}</td>
                          <td className="px-3 py-2 text-xs">{guarantee.status}</td>
                          <td className="px-3 py-2 text-xs">{guarantee.requestStatus}</td>
                          <td className="px-3 py-2 text-xs">{guarantee.guaranteeGroups.join(", ")}</td>
                          <td className="px-3 py-2 text-xs">{guarantee.projectStage}</td>
                          <td className="px-3 py-2 text-xs">
                            <GuaranteeEditModal guarantee={guarantee} />
                          </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </section>
            <footer className="flex flex-col gap-3 border-t border-border px-4 py-3 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
              <p>
                {filteredGuarantees.length === 0
                  ? "No hay registros para mostrar"
                  : `Mostrando ${firstVisibleRow}-${lastVisibleRow} de ${filteredGuarantees.length} registros`}
              </p>

              <div className="flex flex-wrap items-center justify-end gap-3">
                <label htmlFor="page-size" className="whitespace-nowrap">
                  Filas por página:
                </label>
                <select
                  id="page-size"
                  value={pageSize}
                  onChange={(event) => setPageSize(Number(event.target.value))}
                  className="rounded-lg border border-border bg-surface px-2 py-1.5 text-sm text-foreground outline-none focus:border-primary"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                </select>
                <button
                  type="button"
                  disabled={visiblePage === 1}
                  onClick={() => setCurrentPage((page) => Math.max(1, Math.min(page, totalPages) - 1))}
                  className="rounded-lg border border-border px-3 py-1.5 text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Anterior
                </button>
                <span className="whitespace-nowrap text-foreground">
                  Página {visiblePage} de {totalPages}
                </span>
                <button
                  type="button"
                  disabled={visiblePage === totalPages}
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, Math.min(page, totalPages) + 1))}
                  className="rounded-lg border border-border px-3 py-1.5 text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Siguiente
                </button>
              </div>
            </footer>
        </section>
      }
    </div>
  );
}
