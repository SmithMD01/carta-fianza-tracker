"use client";

import { useState } from "react";
import type { Guarantee } from "@/types/guarantee";

type GuaranteeEditModalProps = {
  guarantee: Guarantee;
};

type EditFormValues = {
  insurerName: string;
  guaranteeNumber: string;
  guaranteeReason: string;
  validFrom: string;
  expiresAt: string;
  requestingArea: string;
  requestedStage: string;
  guaranteeValue: string;
  componentValue: string;
  costCenter: string;
  observations: string;
};

const inputClassName =
  "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-primary";

function createInitialValues(guarantee: Guarantee): EditFormValues {
  return {
    insurerName: guarantee.insurerName,
    guaranteeNumber: guarantee.guaranteeNumber,
    guaranteeReason: guarantee.guaranteeReason,
    validFrom: guarantee.validFrom,
    expiresAt: guarantee.expiresAt,
    requestingArea: guarantee.requestingArea,
    requestedStage: guarantee.requestedStage,
    guaranteeValue: String(guarantee.guaranteeValue),
    componentValue: String(guarantee.componentValue),
    costCenter: guarantee.costCenter,
    observations: guarantee.observations,
  };
}

type EditFieldProps = {
  label: string;
  value: string;
  required?: boolean;
  type?: string;
  onChange: (value: string) => void;
};

function EditField({
  label,
  value,
  required = false,
  type = "text",
  onChange,
}: EditFieldProps) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted">
        {label}
        {required && <span className="text-danger"> *</span>}
      </span>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className={inputClassName}
      />
    </label>
  );
}

export function GuaranteeEditModal({ guarantee }: GuaranteeEditModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formValues, setFormValues] = useState(() => createInitialValues(guarantee));

  const updateField = (field: keyof EditFormValues, value: string) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));
  };

  const openModal = () => {
    setFormValues(createInitialValues(guarantee));
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const updatedGuarantee = {
      ...guarantee,
      ...formValues,
      guaranteeValue: Number(formValues.guaranteeValue),
      componentValue: Number(formValues.componentValue),
    };

    console.log("Carta fianza actualizada:", updatedGuarantee);
    closeModal();
  };

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="rounded-md border border-border px-2 py-1 text-xs font-medium text-primary hover:bg-surface-muted"
      >
        Editar
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`edit-guarantee-${guarantee.id}`}
            className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-surface shadow-2xl"
          >
            <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-surface px-6 py-4">
              <div>
                <h2 id={`edit-guarantee-${guarantee.id}`} className="text-xl font-bold text-foreground">
                  Editar carta fianza
                </h2>
                <p className="mt-1 text-sm text-muted">
                  Corrige la información registrada sin cambiar el proyecto asociado.
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg px-3 py-2 text-xl text-muted hover:bg-surface-muted"
                aria-label="Cerrar modal"
              >
                ×
              </button>
            </header>

            <form onSubmit={handleSubmit} className="space-y-8 p-6">
              <section>
                <h3 className="mb-4 text-sm font-semibold text-primary">Proyecto asociado</h3>
                <div className="grid gap-3 rounded-xl border border-border bg-surface-muted p-4 text-sm md:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <p className="text-xs text-muted">Código / CUI</p>
                    <p className="font-semibold text-foreground">{guarantee.projectCode} · {guarantee.projectCui}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted">Obra referencial</p>
                    <p className="font-semibold text-foreground">{guarantee.projectName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted">Entidad</p>
                    <p className="font-semibold text-foreground">{guarantee.entityName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted">Nombre formal</p>
                    <p className="font-semibold text-foreground">{guarantee.formalProjectName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted">Número de carta</p>
                    <p className="font-semibold text-foreground">{guarantee.guaranteeNumber}</p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="mb-4 text-sm font-semibold text-primary">Datos editables</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <EditField label="Entidad financiera" value={formValues.insurerName} required onChange={(value) => updateField("insurerName", value)} />
                  <EditField label="N.° carta fianza" value={formValues.guaranteeNumber} required onChange={(value) => updateField("guaranteeNumber", value)} />
                  <EditField label="Motivo carta fianza" value={formValues.guaranteeReason} required onChange={(value) => updateField("guaranteeReason", value)} />
                  <EditField label="Área solicitante" value={formValues.requestingArea} required onChange={(value) => updateField("requestingArea", value)} />
                  <EditField label="Etapa solicitada" value={formValues.requestedStage} required onChange={(value) => updateField("requestedStage", value)} />
                  <EditField label="CeCo" value={formValues.costCenter} onChange={(value) => updateField("costCenter", value)} />
                  <EditField label="Fecha inicio" type="date" value={formValues.validFrom} required onChange={(value) => updateField("validFrom", value)} />
                  <EditField label="Fecha vencimiento" type="date" value={formValues.expiresAt} required onChange={(value) => updateField("expiresAt", value)} />
                  <EditField label="Valor CF" type="number" value={formValues.guaranteeValue} required onChange={(value) => updateField("guaranteeValue", value)} />
                  <EditField label="Valor componente" type="number" value={formValues.componentValue} onChange={(value) => updateField("componentValue", value)} />
                </div>
                <label className="mt-4 block">
                  <span className="mb-1 block text-xs font-medium text-muted">Observaciones</span>
                  <textarea
                    value={formValues.observations}
                    onChange={(event) => updateField("observations", event.target.value)}
                    rows={4}
                    className={inputClassName}
                  />
                </label>
              </section>

              <footer className="flex justify-end gap-3 border-t border-border pt-5">
                <button type="button" onClick={closeModal} className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-surface-muted">
                  Cancelar
                </button>
                <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark">
                  Guardar cambios
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
