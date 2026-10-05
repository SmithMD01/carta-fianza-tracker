"use client";

import { useState } from "react";
import type { Project } from "@/types/project";

type GuaranteeCreateModalProps = {
  projects: Project[];
};

type FormValues = {
  projectId: string;
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

const initialFormValues: FormValues = {
  projectId: "",
  insurerName: "",
  guaranteeNumber: "",
  guaranteeReason: "",
  validFrom: "",
  expiresAt: "",
  requestingArea: "",
  requestedStage: "",
  guaranteeValue: "",
  componentValue: "",
  costCenter: "",
  observations: "",
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

  const selectedProject = projects.find(
    (project) => project.id === formValues.projectId,
  );

  const updateField = (field: keyof FormValues, value: string) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));
  };

  const closeModal = () => {
    setIsOpen(false);
    setFormValues(initialFormValues);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedProject) return;

    const guaranteeDraft = {
      ...formValues,
      projectCode: selectedProject.projectCode,
      projectCui: selectedProject.cui,
      projectName: selectedProject.referenceName,
      formalProjectName: selectedProject.formalName,
      entityName: selectedProject.entityName,
      projectValue: selectedProject.projectValue,
      selectionProcess: selectedProject.selectionProcess,
      consortiumWith: selectedProject.consortiumWith,
      wonWith: selectedProject.wonWith,
      guaranteeValue: Number(formValues.guaranteeValue),
      componentValue: Number(formValues.componentValue),
    };

    console.log("Carta fianza registrada:", guaranteeDraft);
    closeModal();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
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
                      <p className="text-xs text-muted">Nombre formal</p>
                      <p className="font-semibold text-foreground">{selectedProject.formalName}</p>
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
                  <InputField label="Entidad financiera" value={formValues.insurerName} required onChange={(value) => updateField("insurerName", value)} />
                  <InputField label="N.° carta fianza" value={formValues.guaranteeNumber} required onChange={(value) => updateField("guaranteeNumber", value)} />
                  <InputField label="Motivo carta fianza" value={formValues.guaranteeReason} required onChange={(value) => updateField("guaranteeReason", value)} />
                  <InputField label="Área solicitante" value={formValues.requestingArea} required onChange={(value) => updateField("requestingArea", value)} />
                  <InputField label="Etapa solicitada" value={formValues.requestedStage} required onChange={(value) => updateField("requestedStage", value)} />
                  <InputField label="CeCo" value={formValues.costCenter} onChange={(value) => updateField("costCenter", value)} />
                </div>
              </section>

              <section>
                <h3 className="mb-4 text-sm font-semibold text-primary">
                  Fechas y valores
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <InputField label="Fecha inicio" type="date" value={formValues.validFrom} required onChange={(value) => updateField("validFrom", value)} />
                  <InputField label="Fecha vencimiento" type="date" value={formValues.expiresAt} required onChange={(value) => updateField("expiresAt", value)} />
                  <InputField label="Valor CF" type="number" value={formValues.guaranteeValue} required onChange={(value) => updateField("guaranteeValue", value)} />
                  <InputField label="Valor componente" type="number" value={formValues.componentValue} onChange={(value) => updateField("componentValue", value)} />
                </div>
              </section>

              <section>
                <h3 className="mb-4 text-sm font-semibold text-primary">
                  Información adicional
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border border-border bg-surface-muted px-3 py-2">
                    <p className="text-xs font-medium text-muted">Proceso de selección</p>
                    <p className="mt-1 text-sm text-foreground">
                      {selectedProject?.selectionProcess || "Selecciona un proyecto"}
                    </p>
                  </div>

                  <div className="rounded-lg border border-border bg-surface-muted px-3 py-2">
                    <p className="text-xs font-medium text-muted">Consorciado con</p>
                    <p className="mt-1 text-sm text-foreground">
                      {selectedProject?.consortiumWith || "Selecciona un proyecto"}
                    </p>
                  </div>

                  <div className="rounded-lg border border-border bg-surface-muted px-3 py-2">
                    <p className="text-xs font-medium text-muted">Ganado con</p>
                    <p className="mt-1 text-sm text-foreground">
                      {selectedProject?.wonWith || "Selecciona un proyecto"}
                    </p>
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
                  Registrar carta fianza
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
