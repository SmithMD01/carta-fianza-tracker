"use client";

import { useState } from "react";

type ProjectFormValues = {
  projectCode: string;
  cui: string;
  referenceName: string;
  formalName: string;
  entityName: string;
  financialEntityName: string;
  projectValue: string;
  selectionProcess: string;
  consortiumWith: string;
  wonWith: string;
  projectStage: string;
  status: string;
};

const initialFormValues: ProjectFormValues = {
  projectCode: "",
  cui: "",
  referenceName: "",
  formalName: "",
  entityName: "",
  financialEntityName: "",
  projectValue: "",
  selectionProcess: "",
  consortiumWith: "",
  wonWith: "",
  projectStage: "Inicio",
  status: "En curso",
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

type SelectFieldProps = {
  label: string;
  value: string;
  options: string[];
  required?: boolean;
  onChange: (value: string) => void;
};

function SelectField({
  label,
  value,
  options,
  required = false,
  onChange,
}: SelectFieldProps) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted">
        {label}
        {required && <span className="text-danger"> *</span>}
      </span>
      <select
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className={inputClassName}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export function ProjectCreateModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [formValues, setFormValues] =
    useState<ProjectFormValues>(initialFormValues);

  const updateField = (
    field: keyof ProjectFormValues,
    value: string,
  ) => {
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

    const projectDraft = {
      id: crypto.randomUUID(),
      ...formValues,
      projectValue: Number(formValues.projectValue),
      activeGuarantees: 0,
    };

    console.log("Proyecto registrado:", projectDraft);
    closeModal();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
      >
        Registrar proyecto
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-project-title"
            className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-surface shadow-2xl"
          >
            <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-surface px-6 py-4">
              <div>
                <h2 id="create-project-title" className="text-xl font-bold text-foreground">
                  Registrar proyecto
                </h2>
                <p className="mt-1 text-sm text-muted">
                  Completa los datos principales del proyecto.
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
                  Identificación del proyecto
                </h3>

                <div className="grid gap-4 md:grid-cols-2">
                  <InputField label="Código de proyecto interno" value={formValues.projectCode} required onChange={(value) => updateField("projectCode", value)} />
                  <InputField label="CUI" value={formValues.cui} required onChange={(value) => updateField("cui", value)} />
                  <InputField label="Nombre referencial" value={formValues.referenceName} required onChange={(value) => updateField("referenceName", value)} />
                  <InputField label="Nombre formal del proyecto" value={formValues.formalName} required onChange={(value) => updateField("formalName", value)} />
                  <InputField label="Entidad" value={formValues.entityName} required onChange={(value) => updateField("entityName", value)} />
                  <InputField label="Entidad financiera" value={formValues.financialEntityName} onChange={(value) => updateField("financialEntityName", value)} />
                </div>
              </section>

              <section>
                <h3 className="mb-4 text-sm font-semibold text-primary">
                  Información económica y contractual
                </h3>

                <div className="grid gap-4 md:grid-cols-2">
                  <InputField label="Valor del proyecto" type="number" value={formValues.projectValue} required onChange={(value) => updateField("projectValue", value)} />
                  <InputField label="Proceso de selección" value={formValues.selectionProcess} onChange={(value) => updateField("selectionProcess", value)} />
                  <InputField label="Consorciado con" value={formValues.consortiumWith} onChange={(value) => updateField("consortiumWith", value)} />
                  <InputField label="Ganado con" value={formValues.wonWith} onChange={(value) => updateField("wonWith", value)} />
                </div>
              </section>

              <section>
                <h3 className="mb-4 text-sm font-semibold text-primary">
                  Estado del proyecto
                </h3>

                <div className="grid gap-4 md:grid-cols-2">
                  <SelectField label="Etapa del proyecto" value={formValues.projectStage} options={["Inicio", "Ejecución", "Cierre", "Liquidación"]} required onChange={(value) => updateField("projectStage", value)} />
                  <SelectField label="Estado" value={formValues.status} options={["En curso", "En liquidación", "Finalizado", "Suspendido"]} required onChange={(value) => updateField("status", value)} />
                </div>
              </section>

              <footer className="flex justify-end gap-3 border-t border-border pt-5">
                <button type="button" onClick={closeModal} className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-surface-muted">
                  Cancelar
                </button>
                <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark">
                  Registrar proyecto
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
