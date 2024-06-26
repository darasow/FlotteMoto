import { Component, OnInit } from '@angular/core';
import { Panne } from 'src/app/interface/Panne';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PanneService } from '../panne.service';
import { MotoService } from 'src/app/Moto/moto.service';
import { Moto } from 'src/app/interface/Moto';
import { extractErrorMessages } from 'src/app/Util/Util';
import { BehaviorSubject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

@Component({
  selector: 'app-panne-liste',
  templateUrl: './panne-liste.component.html',
  styleUrls: ['./panne-liste.component.css']
})
export class PanneListeComponent implements OnInit{
  pannes: Panne[] = [];
  motos: Moto[] = [];
  panneForm: FormGroup;
  showModal: boolean = false;
  isEditMode: boolean = false;
  selectedPanne: Panne | null = null;
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 0;
  searchQuery: string = '';
  selectedFilter: string = 'All';
  searchSubject: BehaviorSubject<any>;
  paginatedPannes: Panne[] = [];
  errorMessages : string[] = []

  constructor(
    private panneService: PanneService,
    private motoService: MotoService, // Service pour Moto
    private fb: FormBuilder
  ) {
    this.searchSubject = new BehaviorSubject<any>({ query: this.searchQuery, filter: this.selectedFilter });
    this.panneForm = this.fb.group({
      moto: ['', Validators.required],
      description: ['', Validators.required],
      date_signalement: ['', Validators.required],
      etat: ['non_corrigee', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadPannes();
    this.loadMotos(); // Charger les motos disponibles
  }

  onSearchChange() {
    this.searchSubject.next({ query: this.searchQuery, filter: this.selectedFilter });
    this.searcheEvent()
  }
  searcheEvent()
  {
    this.searchSubject.pipe(
      debounceTime(300), // Attendre 300ms après chaque frappe
      distinctUntilChanged(), // Éviter les recherches identiques consécutives
      switchMap(params => this.panneService.searchPannes(params.query, params.filter, this.currentPage, this.itemsPerPage))
    ).subscribe({
      next: (response) => {
        this.pannes = response.results;        
        this.totalPages = Math.ceil(response.count / this.itemsPerPage);
        this.updatePagination();
      },
      error: (err) => console.log(err)
    });
  }
  onSearch(event: Event) {
    event.preventDefault();
    this.onSearchChange();
  }

  loadPannes(page: number = 1) {
    this.panneService.getPannes(page, this.itemsPerPage).subscribe({
      next : (response) =>{
        this.pannes = response.results
        this.totalPages = Math.ceil(response.count / this.itemsPerPage); // Ajustez en fonction de votre pagination côté serveur
        this.updatePagination();

      },
      error: (err) =>{
        console.log(err);
      }
    });
  }
 
  // La liste des motos en contrat d'embauche en cours
  loadMotos() {
    this.motoService.getMotosEncontratTypeEmbauche().subscribe({
      next: (response) =>{
        this.motos = response
      },
      error: (err) =>{
        console.log(err);
        
      }
    });
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.isEditMode = false;
    this.selectedPanne = null;
    this.panneForm.reset({
      moto: '',
      description: '',
      date_signalement: '',
      etat: 'non_corrigee'
    });
  }

  editPanne(panne: Panne) {
    this.selectedPanne = panne;
    this.isEditMode = true;
    this.panneForm.patchValue({
      moto: panne.moto.id,
      description: panne.description,
      date_signalement: panne.date_signalement,
      etat: panne.etat
    });
    this.openModal();
  }

  onSubmit() {
    if (this.panneForm.valid) {
      const formData = this.panneForm.value;
      if (this.isEditMode && this.selectedPanne) {
        this.panneService.updatePanne(this.selectedPanne.id!, formData).subscribe( {
          next : ()=>{
            this.loadPannes();
            this.closeModal();
            this.errorMessages = []
          },
          error : (err) =>{
            this.errorMessages = extractErrorMessages(err)
          }
        });
      } else {
        this.panneService.createPanne(formData).subscribe( {
          next : ()=>{
            this.loadPannes();
            this.closeModal();
            this.errorMessages = []
          },
          error : (err) =>{
            this.errorMessages = extractErrorMessages(err)
          }
        });
      }
    }
  }

  deletePanne(id: number) {
    if(confirm("Voullez vous supprimer?"))
    {
      this.panneService.deletePanne(id).subscribe({
        next : () =>{
          this.loadPannes()
        },
        error : (error) =>{
          if(error.status == 403)  alert(`Impossible vous n'avez pas les autorisations de supprimer \n Erreur : ${error.status } - ${error.statusText}`)
        }
      });
    }
  }

  get formControls() {
    return this.panneForm.controls;
  }


  updatePagination() {
    this.paginatedPannes = this.pannes
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadPannes(this.currentPage);
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadPannes(this.currentPage);
    }
}

}
