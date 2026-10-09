"use client";

import { useState } from "react";
import type { Project } from "@/types/project";
import { getGuaranteeReasonsForOrigin, REQUESTING_AREAS } from "@/config/business-options";
import { createGuaranteeAction } from "@/app/cartas-fianza/actions";

type GuaranteeCreateModalProps = {
  projects: Project[];
};

type FormValues = {
  projectId: string;
  guaranteeReason: string;
  validFrom: string;
  requestingArea: string;
  validityDays: string;
  guaranteePercentage: string;
  componentValue: string;
  costCenter: string;
};

const initialFormValues: FormValues = {
  projectId: "",
  guaranteeReason: "",
  validFrom: "",
  requestingArea: "",
  validityDays: "",
  guaranteePercentage: "",
  componentValue: "",
  costCenter: "",
};

const inputClassName =
  "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-primary";

type InputFieldProps = {
  label: string;
  value: string;
  required?: boolean;
  type?: string;
  onChange: (value: string) => void;
};

function InputField({
  label,
  value,
  required = false,
  type = "text",
  onChange,
}: InputFieldProps) {
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

export function GuaranteeCreateModal({
  projects,
}: GuaranteeCreateModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formValues, setFormValues] = useState<FormValues>(initialFormValues);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState("");

  const selectedProject = projects.find(
    (project) => project.id === formValues.projectId,
  );

  const availableReasons = getGuaranteeReasonsForOrigin(selectedProject?.wonWith ?? "");
  const calculatedGuaranteeValue =
    (Number(formValues.componentValue) * Number(formValues.guaranteePercentage)) / 100;

  const updateField = (field: keyof FormValues, value: string) => {
    setFormValues((currentValues) => {
      const nextValues = { ...currentValues, [field]: value };

      if (field === "projectId") {
        nextValues.guaranteeReason = "";
      }

      return nextValues;
    });
  };

  const closeModal = () => {
    setIsOpen(false);
    setFormValues(initialFormValues);
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!selectedProject) {
      return;
    }

    setSubmissionError("");
    setIsSubmitting(true);

    try {
      await createGuaranteeAction({
        projectId: formValues.projectId,
        guaranteeReason: formValues.guaranteeReason,
        validFrom: formValues.validFrom,
        requestingArea: formValues.requestingArea,
        validityDays: Number(formValues.validityDays),
        guaranteePercentage: Number(
          formValues.guaranteePercentage,
        ),
        componentValue: Number(formValues.componentValue),
        costCenter: formValues.costCenter,
      });

      closeModal();
    } catch (error) {
      console.error(error);
      setSubmissionError(
        "No se pudo registrar la carta fianza. Verifica los datos e inténtalo nuevamente.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex h-10 min-w-[165px] items-center justify-center whitespace-nowrap rounded-lg bg-primary px-3 text-sm font-medium text-white hover:bg-primary-dark"
      >
        Agregar Carta Fianza
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-guarantee-title"
            className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-surface shadow-2xl"
          >
            <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-surface px-6 py-4">
              <div>
                <h2 id="create-guarantee-title" className="text-xl font-bold text-foreground">
                  Registrar carta fianza
                </h2>
                <p className="mt-1 text-sm text-muted">
                  Selecciona un proyecto y completa los datos de la carta.
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
                <h3 className="mb-4 text-sm font-semibold text-primary">
                  Proyecto asociado
                </h3>

                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-muted">
                    Seleccionar proyecto <span className="text-danger">*</span>
                  </span>
                  <select
                    value={formValues.projectId}
                    required
                    onChange={(event) => updateField("projectId", event.target.value)}
                    className={inputClassName}
                  >
                    <option value="">Seleccionar proyecto...</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.projectCode} · {project.referenceName}
                      </option>
                    ))}
                  </select>
                </label>

                {selectedProject && (
                  <div className="mt-4 grid gap-3 rounded-xl border border-border bg-surface-muted p-4 text-sm md:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <p className="text-xs text-muted">Código / CUI</p>
                      <p className="font-semibold text-foreground">
                        {selectedProject.projectCode} · {selectedProject.cui}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted">Obra referencial</p>
                      <p className="font-semibold text-foreground">{selectedProject.referenceName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted">Entidad</p>
                      <p className="font-semibold text-foreground">{selectedProject.entityName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted">Ganado con</p>
                      <p className="font-semibold text-foreground">{selectedProject.wonWith}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted">Valor del proyecto</p>
                      <p className="font-semibold text-foreground">
                        S/ {selectedProject.projectValue.toLocaleString("es-PE")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted">Etapa del proyecto</p>
                      <p className="font-semibold text-foreground">{selectedProject.projectStage}</p>
                    </div>
                  </div>
                )}
              </section>

              <section>
                <h3 className="mb-4 text-sm font-semibold text-primary">
                  Datos de la carta fianza
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-1 block text-xs font-medium text-muted">Motivo carta fianza <span className="text-danger">*</span></span>
                    <select value={formValues.guaranteeReason} required onChange={(event) => updateField("guaranteeReason", event.target.value)} className={inputClassName} disabled={!selectedProject}>
                      <option value="">{selectedProject ? "Seleccionar motivo..." : "Selecciona un proyecto"}</option>
                      {availableReasons.map((reason) => <option key={reason} value={reason}>{reason}</option>)}
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs font-medium text-muted">Área solicitante <span className="text-danger">*</span></span>
                    <select value={formValues.requestingArea} required onChange={(event) => updateField("requestingArea", event.target.value)} className={inputClassName}>
                      <option value="">Seleccionar área...</option>
                      {REQUESTING_AREAS.map((area) => <option key={area} value={area}>{area}</option>)}
                    </select>
                  </label>
                  <InputField label="CeCo" value={formValues.costCenter} onChange={(value) => updateField("costCenter", value)} />
                </div>
              </section>

              <section>
                <h3 className="mb-4 text-sm font-semibold text-primary">
                  Fechas y valores
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <InputField label="Fecha inicio" type="date" value={formValues.validFrom} required onChange={(value) => updateField("validFrom", value)} />
                  <InputField label="Cantidad de días de vigencia" type="number" value={formValues.validityDays} required onChange={(value) => updateField("validityDays", value)} />
                  <InputField label="Valor componente" type="number" value={formValues.componentValue} required onChange={(value) => updateField("componentValue", value)} />
                  <InputField label="Porcentaje para valor CF" type="number" value={formValues.guaranteePercentage} required onChange={(value) => updateField("guaranteePercentage", value)} />
                  <div className="rounded-lg border border-border bg-surface-muted px-3 py-2">
                    <p className="text-xs font-medium text-muted">Valor CF calculado</p>
                    <p className="mt-1 text-sm font-semibold text-foreground">S/ {calculatedGuaranteeValue.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>
                </div>
              </section>

              {submissionError && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                  {submissionError}
                </p>
              )}

              <footer className="flex justify-end gap-3 border-t border-border pt-5">
                <button type="button" onClick={closeModal} className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-surface-muted">
                  Cancelar
                </button>
              <button type="submit" disabled={isSubmitting} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60" >
                {isSubmitting
                  ? "Guardando..."
                  : "Registrar carta fianza"}
              </button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
