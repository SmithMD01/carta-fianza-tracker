"use client";

import { useState } from "react";
import type { Guarantee } from "@/types/guarantee";
import { rowActionItemClassName } from "@/components/row-actions-menu";
import {createPortal} from "react-dom";

type GuaranteeDetailModalProps = {
  guarantee: Guarantee;
};

function DetailItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-border bg-surface-muted px-3 py-2">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 text-sm font-semibold text-foreground">{value || "—"}</p>
    </div>
  );
}

export function GuaranteeDetailModal({ guarantee }: GuaranteeDetailModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={rowActionItemClassName}
      >
        Ver detalle
      </button>

      {isOpen && (
        typeof document !== "undefined" &&
        createPortal(
          <div   data-row-action-modal className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/40 p-4">
            <div role="dialog" aria-modal="true" aria-labelledby={`detail-guarantee-${guarantee.id}`} className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-surface shadow-2xl">
              <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-surface px-6 py-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">Detalle de carta fianza</p>
                  <h2 id={`detail-guarantee-${guarantee.id}`} className="mt-1 text-xl font-bold text-foreground">{guarantee.guaranteeNumber}</h2>
                  <p className="mt-1 text-sm text-muted">Información completa de la carta y su proyecto asociado.</p>
                </div>
                <button type="button" onClick={() => setIsOpen(false)} className="rounded-lg px-3 py-2 text-xl text-muted hover:bg-surface-muted" aria-label="Cerrar detalle">×</button>
              </header>

              <div className="space-y-6 p-6">
                <section>
                  <h3 className="mb-3 text-sm font-semibold text-primary">Proyecto asociado</h3>
                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    <DetailItem label="Código de proyecto" value={guarantee.projectCode} />
                    <DetailItem label="CUI" value={guarantee.projectCui} />
                    <DetailItem label="Obra referencial" value={guarantee.projectName} />
                    <DetailItem label="Entidad" value={guarantee.entityName} />
                    <DetailItem label="Nombre formal" value={guarantee.formalProjectName} />
                    <DetailItem label="Ganado con" value={guarantee.wonWith} />
                    <DetailItem label="Etapa del proyecto" value={guarantee.projectStage} />
                    <DetailItem label="Valor del proyecto" value={`S/ ${guarantee.projectValue.toLocaleString("es-PE")}`} />
                  </div>
                </section>

                <section>
                  <h3 className="mb-3 text-sm font-semibold text-primary">Datos de la carta fianza</h3>
                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    <DetailItem label="Estado CF" value={guarantee.status} />
                    <DetailItem label="Entidad financiera" value={guarantee.insurerName} />
                    <DetailItem label="Motivo" value={guarantee.guaranteeReason} />
                    <DetailItem label="Área solicitante" value={guarantee.requestingArea} />
                    <DetailItem label="CeCo" value={guarantee.costCenter} />
                    <DetailItem label="Link Documento" value={guarantee.documentUrl} />
                    <DetailItem label="Fecha de inicio" value={guarantee.validFrom} />
                    <DetailItem label="Fecha de vencimiento" value={guarantee.expiresAt} />
                    <DetailItem label="Días de vigencia" value={guarantee.validityDays} />
                    <DetailItem label="Valor CF" value={`S/ ${guarantee.guaranteeValue.toLocaleString("es-PE")}`} />
                    <DetailItem label="Valor componente" value={`S/ ${guarantee.componentValue.toLocaleString("es-PE")}`} />
                    <DetailItem label="Monto prima" value={`S/ ${guarantee.premium.toLocaleString("es-PE")}`} />
                    <DetailItem label="Monto encaje" value={`S/ ${guarantee.collateral.toLocaleString("es-PE")}`} />
                    <DetailItem label="% encaje" value={`${guarantee.collateralPercentage}%`} />
                    <DetailItem label="VOF" value={guarantee.vof} />
                    <DetailItem label="Póliza CAR" value={guarantee.carPolicy} />
                  </div>
                </section>
              </div>
            </div>
          </div>,
          document.body,
        )
      )}
    </>
  );
}
