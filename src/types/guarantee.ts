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
  guaranteeGroups: string[]; // Clasificación usada para filtros

  validFrom: string; // Fecha de inicio de vigencia
  validityDays: number; // Cantidad de días de vigencia
  expiresAt: string; // Fecha de vencimiento

  requestingArea: string; // Área solicitante
  vof: string; // Visto bueno / referencia de gestión
  carPolicy: string; // Póliza CAR

  guaranteeValue: number; // valor de la carta fianza
  guaranteePercentage: number; // porcentaje usado para calcular el valor CF
  projectValue: number; // valor del proyecto
  componentValue: number; // valor del componente

  costCenter: string; // centro de costo
  observations: string; // observaciones
  documentUrl: string; // Enlace opcional del PDF CF de OneDrive

  selectionProcess: string; // proceso de selección
  consortiumWith: string; // consorciado con
  wonWith: string; // ganado con

  premium: number; // prima
  collateral: number; // encaje
  collateralPercentage: number; // encaje%

  renewalDays: number; // Días restantes para renovar, calculados por el sistema
  renewalNumber?: number;
  originalGuaranteeId?: string;
  status: string; // Estado de la carta fianza
  requestStatus: string; // Estado de la solicitud
  projectStage: string; // Etapa del proyecto
};
