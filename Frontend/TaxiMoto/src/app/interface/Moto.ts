// src/app/interface/moto.ts
export interface Moto {
    id?: number;
    numero_serie: string;
    couleur: string;
    date_achat: string;
    enContrat: boolean;
    created_by: string | null;
    created_at: string;
    modified_at: string;
    modified_by: string | null;
  }
  