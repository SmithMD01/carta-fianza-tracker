export type Guarantee = {
  id: string;

  projectCode: string; // Código del proyecto
  projectCui: string; // CUI del proyecto
  projectName: string;
  entityName: string;
  insurerName: string; // Nombre de la aseguradora
  formalProjectName: string; // Nombre formal del proyecto

  guaranteeNumber: string;
  guaranteeReason: string; // Motivo de la carta fianza
  guaranteeStage: string; // Etapa de la carta fianza
  requestedStage: string; // Etapa solicitada de la carta fianza

  validFrom: string; // Fecha de inicio de vigencia
  expiresAt: string; // Fecha de vencimiento

  requestingArea: string; // Área solicitante

  guaranteeValue: number; // valor de la carta fianza
  projectValue: number; // valor del proyecto
  componentValue: number; // valor del componente

  costCenter: string; // centro de costo
  observations: string; // observaciones

  selectionProcess: string; // proceso de selección
  consortiumWith: string; // consorciado con
  wonWith: string; // ganado con

  premium: number; // prima
  premiumPercentage: number; // prima%
  collateral: number; // encaje
  collateralPercentage: number; // encaje%

  renewalDays: number; // Días de renovación
  status: string; // Estado de la carta fianza
  requestStatus: string; // Estado de la solicitud
  projectStage: string; // Etapa del proyecto
};