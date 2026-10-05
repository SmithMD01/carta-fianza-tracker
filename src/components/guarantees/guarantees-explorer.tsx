"use client";

import { useMemo, useState } from "react";
import type { Guarantee } from "@/types/guarantee";
import { GuaranteeEditModal } from "@/components/guarantees/guarantee-edit-modal";

type GuaranteesExplorerProps = {
  guarantees: Guarantee[];
};

export function GuaranteesExplorer({
  guarantees,
}: GuaranteesExplorerProps) {
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedInsurer, setSelectedInsurer] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedQuery, setSelectedQuery] = useState("all");
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

  const filteredGuarantees = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();

    return guarantees.filter((guarantee) => {
      const matchesSearch =
        guarantee.projectCode.toLowerCase().includes(normalizedSearch) ||
        guarantee.projectName.toLowerCase().includes(normalizedSearch) ||
        guarantee.entityName.toLowerCase().includes(normalizedSearch) ||
        guarantee.insurerName.toLowerCase().includes(normalizedSearch) ||
        guarantee.guaranteeNumber.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        selectedStatus === "all" ||
        guarantee.status === selectedStatus;

      const matchesInsurer =
        selectedInsurer === "all" ||
        guarantee.insurerName === selectedInsurer;

      const matchesYear =
        selectedYear === "all" ||
        guarantee.expiresAt.startsWith(selectedYear);

      const matchesQuery =
        selectedQuery === "all" || guarantee.status === selectedQuery;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesInsurer &&
        matchesYear &&
        matchesQuery
      );
    });
  }, [
    guarantees,
    search,
    selectedStatus,
    selectedInsurer,
    selectedYear,
    selectedQuery,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredGuarantees.length / pageSize));
  const visiblePage = Math.min(currentPage, totalPages);
  const paginatedGuarantees = filteredGuarantees.slice(
    (visiblePage - 1) * pageSize,
    visiblePage * pageSize,
  );

  const firstVisibleRow = filteredGuarantees.length === 0
    ? 0
    : (visiblePage - 1) * pageSize + 1;
  const lastVisibleRow = Math.min(visiblePage * pageSize, filteredGuarantees.length);


  return (
    <div className="mt-6">

      {/* <section className="mt-4 mb-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-surface px-4 py-3">
          <p className="text-xs font-medium uppercase text-muted">
            Registros visibles
          </p>

          <p className="mt-1 text-2xl font-bold text-primary">
            {filteredGuarantees.length}
          </p>
        </div>

        <div className="rounded-lg border border-border bg-surface px-4 py-3">
          <p className="text-xs font-medium uppercase text-muted">
            Valor de cartas
          </p>

          <p className="mt-1 text-2xl font-bold text-primary">
            S/{" "}
            {totalValue.toLocaleString("es-PE", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      </section> */}
      

      <section className="rounded-xl border border-border bg-surface-muted px-5 py-4">
        <h2 className="text-sm font-semibold text-foreground">
          Filtros de búsqueda
        </h2>

        <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por proyecto, entidad o carta..."
            className="min-w-0 rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary md:col-span-2 xl:col-span-2"
          />

          <select
            value={selectedYear}
            onChange={(event) => setSelectedYear(event.target.value)}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
          >
            <option value="all">Todos los años</option>

            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(event) => setSelectedStatus(event.target.value)}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
          >
            <option value="all">Todos los estados</option>
            <option value="Activo">Activo</option>
            <option value="Por vencer">Por vencer</option>
            <option value="Vencido">Vencido</option>
            <option value="Devuelto">Devuelto</option>
          </select>

          <select
            value={selectedInsurer}
            onChange={(event) => setSelectedInsurer(event.target.value)}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
          >
            <option value="all">Todas las aseguradoras</option>

            {insurers.map((insurer) => (
              <option key={insurer} value={insurer}>
                {insurer}
              </option>
            ))}
          </select>

          <div className="flex min-w-0 items-center gap-2 md:col-span-2 xl:col-span-2">
            <label htmlFor="question-filter" className="shrink-0 text-sm font-semibold text-foreground">
              Responder pregunta:
            </label>
            <select
              id="question-filter"
              value={selectedQuery}
              onChange={(event) => setSelectedQuery(event.target.value)}
              className="min-w-0 flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
            >
              <option value="all">Selecciona una consulta para filtrar</option>
              <option value="Activo">Cartas Fianza activas</option>
              <option value="Por vencer">Cartas Fianza por vencer</option>
              <option value="Vencido">Cartas Fianza vencidas</option>
              <option value="Devuelto">Cartas Fianza devueltas</option>
            </select>
          </div>
        </div>
      </section>

      {

        <section className="mt-5 rounded-xl border border-border bg-surface">
            <section className="overflow-x-auto">
              <table className="min-w-[1600px] divide-y divide-border text-xs leading-5">
                <thead className="bg-surface-muted">
                    <tr>
                        <th className="px-3 py-2 text-left text-[11px] font-medium text-muted uppercase tracking-wider">N°</th>
                        <th className="px-3 py-2 text-left text-[11px] font-medium text-muted uppercase tracking-wider">Codigo P. / CUI</th>
                        <th className="px-3 py-2 text-left text-[11px] font-medium text-muted uppercase tracking-wider">Obra / Entidad</th>
                        <th className="px-3 py-2 text-left text-[11px] font-medium text-muted uppercase tracking-wider">Aseguradora</th>
                        <th className="px-3 py-2 text-left text-[11px] font-medium text-muted uppercase tracking-wider">N° Carta Fianza</th>
                        <th className="px-6 py-2 text-left text-[11px] font-medium text-muted uppercase tracking-wider">Motivo Carta</th>
                        <th className="px-3 py-2 text-left text-[11px] font-medium text-muted uppercase tracking-wider">Valor CF</th>
                        <th className="px-3 py-2 text-left text-[11px] font-medium text-muted uppercase tracking-wider">Valor Proyecto</th>
                        <th className="px-3 py-2 text-left text-[11px] font-medium text-muted uppercase tracking-wider">Prima</th>
                        <th className="px-3 py-2 text-left text-[11px] font-medium text-muted uppercase tracking-wider">% Prima</th>
                        <th className="px-3 py-2 text-left text-[11px] font-medium text-muted uppercase tracking-wider">Encaje</th>
                        <th className="px-3 py-2 text-left text-[11px] font-medium text-muted uppercase tracking-wider">% Encaje</th>
                        <th className="px-3 py-2 text-left text-[11px] font-medium text-muted uppercase tracking-wider">Fecha Vigencia</th>
                        <th className="px-3 py-2 text-left text-[11px] font-medium text-muted uppercase tracking-wider">Fecha Vencimiento</th>
                        <th className="px-3 py-2 text-left text-[11px] font-medium text-muted uppercase tracking-wider">Dias Renovar</th>
                        <th className="px-3 py-2 text-left text-[11px] font-medium text-muted uppercase tracking-wider">Estado</th>
                        <th className="px-3 py-2 text-left text-[11px] font-medium text-muted uppercase tracking-wider">Solicitud</th>
                        <th className="px-3 py-2 text-left text-[11px] font-medium text-muted uppercase tracking-wider">Etapa CF</th>
                        <th className="px-3 py-2 text-left text-[11px] font-medium text-muted uppercase tracking-wider">Etapa Proyecto</th>
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
                          </td>
                          <td className="px-3 py-2 text-xs">
                            <div className="font-semibold text-foreground">{guarantee.projectName}</div>
                            <div className="text-muted"><em>{guarantee.entityName}</em></div> 
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
                          <td className="px-3 py-2 text-xs">{guarantee.guaranteeStage}</td>
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
