"use client";

import { useMemo, useState } from "react";
import type { Guarantee } from "@/types/guarantee";

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

      return (
        matchesSearch &&
        matchesStatus &&
        matchesInsurer &&
        matchesYear
      );
    });
  }, [
    guarantees,
    search,
    selectedStatus,
    selectedInsurer,
    selectedYear,
  ]);


  return (
    <div className="mt-8">

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

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por proyecto, entidad o carta..."
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
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
        </div>
      </section>

      {

        <section className="mt-8 overflow-x-auto rounded-xl border border-border bg-surface">
          <section className="mt-4 mb-4 ml-4 mr-4 flex rounded-xl border border-border bg-surface-muted px-5 py-4">
              <h2 className="text-sm font-semibold text-foreground">Responder Pregunta: </h2>
              
              <select
                value={selectedStatus}
                onChange={(event) => setSelectedStatus(event.target.value)}
                className="rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
              >
                <option value="all">Selecciona una consulta para filtrar</option>
                <option value="Activo">Cartas Fianza por Renovar</option>
                <option value="Por vencer">Cartas Fianza por Vencer</option>
                <option value="Vencido">Cartas Fianza Vencidas</option>
                <option value="Devuelto">Cartas Fianza Devueltas</option>
              </select>

              </section>
                <table className="min-w-[1600px] divide-y divide-border text-xs leading-5">
                  <thead className="bg-surface-muted">
                      <tr>
                          <th className="px-3 py-2 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">Nro</th>
                          <th className="px-3 py-2 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">Codigo Proyecto</th>
                          <th className="px-3 py-2 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">Obra Referencia</th>
                          <th className="px-3 py-2 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">Entidad</th>
                          <th className="px-3 py-2 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">Aseguradora</th>
                          <th className="px-3 py-2 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">N° Carta Fianza</th>
                          <th className="px-3 py-2 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">Motivo Carta</th>
                          <th className="px-3 py-2 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">Valor CF</th>
                          <th className="px-3 py-2 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">Valor Proyecto</th>
                          <th className="px-3 py-2 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">Prima</th>
                          <th className="px-3 py-2 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">% Prima</th>
                          <th className="px-3 py-2 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">Encaje</th>
                          <th className="px-3 py-2 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">% Encaje</th>
                          <th className="px-3 py-2 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">Fecha Vigencia</th>
                          <th className="px-3 py-2 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">Fecha Vencimiento</th>
                          <th className="px-3 py-2 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">Dias Renovar</th>
                          <th className="px-3 py-2 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                          <th className="px-3 py-2 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">Solicitud</th>
                          <th className="px-3 py-2 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">Etapa CF</th>
                          <th className="px-3 py-2 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">Etapa Proyecto</th>
                      </tr>
                        </thead>

                        <tbody className="bg-surface divide-y divide-border">
                            {filteredGuarantees.map((guarantee, index) => (
                        <tr key={guarantee.id} className="hover:bg-surface-muted">
                            <td className="px-3 py-2">{index + 1}</td>
                            <td className="px-3 py-2 text-xs">{guarantee.projectCode}</td>
                            <td className="px-3 py-2 text-xs">{guarantee.projectName}</td>
                            <td className="px-3 py-2 text-xs">{guarantee.entityName}</td>
                            <td className="px-3 py-2 text-xs">{guarantee.insurerName}</td>
                            <td className="px-3 py-2 text-xs">{guarantee.guaranteeNumber}</td>
                            <td className="px-3 py-2 text-xs">{guarantee.guaranteeReason}</td>
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
                        </tr>
                      ))}
                  </tbody>
                </table>
          </section>

      }
    </div>
  );
}
