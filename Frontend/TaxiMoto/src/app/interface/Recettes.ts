// src/app/interface/recette.ts
export interface Recette {
    id?: number;
    chauffeur: any;  // Remplacez 'any' par le type approprié si vous avez un modèle pour Chauffeur
    date: string;
    montant: number;
    created_at?: string;
    created_by?: string;
    modified_at?: string;
    modified_by?: string;
  }
  