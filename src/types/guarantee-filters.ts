export type GuaranteeQuestion =
  | "all"
  | "convenio"
  | "adenda"
  | "solicitadas"
  | "por-vencer"
  | "encaje-pendiente";

export type GuaranteeColumnFilters = {
  project: string;
  projectName: string;
  entity: string;
  insurer: string;
  guaranteeNumber: string;
  reason: string;
  status: string;
  guaranteeValue: string;
  projectValue: string;
  premium: string;
  collateral: string;
  collateralPercentage: string;
  validFrom: string;
  expiresAt: string;
  renewalDays: string;
  guaranteeGroups: string;
  projectStage: string;
};

export type GuaranteeFilterState = {
  search: string;
  selectedStatus: string;
  selectedInsurer: string;
  selectedQuestion: GuaranteeQuestion;
  columnFilters: GuaranteeColumnFilters;
};