export type Project = {
  id: string;
  projectCode: string;
  cui: string;
  referenceName: string;
  formalName: string;
  entityName: string;
  projectValue: number;
  selectionProcess: string;
  consortiumWith: string;
  wonWith: string;
  projectStage: string;
  /** Derived from the related guarantees; it is not entered in the project form. */
  activeGuarantees: number;
};
