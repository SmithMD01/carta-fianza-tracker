"use client";

import { useState } from "react";
import { PROJECT_ORIGINS, PROJECT_STAGES } from "@/config/business-options";
import type { Project } from "@/types/project";
import { createProjectAction, updateProjectAction } from "@/app/proyectos/actions";

type ProjectCreateModalProps = {
  project?: Project;
  onSave?: (project: Project) => void;
  menuItem?: boolean;
};

type ProjectFormValues = {
  projectCode: string;
  cui: string;
  referenceName: string;
  formalName: string;
  entityName: string;
  projectValue: string;
  selectionProcess: string;
  consortiumWith: string;
  wonWith: string;
  projectStage: string;
};

const initialFormValues: ProjectFormValues = {
  projectCode: "",
  cui: "",
  referenceName: "",
  formalName: "",
  entityName: "",
  projectValue: "",
  selectionProcess: "",
  consortiumWith: "",
  wonWith: "",
  projectStage: "",
};

function createInitialValues(project?: Project): ProjectFormValues {
  if (!project) return initialFormValues;

  return {
    projectCode: project.projectCode,
    cui: project.cui,
    referenceName: project.referenceName,
    formalName: project.formalName,
    entityName: project.entityName,
    projectValue: String(project.projectValue),
    selectionProcess: project.selectionProcess,
    consortiumWith: project.consortiumWith,
    wonWith: project.wonWith,
    projectStage: project.projectStage,
  };
}

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
  placeholder?: string;
  onChange: (value: string) => void;
};

function SelectField({
  label,
  value,
  options,
  required = false,
  placeholder = "Seleccionar una opción",
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
        <option value="" disabled>{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export function ProjectCreateModal({ project, onSave, menuItem = false }: ProjectCreateModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState(""); 
  const [isOpen, setIsOpen] = useState(false);
  const [formValues, setFormValues] = useState<ProjectFormValues>(() => createInitialValues(project));

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
    setFormValues(createInitialValues(project));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setSubmissionError("");
    setIsSubmitting(true);

    try {
      if (project) {
        const updatedProject = await updateProjectAction({
          id: project.id,
          projectCode: formValues.projectCode,
          cui: formValues.cui,
          referenceName: formValues.referenceName,
          formalName: formValues.formalName,
          entityName: formValues.entityName,
          projectValue: Number(formValues.projectValue),
          selectionProcess: formValues.selectionProcess,
          consortiumWith: formValues.consortiumWith,
          wonWith: formValues.wonWith,
          projectStage: formValues.projectStage,
        });

        onSave?.(updatedProject);
      } else {
        const savedProject = await createProjectAction({
          projectCode: formValues.projectCode,
          cui: formValues.cui,
          referenceName: formValues.referenceName,
          formalName: formValues.formalName,
          entityName: formValues.entityName,
          projectValue: Number(formValues.projectValue),
          selectionProcess: formValues.selectionProcess,
          consortiumWith: formValues.consortiumWith,
          wonWith: formValues.wonWith,
          projectStage: formValues.projectStage,
        });

        onSave?.(savedProject);
      }

      closeModal();
    } catch (error) {
      console.error(error);
      setSubmissionError(
        "No se pudo guardar el proyecto. Verifica los datos e inténtalo nuevamente.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setFormValues(createInitialValues(project));
          setIsOpen(true);
        }}
        className={menuItem
          ? "block w-full rounded-md px-3 py-2 text-left text-xs font-medium text-foreground hover:bg-surface-muted"
          : project
          ? "inline-flex rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary-soft"
          : "rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"}
      >
        {project ? "Editar" : "Registrar proyecto"}
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
                  {project ? "Guardar cambios" : "Registrar proyecto"}
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
                  <SelectField label="Ganado con" value={formValues.wonWith} options={[...PROJECT_ORIGINS]} placeholder="Seleccionar una opción" required onChange={(value) => updateField("wonWith", value)} />
                </div>
              </section>

              <section>
                <h3 className="mb-4 text-sm font-semibold text-primary">
                  Etapa del proyecto
                </h3>

                <SelectField label="Etapa del proyecto" value={formValues.projectStage} options={[...PROJECT_STAGES]} placeholder="Seleccionar una opción" required onChange={(value) => updateField("projectStage", value)} />
              </section>

              <footer className="flex justify-end gap-3 border-t border-border pt-5">
                <button type="button" onClick={closeModal} className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-surface-muted">
                  Cancelar
                </button>
                {/* <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark">
                  Registrar proyecto
                </button> */}
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Guardando..." : project ? "Guardar cambios" : "Registrar proyecto"}
                </button>

                {submissionError && (
                  <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                    {submissionError}
                  </p>
                )}

              </footer>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
