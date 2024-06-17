import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RecetteService } from '../recette.service';
import { ContratService } from 'src/app/Contrat/contrat.service';
import { Recette } from 'src/app/interface/Recettes';

@Component({
  selector: 'app-recette-liste',
  templateUrl: './recette-liste.component.html',
  styleUrls: ['./recette-liste.component.css']
})
export class RecetteListeComponent implements OnInit {
  @Input() recette: any;
  @Output() formSubmit = new EventEmitter<any>();
  recetteForm: FormGroup;
  chauffeursEnContrat: any[] = [];
  recettes: any[] = [];
  currentRecette: any = null;
  modalOpen: boolean = false;
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 0;
  paginatedRecette: Recette[] = [];
  modalActionOpen: boolean = false; // Ajout de la modal pour l'action
  actionRecette: any = null; 

  constructor(
    private fb: FormBuilder,
    private recetteService: RecetteService,
    private contratService: ContratService
  ) {
    this.recetteForm = this.fb.group({
      chauffeur: ['', Validators.required],
      date: ['', Validators.required],
      montant:  [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]{1,8}(?:\\.[0-9]{1,2})?$') // Up to 10 digits for integer part, up to 2 digits for decimal part
        ]
      ]
    });
  }

  ngOnInit(): void {
    this.getContratsEnCours();
    this.loadRecettes();
  }

  getContratsEnCours(): void {
    this.contratService.getContratsEnCours().subscribe({
      next : (response) =>{
        this.chauffeursEnContrat = response
        
      },
      error : (err) =>{
        console.log(err);
      } 
    })
  }
  openModalAction(recette: any): void {
    this.actionRecette = recette;
    this.modalActionOpen = true;
  }

  closeModalAction(): void {
    this.modalActionOpen = false;
  }

  get formControls() {
    return this.recetteForm.controls;
  }

  loadRecettes(page : number = 1): void {
    this.recetteService.getRecettes(page, this.itemsPerPage).subscribe({
      next : (response) =>{
        this.recettes = response.results;        
        this.totalPages = Math.ceil(response.count / this.itemsPerPage);
        this.currentPage = page;
        this.updatePagination()
      },
      error : (err) =>{
        console.log(err);
      }
    })
  }

  
  updatePagination() {
    this.paginatedRecette = this.recettes
    }
  
  
    nextPage(): void {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.loadRecettes(this.currentPage);
      }
    }
  
    previousPage(): void {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.loadRecettes(this.currentPage);
      }
    }
  

  openModal(recette?: any): void {
    
    if (recette) {
      this.currentRecette = recette;
      
      this.recetteForm.patchValue({
        chauffeur: recette.chauffeur.id,
        date: recette.date,
        montant: recette.montant
      });
    } else {
      this.currentRecette = null;
      this.recetteForm.reset();
    }
    this.modalOpen = true;
  }

  closeModal(): void {
    this.recetteForm.reset();
    this.modalOpen = false;
  }

  onSubmit() {
    if (this.recetteForm.valid) {
      const formData = this.recetteForm.value;
      if (this.currentRecette) {
        this.recetteService.updateRecette(this.currentRecette.id, formData).subscribe(() => {
          this.loadRecettes();
          this.closeModal();
        });
      } else {
        console.log(formData);
        
        this.recetteService.createRecette(formData).subscribe(() => {
          
          this.loadRecettes();
          this.closeModal();
        });
      }
    }
  }

  deleteRecette(id: number): void {
    
    if (confirm('Voullez vous continuez?')) {
      this.recetteService.deleteRecette(id).subscribe({
        next : ()=>{
          this.loadRecettes()
        },
        error : (error) =>{
          if(error.status == 403)  alert(`Impossible vous n'avez pas les autorisations de supprimer \n Erreur : ${error.status } - ${error.statusText}`)
          return
        }
      });
    }
  }

 

}

