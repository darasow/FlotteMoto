import { Moto } from "./Moto";

// panne.model.ts
export interface Panne {
    id?: number;
    moto: Moto;
    description: string;
    date_signalement: string;
    etat: string;
    created_at?: string;
    created_by?: number;
    modified_at?: string;
    modified_by?: number;
  }
  