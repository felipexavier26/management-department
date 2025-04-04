// src/types.ts
export interface Department {
  id: number;
  name: string;
  parent_department_id: number | null;
  level: number; // 0: Primário, 1: Secundário, 2: Terciário
  children?: Department[]; // Tornando 'children' opcional
  secondary_department_id?: number;  // Propriedade opcional
  tertiary_department_id?: number;   // Propriedade opcional
  created_at: string;
  updated_at: string;
}
