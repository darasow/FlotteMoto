import { Component, OnInit } from '@angular/core';
import { Panne } from 'src/app/interface/Panne';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PanneService } from '../panne.service';
import { MotoService } from 'src/app/Moto/moto.service';
import { Moto } from 'src/app/interface/Moto';
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
  paginatedPannes: Panne[] = [];

  constructor(
    private panneService: PanneService,
    private motoService: MotoService, // Service pour Moto
    private fb: FormBuilder
  ) {
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
        this.panneService.updatePanne(this.selectedPanne.id!, formData).subscribe(() => {
          this.loadPannes();
          this.closeModal();
        });
      } else {
        this.panneService.createPanne(formData).subscribe(() => {
          this.loadPannes();
          this.closeModal();
        });
      }
    }
  }

  deletePanne(id: number) {
    if(confirm("Voullez vous supprimer?"))
    {
      this.panneService.deletePanne(id).subscribe({
        next : () =>{
          this.loadPannes
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
