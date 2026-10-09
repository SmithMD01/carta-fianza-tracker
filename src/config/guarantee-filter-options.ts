import type {
  GuaranteeColumnFilters,
  GuaranteeQuestion,
} from "@/types/guarantee-filters";

export const GUARANTEE_QUESTION_OPTIONS: ReadonlyArray<{
  value: GuaranteeQuestion;
  label: string;
}> = [
  {
    value: "all",
    label: "Todas las cartas",
  },
  {
    value: "convenio",
    label: "Cartas para firma de convenio",
  },
  {
    value: "adenda",
    label: "Cartas para firma de adenda",
  },
  {
    value: "solicitadas",
    label: "Cartas solicitadas",
  },
  {
    value: "por-vencer",
    label: "Cartas próximas a renovar",
  },
  {
    value: "encaje-pendiente",
    label: "¿Cuánto encaje registrado hay?",
  },
];

export function createInitialGuaranteeColumnFilters(): GuaranteeColumnFilters {
  return {
    project: "",
    projectName: "",
    entity: "",
    insurer: "",
    guaranteeNumber: "",
    reason: "",
    status: "",
    guaranteeValue: "",
    projectValue: "",
    premium: "",
    collateral: "",
    collateralPercentage: "",
    validFrom: "",
    expiresAt: "",
    renewalDays: "",
    guaranteeGroups: "",
    projectStage: "",
  };
}
