import { Moto } from "./Moto";

export interface Entretien {
    id?: number; 
    moto: Moto;
    type_entretien: string;
    date_entretien: Date;
    description?: string;
    created_at?: Date;
    created_by?: any; 
    modified_at?: Date;
    modified_by?: any;
  }