//frontend/src/types.ts
export type ParseResponse = {
  drugs:     string[];
  lab_tests: string[];
  notes:     string[];
  visit_id:  number;
};

export type VisitSummary = {
  id:         number;
  created_at: string;
};

export type VisitDetails = {
  drugs:     string[];
  lab_tests: string[];
  notes:     string[];
};