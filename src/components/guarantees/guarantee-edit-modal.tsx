"use client";

import { useState } from "react";
import type { Guarantee } from "@/types/guarantee";
import { getGuaranteeReasonsForOrigin, REQUESTING_AREAS } from "@/config/business-options";

type GuaranteeEditModalProps = {
  guarantee: Guarantee;
};

type EditFormValues = {
  insurerName: string;
  guaranteeNumber: string;
  guaranteeReason: string;
  validFrom: string;
  validityDays: string;
  expiresAt: string;
  requestingArea: string;
  guaranteePercentage: string;
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
    validityDays: String(guarantee.validityDays),
    expiresAt: guarantee.expiresAt,
    requestingArea: guarantee.requestingArea,
    guaranteePercentage: String(guarantee.guaranteePercentage),
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
  const availableReasons = getGuaranteeReasonsForOrigin(guarantee.wonWith);
  const calculatedGuaranteeValue =
    (Number(formValues.componentValue) * Number(formValues.guaranteePercentage)) / 100;

  const calculateExpirationDate = (validFrom: string, validityDays: string) => {
    if (!validFrom || !validityDays) return "";
    const date = new Date(`${validFrom}T00:00:00`);
    date.setDate(date.getDate() + Number(validityDays));
    return date.toISOString().slice(0, 10);
  };

  const updateField = (field: keyof EditFormValues, value: string) => {
    setFormValues((currentValues) => {
      const nextValues = { ...currentValues, [field]: value };
      if (field === "validFrom" || field === "validityDays") {
        nextValues.expiresAt = calculateExpirationDate(nextValues.validFrom, nextValues.validityDays);
      }
      return nextValues;
    });
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
      guaranteeValue: calculatedGuaranteeValue,
      guaranteePercentage: Number(formValues.guaranteePercentage),
      validityDays: Number(formValues.validityDays),
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
                  <label className="block">
                    <span className="mb-1 block text-xs font-medium text-muted">Motivo carta fianza <span className="text-danger">*</span></span>
                    <select value={formValues.guaranteeReason} required onChange={(event) => updateField("guaranteeReason", event.target.value)} className={inputClassName}>
                      {availableReasons.map((reason) => <option key={reason} value={reason}>{reason}</option>)}
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs font-medium text-muted">Área solicitante <span className="text-danger">*</span></span>
                    <select value={formValues.requestingArea} required onChange={(event) => updateField("requestingArea", event.target.value)} className={inputClassName}>
                      {REQUESTING_AREAS.map((area) => <option key={area} value={area}>{area}</option>)}
                    </select>
                  </label>
                  <EditField label="CeCo" value={formValues.costCenter} onChange={(value) => updateField("costCenter", value)} />
                  <EditField label="Fecha inicio" type="date" value={formValues.validFrom} required onChange={(value) => updateField("validFrom", value)} />
                  <EditField label="Cantidad de días de vigencia" type="number" value={formValues.validityDays} required onChange={(value) => updateField("validityDays", value)} />
                  <EditField label="Fecha vencimiento" type="date" value={formValues.expiresAt} required onChange={(value) => updateField("expiresAt", value)} />
                  <EditField label="Valor componente" type="number" value={formValues.componentValue} required onChange={(value) => updateField("componentValue", value)} />
                  <EditField label="Porcentaje para valor CF" type="number" value={formValues.guaranteePercentage} required onChange={(value) => updateField("guaranteePercentage", value)} />
                  <div className="rounded-lg border border-border bg-surface-muted px-3 py-2">
                    <p className="text-xs font-medium text-muted">Valor CF calculado</p>
                    <p className="mt-1 text-sm font-semibold text-foreground">S/ {calculatedGuaranteeValue.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>
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
