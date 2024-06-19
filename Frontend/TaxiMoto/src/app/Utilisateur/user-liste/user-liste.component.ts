import { Component, OnInit } from '@angular/core';
import { UtilisateurService } from '../utilisateur.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Utilisateur } from 'src/app/interface/Utilisateur';
import {extractErrorMessages} from 'src/app/Util/Util';
@Component({
  selector: 'app-user-liste',
  templateUrl: './user-liste.component.html',
  styleUrls: ['./user-liste.component.css']
})
export class UserListeComponent implements OnInit {
  utilisateurs: any[] = [];
  paginatedUtilisateurs: any[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 0;
  showModal = false; 
  userForm: FormGroup;
  utilisateur : Utilisateur | null | undefined 
  isEditMode: boolean = false;
  currentUser: any;
  user: any;
  errorMessages : string[] = []

  constructor(private fb: FormBuilder, private route: ActivatedRoute ,
    private utilisateurService: UtilisateurService, private router: Router, private authService: AuthService) {
      this.userForm = this.fb.group({
        username: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        first_name: ['', [Validators.required]],
        last_name: ['', [Validators.required]],
        type_utilisateur: ['', [Validators.required]],
        telephone: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
        adresse: ['', [Validators.required]],
        password: [''], // Champs mot de passe non requis initialement
        confirm_password: ['']
      }, { validators: this.passwordMatchValidator });
      
     }
     openModal() {
      this.showModal = true;
      
    }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    this.user = this.currentUser.user
    this.getUtilisateurs();
  }
  addPasswordValidators() {
    this.userForm.controls['password'].setValidators([Validators.required, Validators.minLength(6)]);
    this.userForm.controls['confirm_password'].setValidators([Validators.required]);
    this.userForm.updateValueAndValidity();
  }
  
  removePasswordValidators() {
    this.userForm.controls['password'].clearValidators();
    this.userForm.controls['confirm_password'].clearValidators();
    this.userForm.updateValueAndValidity();
  }
  
  getUtilisateurs(page: number = 1): void {
    this.utilisateurService.getUtilisateurs(page, this.itemsPerPage).subscribe({
      next: (response) => {
        this.utilisateurs = response.results;
        this.totalPages = Math.ceil(response.count / this.itemsPerPage);
        this.currentPage = page;
        this.updatePagination();
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

 
  updatePagination(): void {
    this.paginatedUtilisateurs = this.utilisateurs;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getUtilisateurs(this.currentPage);
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getUtilisateurs(this.currentPage);
    }
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirm_password');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else {
      confirmPassword?.setErrors(null);
    }
  }
  
  onEdit(utilisateur: Utilisateur) {
    this.isEditMode = true; // Activer le mode édition
    this.utilisateur = utilisateur; // Stocker l'utilisateur à éditer
  
    // Pré-remplir le formulaire avec les données de l'utilisateur sélectionné
    this.userForm.patchValue({
      username: utilisateur.username,
      email: utilisateur.email,
      password : utilisateur.password,
      confirm_password : utilisateur.password,
      first_name: utilisateur.first_name,
      last_name: utilisateur.last_name,
      type_utilisateur: utilisateur.type_utilisateur,
      telephone: utilisateur.telephone,
      adresse: utilisateur.adresse
    });
  
    // Ouvrir la modal pour permettre la modification
    this.openModal();
  }
  
  onUpdate() {
    if (this.userForm.valid && this.utilisateur) {
      // Filtrer les champs non 
      const { confirm_password, password, ...userData } = this.userForm.value;
      if (password) {
        userData['password'] = password;
      }
    //  delete userData.password      
      this.utilisateurService.updateUtilisateur(this.utilisateur.id, userData).subscribe({
        next: () => {
          this.closeModal();
          this.getUtilisateurs();
          this.router.navigate(['/utilisateurs']);
          this.isEditMode = false
          this.errorMessages = []; // Clear previous errors

        },
        error: (err) => {
          this.errorMessages = extractErrorMessages(err);
        }
      });
    }
  }
  
  // Méthode pour fermer la modal
  closeModal() {
    this.userForm.reset()
    this.errorMessages = []
    this.showModal = false;
  }

  onDelete(id: number) {
 
    if (confirm('Voullez vous continuez?')) {
      this.utilisateurService.deleteUtilisateur(id).subscribe({
        next: () => {
          this.utilisateurs = this.utilisateurs.filter(user => user.id !== id);
          this.updatePagination();
        },
        error: (error) => {
          if(error.status == 403)  alert(`Impossible vous n'avez pas les autorisations de supprimer \n Erreur : ${error.status } - ${error.statusText}`)
        }
      });
    }
  }

  onSubmit() {
    if (this.userForm.valid) {
      const { confirm_password, ...userData } = this.userForm.value;
      this.utilisateurService.createUtilisateur(userData).subscribe({
        next: () => {
          this.closeModal();
          this.userForm.reset();
          this.getUtilisateurs();
          this.errorMessages = []; // Clear previous errors
        },
        error: (err) => {
          this.errorMessages = extractErrorMessages(err);
        }
      });
    }
  }
  



  get formControls() {
    return this.userForm.controls;
  }

}
