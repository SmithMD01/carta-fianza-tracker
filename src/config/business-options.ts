export const PROJECT_ORIGINS = [
  "Perfil",
  "IOARR",
  "Expediente Técnico",
] as const;

export const PROJECT_STAGES = [
  "Aprobación contractual",
  "Elaboración del documento",
  "Convenio firmado",
  "Aprobación de ET, DE o Adicional",
  "Ejecución de la obra",
] as const;

export const REQUESTING_AREAS = ["Comercial", "Operaciones"] as const;

// Los roles controlan permisos; no representan el área que solicita la carta.
export const SYSTEM_ROLES = [
  "Comercial",
  "Operaciones",
  "Gestor de cartas fianza",
] as const;

export const GUARANTEE_STATUSES = [
  "Solicitud",
  "Activa",
  "Vencida",
  "Renovada",
] as const;

export const GUARANTEE_REASONS_BY_ORIGIN: Record<string, string[]> = {
  Perfil: [
    "CF Elaboración de Expediente Técnico",
    "CF Supervisión Elaboración de Expediente Técnico",
    "CF Ejecución Definitivo de la Obra",
    "CF Supervisión de Ejecución de la Obra",
    "CF Ejecución de Mayor Trabajo de la Obra",
  ],
  IOARR: [
    "CF Elaboración de Documento Equivalente",
    "CF Supervisión Elaboración de Documento Equivalente",
    "CF Ejecución Definitivo de la Obra",
    "CF Supervisión de Ejecución de la Obra",
    "CF Ejecución de Mayor Trabajo de la Obra",
  ],
  "Expediente Técnico": [
    "CF Ejecución Eval. de la Obra",
    "CF Ejecución Adicional de la Obra",
    "CF Supervisión de Ejecución de la Obra",
    "CF Ejecución de Mayor Trabajo de la Obra",
  ],
};

export const GUARANTEE_GROUPS = [
  "Elaboración",
  "Supervisión",
  "Ejecución",
  "Adicionales",
] as const;

export function getGuaranteeReasonsForOrigin(origin: string) {
  return GUARANTEE_REASONS_BY_ORIGIN[origin] ?? [];
}
