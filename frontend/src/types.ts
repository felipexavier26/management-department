export interface Department {
    id: number;
    name: string;
    parent_department_id?: number;
    children?: Department[];
  }
  