import { Component, OnInit } from '@angular/core';
import { EntretienService } from 'src/app/Entretien/entretien.service';
import { PanneService } from 'src/app/Panne/panne.service';
import { RecetteService } from 'src/app/Recette/recette.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Utilisateur } from 'src/app/interface/Utilisateur';

@Component({
  selector: 'app-chauffeur',
  templateUrl: './chauffeur.component.html',
  styleUrls: ['./chauffeur.component.css']
})
export class ChauffeurComponent implements OnInit {
  currentUser: any;
  user: Utilisateur | undefined;
  // ********************* Recettes
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 0;
  listeRecette : any[] = []
  paginatedRecetteChauffeur: any;
  recetteChauffeur: any[] = [];
  // ********************** Pannes
  currentPagePanne = 1;
  itemsPerPagePanne = 5;
  totalPagesPanne = 0;
  paginatedPannesChauffeur: any;
  pannesChauffeur: any[] = [];

  // ********************** Entretien
  currentPageEntretien = 1;
  itemsPerPageEntretien = 5;
  totalPagesEntretien = 0;
  paginatedEntretiensChauffeur: any;
  entretiensChauffeur: any[] = [];

  constructor(private authService : AuthService, private recetteService : RecetteService, private panneService : PanneService, private entretienService : EntretienService) {
    
  }
  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    if (this.currentUser) {
        this.user = this.currentUser.user;
    }
    this.loadRecetteChauffeur()
    this.loadPannesChauffeur()
    this.loadEntretienChauffeur()
  }


// ****************** Recettes
  loadRecetteChauffeur(page : number = 1)
  {
    this.recetteService.getRecettesChauffeur(this.user!.id ,  page, this.itemsPerPage).subscribe({
      next: (response) => {
        this.recetteChauffeur = response.results;
        
        this.totalPages = Math.ceil(response.count / this.itemsPerPage); // Adapter en fonction de la pagination côté serveur si nécessaire
        this.updatePagination();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
 
  updatePagination() {
    this.paginatedRecetteChauffeur = this.recetteChauffeur
    
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadRecetteChauffeur(this.currentPage);
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadRecetteChauffeur(this.currentPage);
    }
  }
 
  // ********************* Pannes

  loadPannesChauffeur(page : number = 1)
  {
    this.panneService.getPannesChauffeur(this.user!.id ,  page, this.itemsPerPagePanne).subscribe({
      next: (response) => {
        this.pannesChauffeur = response.results;
        this.totalPagesPanne = Math.ceil(response.count / this.itemsPerPagePanne); // Adapter en fonction de la pagination côté serveur si nécessaire
        this.updatePaginationPannes();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  updatePaginationPannes() {
    this.paginatedPannesChauffeur = this.pannesChauffeur
    
  }

  nextPagePanne() {
    if (this.currentPagePanne < this.totalPagesPanne) {
      this.currentPagePanne++;
      this.loadPannesChauffeur(this.currentPagePanne);
    }
  }

  previousPagePanne() {
    if (this.currentPagePanne > 1) {
      this.currentPagePanne--;
      this.loadPannesChauffeur(this.currentPagePanne);
    }
  }

  // ******************** Entretien

  loadEntretienChauffeur(page : number = 1)
  {
    this.entretienService.getEntretiensChauffeur(this.user!.id ,  page, this.itemsPerPageEntretien).subscribe({
      next: (response) => {
        this.entretiensChauffeur = response.results;
        this.totalPagesEntretien = Math.ceil(response.count / this.itemsPerPageEntretien); // Adapter en fonction de la pagination côté serveur si nécessaire
        this.updatePaginationEntretien();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  updatePaginationEntretien() {
    this.paginatedEntretiensChauffeur = this.entretiensChauffeur
    
  }

  nextPageEntretien() {
    if (this.currentPageEntretien < this.totalPagesEntretien) {
      this.currentPageEntretien++;
      this.loadEntretienChauffeur(this.currentPageEntretien);
    }
  }

  previousPageEntretien() {
    if (this.currentPageEntretien > 1) {
      this.currentPageEntretien--;
      this.loadEntretienChauffeur(this.currentPageEntretien);
    }
  }


}
