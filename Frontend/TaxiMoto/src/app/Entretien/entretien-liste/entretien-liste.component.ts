// entretien-liste.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EntretienService } from '../entretien.service';
import { MotoService } from 'src/app/Moto/moto.service';
import { Moto } from 'src/app/interface/Moto';
import { Entretien } from 'src/app/interface/Entretien';
import { extractErrorMessages } from 'src/app/Util/Util';

@Component({
  selector: 'app-entretien-liste',
  templateUrl: './entretien-liste.component.html',
  styleUrls: ['./entretien-liste.component.css']
})
export class EntretienListeComponent implements OnInit {
  entretiens: Entretien[] = [];
  motos: Moto[] = [];
  entretienForm: FormGroup;
  showModal: boolean = false;
  isEditMode: boolean = false;
  selectedEntretien: Entretien | null = null;
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 0;
  paginatedEntretiens: Entretien[] = [];
  errorMessages : string[] = []


  constructor(
    private entretienService: EntretienService,
    private motoService: MotoService,
    private fb: FormBuilder
  ) {
    this.entretienForm = this.fb.group({
      moto: ['', Validators.required],
      type_entretien: ['', Validators.required],
      date_entretien: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.loadEntretiens();
    this.loadMotos();
  }

  loadEntretiens(page : number = 1) {
    this.entretienService.getEntretiens(page, this.itemsPerPage).subscribe({
      next: (response) => {
        this.entretiens = response.results;
        this.totalPages = Math.ceil(response.count / this.itemsPerPage); // Adapter en fonction de la pagination côté serveur si nécessaire
        this.updatePagination();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  loadMotos() {
    this.motoService.getMotosEncontratTypeEmbauche().subscribe({
      next: (response) => {
        this.motos = response;
      },
      error: (err) => {
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
    this.selectedEntretien = null;
    this.entretienForm.reset();
  }

  editEntretien(entretien: Entretien) {
    this.selectedEntretien = entretien;
    this.isEditMode = true;
    this.entretienForm.patchValue({
      moto: entretien.moto.id,
      type_entretien: entretien.type_entretien,
      date_entretien: entretien.date_entretien,
      description: entretien.description
    });
    this.openModal();
  }

  onSubmit() {
    if (this.entretienForm.valid) {
      const formData = this.entretienForm.value;
      if (this.isEditMode && this.selectedEntretien) {
        this.entretienService.updateEntretien(this.selectedEntretien.id!, formData).subscribe( {
           next : () =>{
            this.loadEntretiens();
            this.closeModal();
            this.errorMessages = []
           },
           error : (error) =>{
              this.errorMessages = extractErrorMessages(error)
           }
        });
      } else {
        this.entretienService.createEntretien(formData).subscribe( {
          next : () =>{
            this.loadEntretiens();
            this.closeModal();
            this.errorMessages = []
           },
           error : (error) =>{
              this.errorMessages = extractErrorMessages(error)
           }
        });
      }
    }
  }

  deleteEntretien(id: number) {
    if(confirm("Voullez vous continuez ?"))
    {
      this.entretienService.deleteEntretien(id).subscribe({
        next : () => {
          this.loadEntretiens()
        },
        error: (error) => {
          if(error.status == 403)  alert(`Impossible vous n'avez pas les autorisations de supprimer \n Erreur : ${error.status } - ${error.statusText}`)
        }
      });

    }
  }

  get formControls() {
    return this.entretienForm.controls;
  }

  updatePagination() {
    this.paginatedEntretiens = this.entretiens
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadEntretiens(this.currentPage);
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadEntretiens(this.currentPage);
    }
  }
}
