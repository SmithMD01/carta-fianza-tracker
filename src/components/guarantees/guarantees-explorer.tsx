"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import type { Guarantee } from "@/types/guarantee";
import { GuaranteeEditModal } from "@/components/guarantees/guarantee-edit-modal";
import { ColumnFilter } from "@/components/column-filter";
import { GUARANTEE_STATUSES } from "@/config/business-options";

type GuaranteesExplorerProps = {
  guarantees: Guarantee[];
};

type GuaranteeColumnKey =
  | "projectSummary"
  | "entityName"
  | "insurerName"
  | "guaranteeNumber"
  | "guaranteeReason"
  | "guaranteeValue"
  | "componentValue"
  | "premium"
  | "collateral"
  | "collateralPercentage"
  | "validFrom"
  | "expiresAt"
  | "renewalDays"
  | "status"
  | "requestingArea"
  | "projectStage"
  | "vof"
  | "carPolicy"
  | "consortiumWith"
  | "wonWith";

const ALL_GUARANTEE_COLUMNS: GuaranteeColumnKey[] = [
  "projectSummary", "entityName", "insurerName",
  "guaranteeNumber", "guaranteeReason", "guaranteeValue", "componentValue",
  "premium", "collateral", "collateralPercentage", "validFrom", "expiresAt",
  "renewalDays", "status", "requestingArea", "projectStage", "vof", "carPolicy",
  "consortiumWith", "wonWith",
];

const GUARANTEE_COLUMN_LABELS: Record<GuaranteeColumnKey, string> = {
  projectSummary: "Código / obra / CUI",
  entityName: "Entidad",
  insurerName: "Entidad financiera",
  guaranteeNumber: "N.° carta fianza",
  guaranteeReason: "Motivo de la carta",
  guaranteeValue: "Valor CF",
  componentValue: "Valor componente",
  premium: "Monto prima",
  collateral: "Monto encaje",
  collateralPercentage: "% encaje",
  validFrom: "Fecha inicio",
  expiresAt: "Fecha vencimiento",
  renewalDays: "Días restantes",
  status: "Estado CF",
  requestingArea: "Solicitado por área",
  projectStage: "Etapa proyecto",
  vof: "VOF",
  carPolicy: "Póliza CAR",
  consortiumWith: "Consorciado con",
  wonWith: "Ganado con",
};

const COLUMN_PREFERENCE_KEY = "carta-fianza-table-columns";
const columnPreferenceListeners = new Set<() => void>();

function subscribeToColumnPreference(listener: () => void) {
  columnPreferenceListeners.add(listener);
  return () => columnPreferenceListeners.delete(listener);
}

function getColumnPreferenceSnapshot() {
  return typeof window === "undefined" ? null : window.localStorage.getItem(COLUMN_PREFERENCE_KEY);
}

function getServerColumnPreferenceSnapshot() {
  return null;
}

function parseSavedColumns(snapshot: string | null): GuaranteeColumnKey[] {
  if (!snapshot) return ALL_GUARANTEE_COLUMNS;
  try {
    const parsed = JSON.parse(snapshot) as GuaranteeColumnKey[];
    return ALL_GUARANTEE_COLUMNS.filter((column) => parsed.includes(column));
  } catch {
    return ALL_GUARANTEE_COLUMNS;
  }
}

function readSavedColumns(): GuaranteeColumnKey[] {
  if (typeof window === "undefined") return ALL_GUARANTEE_COLUMNS;
  return parseSavedColumns(window.localStorage.getItem(COLUMN_PREFERENCE_KEY));
}

type ColumnFilters = {
  project: string;
  projectName: string;
  insurer: string;
  guaranteeNumber: string;
  reason: string;
  status: string;
  guaranteeValue: string;
  projectValue: string;
  premium: string;
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
  guaranteeValue: "",
  projectValue: "",
  premium: "",
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
    return guarantee.status === "Activa" && guarantee.renewalDays >= 0 && guarantee.renewalDays <= 60;
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

function getRemainingDays(guarantee: Guarantee) {
  if (guarantee.status !== "Solicitud") return guarantee.renewalDays;

  const startDate = new Date(`${guarantee.validFrom}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function getGuaranteeColumnValue(guarantee: Guarantee, column: GuaranteeColumnKey) {
  switch (column) {
    case "guaranteeValue":
      return `S/ ${guarantee.guaranteeValue.toLocaleString("es-PE")}`;
    case "componentValue":
      return `S/ ${guarantee.componentValue.toLocaleString("es-PE")}`;
    case "premium":
      return `S/ ${guarantee.premium.toLocaleString("es-PE")}`;
    case "collateral":
      return `S/ ${guarantee.collateral.toLocaleString("es-PE")}`;
    case "collateralPercentage":
      return `${guarantee.collateralPercentage}%`;
    case "renewalDays":
      return `${getRemainingDays(guarantee)} días`;
    case "projectSummary":
      return `${guarantee.projectCode}\n${guarantee.projectName}\n ${guarantee.projectCui}`;
    case "entityName":
      return guarantee.entityName;
    case "insurerName":
      return guarantee.insurerName;
    case "guaranteeNumber":
      return guarantee.guaranteeNumber;
    case "guaranteeReason":
      return guarantee.guaranteeReason;
    case "validFrom":
      return guarantee.validFrom;
    case "expiresAt":
      return guarantee.expiresAt;
    case "status":
      return guarantee.status;
    case "requestingArea":
      return guarantee.requestingArea;
    case "projectStage":
      return guarantee.projectStage;
    case "vof":
      return guarantee.vof;
    case "carPolicy":
      return guarantee.carPolicy;
    case "consortiumWith":
      return guarantee.consortiumWith;
    case "wonWith":
      return guarantee.wonWith;
  }
}

export function GuaranteesExplorer({
  guarantees,
}: GuaranteesExplorerProps) {
  const [search, setSearch] = useState("");
  const [selectedInsurer, setSelectedInsurer] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedQuery, setSelectedQuery] = useState("all");
  const [columnFilters, setColumnFilters] = useState<ColumnFilters>(initialColumnFilters);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const savedColumnSnapshot = useSyncExternalStore(
    subscribeToColumnPreference,
    getColumnPreferenceSnapshot,
    getServerColumnPreferenceSnapshot,
  );
  const [visibleColumns, setVisibleColumns] = useState<GuaranteeColumnKey[]>(ALL_GUARANTEE_COLUMNS);
  const [isColumnSettingsOpen, setIsColumnSettingsOpen] = useState(false);
  const [columnViewModeOverride, setColumnViewModeOverride] = useState<"full" | "preference" | null>(null);
  const columnViewMode = columnViewModeOverride ?? (savedColumnSnapshot ? "preference" : "full");

  const insurers = [
    ...new Set(guarantees.map((guarantee) => guarantee.insurerName)),
  ];

  const statuses = [...new Set([...GUARANTEE_STATUSES, ...guarantees.map((guarantee) => guarantee.status)])];
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

      const matchesStatus =
        selectedStatus === "all" ||
        guarantee.status === selectedStatus;

      const matchesQuery = matchesQuestion(guarantee, selectedQuery);
      const matchesColumnFilters =
        `${guarantee.projectCode} ${guarantee.projectCui}`.toLowerCase().includes(columnFilters.project.toLowerCase()) &&
        guarantee.projectName.toLowerCase().includes(columnFilters.projectName.toLowerCase()) &&
        matchesMultiFilter(guarantee.insurerName, columnFilters.insurer) &&
        guarantee.guaranteeNumber.toLowerCase().includes(columnFilters.guaranteeNumber.toLowerCase()) &&
        guarantee.guaranteeReason.toLowerCase().includes(columnFilters.reason.toLowerCase()) &&
        matchesMultiFilter(guarantee.status, columnFilters.status) &&
        String(guarantee.guaranteeValue).includes(columnFilters.guaranteeValue) &&
        String(guarantee.projectValue).includes(columnFilters.projectValue) &&
        String(guarantee.premium).includes(columnFilters.premium) &&
        String(guarantee.collateral).includes(columnFilters.collateral) &&
        String(guarantee.collateralPercentage).includes(columnFilters.collateralPercentage) &&
        guarantee.validFrom.includes(columnFilters.validFrom) &&
        guarantee.expiresAt.includes(columnFilters.expiresAt) &&
        String(getRemainingDays(guarantee)).includes(columnFilters.renewalDays) &&
        (!columnFilters.guaranteeGroups || columnFilters.guaranteeGroups.split("|").some((group) => guarantee.guaranteeGroups.includes(group))) &&
        matchesMultiFilter(guarantee.projectStage, columnFilters.projectStage);

      return (
        matchesSearch &&
        matchesInsurer &&
        matchesStatus &&
        matchesQuery &&
        matchesColumnFilters
      );
    });
  }, [
    guarantees,
    search,
    selectedInsurer,
    selectedStatus,
    selectedQuery,
    columnFilters,
  ]);

  const updateColumnFilter = (field: keyof ColumnFilters, value: string) => {
    setCurrentPage(1);
    setColumnFilters((currentFilters) => ({ ...currentFilters, [field]: value }));
  };

  const renderColumnFilter = (column: GuaranteeColumnKey) => {
    switch (column) {
      case "projectSummary":
        return <ColumnFilter label="proyecto" value={columnFilters.project} onChange={(value) => updateColumnFilter("project", value)} />;
      case "insurerName":
        return <ColumnFilter label="aseguradora" value={columnFilters.insurer} onChange={(value) => updateColumnFilter("insurer", value)} options={insurers} multiple />;
      case "guaranteeNumber":
        return <ColumnFilter label="número de carta" value={columnFilters.guaranteeNumber} onChange={(value) => updateColumnFilter("guaranteeNumber", value)} />;
      case "guaranteeReason":
        return <ColumnFilter label="motivo" value={columnFilters.reason} onChange={(value) => updateColumnFilter("reason", value)} />;
      case "guaranteeValue":
        return <ColumnFilter label="valor CF" value={columnFilters.guaranteeValue} onChange={(value) => updateColumnFilter("guaranteeValue", value)} />;
      case "premium":
        return <ColumnFilter label="prima" value={columnFilters.premium} onChange={(value) => updateColumnFilter("premium", value)} />;
      case "collateral":
        return <ColumnFilter label="encaje" value={columnFilters.collateral} onChange={(value) => updateColumnFilter("collateral", value)} />;
      case "collateralPercentage":
        return <ColumnFilter label="porcentaje de encaje" value={columnFilters.collateralPercentage} onChange={(value) => updateColumnFilter("collateralPercentage", value)} />;
      case "validFrom":
        return <ColumnFilter label="fecha de inicio" value={columnFilters.validFrom} onChange={(value) => updateColumnFilter("validFrom", value)} />;
      case "expiresAt":
        return <ColumnFilter label="fecha de vencimiento" value={columnFilters.expiresAt} onChange={(value) => updateColumnFilter("expiresAt", value)} />;
      case "renewalDays":
        return <ColumnFilter label="días restantes" value={columnFilters.renewalDays} onChange={(value) => updateColumnFilter("renewalDays", value)} />;
      case "status":
        return <ColumnFilter label="estado" value={columnFilters.status} onChange={(value) => updateColumnFilter("status", value)} options={statuses} multiple />;
      case "projectStage":
        return <ColumnFilter label="etapa de proyecto" value={columnFilters.projectStage} onChange={(value) => updateColumnFilter("projectStage", value)} options={projectStages} multiple />;
      default:
        return null;
    }
  };

  const clearAllFilters = () => {
    setSearch("");
    setSelectedStatus("all");
    setSelectedInsurer("all");
    setSelectedQuery("all");
    setColumnFilters(initialColumnFilters);
  };

  const hasActiveFilters = search || selectedStatus !== "all" || selectedInsurer !== "all" || selectedQuery !== "all" || Object.values(columnFilters).some(Boolean);

  const toggleColumn = (column: GuaranteeColumnKey) => {
    const currentColumns = activeColumns;
    if (currentColumns.includes(column)) {
      setVisibleColumns(currentColumns.length === 1 ? currentColumns : currentColumns.filter((item) => item !== column));
    } else {
      setVisibleColumns(ALL_GUARANTEE_COLUMNS.filter((item) => currentColumns.includes(item) || item === column));
    }
  };

  const saveColumnPreference = () => {
    const columnsToSave = columnViewMode === "preference" && visibleColumns.length === ALL_GUARANTEE_COLUMNS.length
      ? activeColumns
      : visibleColumns;
    window.localStorage.setItem(COLUMN_PREFERENCE_KEY, JSON.stringify(columnsToSave));
    columnPreferenceListeners.forEach((listener) => listener());
    setColumnViewModeOverride("preference");
    setIsColumnSettingsOpen(false);
  };

  const showFullTable = () => {
    setVisibleColumns(ALL_GUARANTEE_COLUMNS);
    setColumnViewModeOverride("full");
    setIsColumnSettingsOpen(false);
  };

  const useSavedPreference = () => {
    setVisibleColumns(readSavedColumns());
    setColumnViewModeOverride("preference");
    setIsColumnSettingsOpen(false);
  };

  const columnModeButtonClass = "rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors";

  const totalPages = Math.max(1, Math.ceil(filteredGuarantees.length / pageSize));
  const visiblePage = Math.min(currentPage, totalPages);
  const orderedGuarantees = selectedQuery === "por-vencer"
    ? [...filteredGuarantees].sort((a, b) => a.renewalDays - b.renewalDays)
    : filteredGuarantees;
  const paginatedGuarantees = orderedGuarantees.slice(
    (visiblePage - 1) * pageSize,
    visiblePage * pageSize,
  );
  const activeColumns = columnViewMode === "preference"
    ? parseSavedColumns(savedColumnSnapshot)
    : visibleColumns;

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

        <div className="mt-3 grid gap-3 xl:grid-cols-12">
          <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por proyecto, entidad o carta..." className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs outline-none focus:border-primary xl:col-span-6" />
          <select value={selectedStatus} onChange={(event) => { setSelectedStatus(event.target.value); setCurrentPage(1); }} className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs outline-none focus:border-primary xl:col-span-3"><option value="all">Todos los estados</option>{statuses.map((status) => <option key={status} value={status}>{status}</option>)}</select>
          <div className="xl:col-span-3">
            <ColumnFilter label="agrupación" value={columnFilters.guaranteeGroups} onChange={(value) => updateColumnFilter("guaranteeGroups", value)} options={guaranteeGroups} multiple appearance="select" />
          </div>
          <div className="flex min-w-0 items-center gap-3 xl:col-span-6">
            <label htmlFor="question-filter" className="shrink-0 text-xs font-semibold text-foreground">Responder pregunta:</label>
            <select id="question-filter" value={selectedQuery} onChange={(event) => setSelectedQuery(event.target.value)} className="min-w-0 flex-1 rounded-lg border border-primary bg-primary-soft px-3 py-2 text-xs font-semibold text-primary outline-none focus:ring-2 focus:ring-primary/20">
              <option value="all">Selecciona una consulta para filtrar</option>
              {questionOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </div>
          <select value={selectedInsurer} onChange={(event) => setSelectedInsurer(event.target.value)} className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs outline-none focus:border-primary xl:col-span-3"><option value="all">Todas las aseguradoras</option>{insurers.map((insurer) => <option key={insurer} value={insurer}>{insurer}</option>)}</select>
          <button
            type="button"
            onClick={clearAllFilters}
            disabled={!hasActiveFilters}
            className="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:border-border disabled:bg-surface disabled:text-muted xl:col-span-3"
          >
            Limpiar filtros
          </button>
        </div>
      </section>

      <section className="mt-5 rounded-xl border border-border bg-surface px-5 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-foreground">Columnas visibles</p>
            <p className="text-xs text-muted">Personaliza la tabla y guarda tu preferencia local.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setIsColumnSettingsOpen((open) => !open)} className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary-soft">
              {isColumnSettingsOpen ? "Cerrar columnas" : "Configurar columnas"}
            </button>
            <button type="button" onClick={showFullTable} className={`${columnModeButtonClass} ${columnViewMode === "full" ? "border-primary bg-primary-soft text-primary" : "border-border text-foreground hover:bg-surface-muted"}`}>
              Ver tabla completa
            </button>
            <button type="button" onClick={useSavedPreference} className={`${columnModeButtonClass} ${columnViewMode === "preference" ? "border-primary bg-primary-soft text-primary" : "border-border text-foreground hover:bg-surface-muted"}`}>
              Usar mi preferencia
            </button>
          </div>
        </div>
        {isColumnSettingsOpen && (
          <div className="mt-3 rounded-lg border border-border bg-surface-muted p-3">
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {ALL_GUARANTEE_COLUMNS.map((column) => (
                <label key={column} className="flex items-center gap-2 text-xs text-foreground">
                  <input type="checkbox" checked={activeColumns.includes(column)} onChange={() => toggleColumn(column)} />
                  {GUARANTEE_COLUMN_LABELS[column]}
                </label>
              ))}
            </div>
            <div className="mt-3 flex justify-end">
              <button type="button" onClick={saveColumnPreference} className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-dark">
                Guardar preferencia
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="mt-5 rounded-xl border border-border bg-surface">
            <section className="overflow-x-auto">
              <table className="min-w-[1600px] divide-y divide-border text-xs leading-5">
                <thead className="bg-surface-muted">
                  <tr>
                    <th className="px-3 py-2 text-left text-[11px] font-medium uppercase tracking-wider text-muted">N°</th>
                    {activeColumns.map((column) => <th key={column} className="px-3 py-2 text-left text-[11px] font-medium uppercase tracking-wider text-muted">{GUARANTEE_COLUMN_LABELS[column]} {renderColumnFilter(column)}</th>)}
                    <th className="px-3 py-2 text-left text-[11px] font-medium uppercase tracking-wider text-muted">Acciones</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border bg-surface">
                  {paginatedGuarantees.map((guarantee, index) => (
                    <tr key={guarantee.id} className="hover:bg-surface-muted">
                      <td className="px-3 py-2">{(visiblePage - 1) * pageSize + index + 1}</td>
                      {activeColumns.map((column) => (
                        <td key={column} className={`px-3 py-2 text-xs ${column === "projectSummary" ? "min-w-[300px]" : "whitespace-nowrap"}`}>
                          {column === "projectSummary" ? (
                            <div className="space-y-0.5">
                              <div className="font-semibold text-foreground">{guarantee.projectCode}</div>
                              <div className="font-semibold text-muted">{guarantee.projectName}</div>
                              <div className="text-muted"><em>CUI {guarantee.projectCui}</em></div>
                            </div>
                          ) : getGuaranteeColumnValue(guarantee, column)}
                        </td>
                      ))}
                      <td className="px-3 py-2 text-xs"><GuaranteeEditModal guarantee={guarantee} /></td>
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
    </div>
  );
}
