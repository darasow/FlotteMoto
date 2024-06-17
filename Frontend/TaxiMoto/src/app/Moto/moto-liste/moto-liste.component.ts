import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MotoService } from '../moto.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Moto } from 'src/app/interface/Moto';

@Component({
  selector: 'app-moto',
  templateUrl: './moto-liste.component.html',
  styleUrls: ['./moto-liste.component.css']
})
export class MotoComponent implements OnInit {
  showModal: boolean = false;
  motos: any[] = [];
  paginateMotos: Moto[] = [];
  selectedMoto: any;
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 0;
  motoForm: FormGroup;
  isEditMode: boolean = false; // Variable pour suivre l'état de l'édition
  currentUser: any;
  user: any;

  constructor(private authService: AuthService,private motoService: MotoService, private fb: FormBuilder) {
    this.motoForm = this.fb.group({
      numero_serie: ['', Validators.required],
      couleur: ['', Validators.required],
      date_achat: [''],
      // Ajouter d'autres champs si nécessaire
    });
  }

  ngOnInit(): void {
    this.getMotos();
    this.currentUser = this.authService.currentUserValue;
    if (this.currentUser) {
        this.user = this.currentUser.user;
    }
}


  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedMoto = null;
    this.motoForm?.reset();
  }

  getMotos(page : number = 1): void {
    this.motoService.getMotos(page, this.itemsPerPage).subscribe({
      next: (response) => {
        this.motos = response.results;
        this.totalPages = Math.ceil(response.count / this.itemsPerPage); // Ajustez en fonction de votre pagination côté serveur
        this.updatePagination()
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  createMoto(): void {
    if (this.motoForm?.valid) {
      this.motoService.createMoto(this.motoForm.value).subscribe({
        next: () => {
          this.closeModal();
          this.getMotos();
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
  }

  updateMoto(): void {
    if (this.motoForm?.valid) {
      const motoId = this.selectedMoto.id;
      this.motoService.updateMoto(motoId, this.motoForm.value).subscribe({
        next: () => {
          this.isEditMode = false
          this.closeModal();
          this.getMotos();
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
  }

  editMoto(moto: any): void {
    this.selectedMoto = moto;
    this.motoForm?.patchValue({
      numero_serie: moto.numero_serie,
      couleur: moto.couleur,
      date_achat: moto.date_achat
    });
    this.isEditMode = true; // Définir l'état de l'édition sur true
    this.openModal();
  }

  deleteMoto(motoId: number): void {
    if (confirm("Voullez vous continuez ?")) {
      this.motoService.deleteMoto(motoId).subscribe({
        next: () => {
          this.getMotos();
        },
        error : (error) =>{
         if(error.status == 403) alert(`Impossible vous n'avez pas les autorisations de supprimer \n Erreur : ${error.status } - ${error.statusText}`)
        }
      });
    }
  }

  get formControls() {
    return this.motoForm?.controls;
  }

  updatePagination() {
    this.paginateMotos = this.motos
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getMotos(this.currentPage);
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getMotos(this.currentPage);
    }
}


}
