import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContratService } from '../contrat.service';
import { AuthService } from 'src/app/auth/auth.service';
import { dateRangeValidator, extractErrorMessages } from 'src/app/Util/Util';
import { UtilisateurService } from 'src/app/Utilisateur/utilisateur.service';
import { MotoService } from 'src/app/Moto/moto.service';
import { BehaviorSubject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

@Component({
  selector: 'app-contrat-liste',
  templateUrl: './contrat-liste.component.html',
  styleUrls: ['./contrat-liste.component.css']
})
export class ContratComponent implements OnInit {
  contrats: any[] = [];
  paginateContrats: any[] = [];
  chauffeurs: any[] = [];
  motos: any[] = []; 
  showModal = false;
  isEditMode = false;
  isMontantInitialDisabled: boolean = true;
  currentPage = 1;
  totalPages = 0;
  itemsPerPage = 5
  selectedContratId: number | null = null;
  contratForm: FormGroup
  currentUser: any;
  user: any;
  selectedContrat : any
  selectedChauffeurEncours : any
  isMontantInitialEnabled: boolean = false;
  errorMessages : string[] = []
  searchQuery: string = '';
  selectedFilter: string = 'All';
  searchSubject: BehaviorSubject<any>;

  constructor(private authService : AuthService, private utilisateurService : UtilisateurService, private motoService : MotoService,  private contratService: ContratService, private fb: FormBuilder) {
    this.searchSubject = new BehaviorSubject<any>({ query: this.searchQuery, filter: this.selectedFilter });
    this.contratForm = this.fb.group({
      chauffeur: ['', Validators.required],
      moto: ['', Validators.required],
      type_contrat: ['', Validators.required],
      montant_initial: [
        { value: null, 
          disabled: !this.isMontantInitialEnabled },
      ],
      montant_journalier: [
       
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]{1,8}(?:\\.[0-9]{1,2})?$') // 8 chiffres partie entiere, 2 chiffres parti decimale
        ]
      ],
      date_debut: ['', Validators.required],
      date_fin: ['', Validators.required],
      etat: ['', Validators.required]
    }, { validators: dateRangeValidator() });

    // Observer les changements du champ type_contrat
    this.contratForm.get('type_contrat')?.valueChanges.subscribe((value) => {
      this.onTypeContratChange(value);
    });
    // Observer les changements du champ date_debut
    this.contratForm.get('date_debut')?.valueChanges.subscribe(() => {
      this.contratForm.get('date_fin')?.updateValueAndValidity();
    });
    // Observer les changements du champ date_fin
    this.contratForm.get('date_fin')?.valueChanges.subscribe(() => {
      this.contratForm.get('date_debut')?.updateValueAndValidity();
    });

  }

   get formControls() {
    return this.contratForm.controls;
  }
  ngOnInit(): void {
    this.listeContrat();
    this.currentUser = this.authService.currentUserValue;
    if (this.currentUser) {
        this.user = this.currentUser.user;
    }
  }

  onSearchChange() {
    this.searchSubject.next({ query: this.searchQuery, filter: this.selectedFilter });
    this.searcheEvent()
  }
  searcheEvent()
  {
    this.searchSubject.pipe(
      // debounceTime(300), // Attendre 300ms après chaque frappe
      distinctUntilChanged(), // Éviter les recherches identiques consécutives
      switchMap(params => this.contratService.searchContrat(params.query, params.filter, this.currentPage, this.itemsPerPage))
    ).subscribe({
      next: (response) => {
        this.contrats = response.results;        
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


  listeContrat(page : number = 1) {
    this.contratService.getAllContrats().subscribe({
      next: (response) => {
        this.contrats = response.results;
        this.totalPages = Math.ceil(response.count / this.itemsPerPage); // Ajustez en fonction de votre pagination côté serveur
        this.updatePagination()
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  onSubmit() {
    if (this.contratForm?.valid) {
      const contratData = { ...this.contratForm?.value };
  
      // Vérifier si le type de contrat est 'credit'
      if (contratData.type_contrat === 'credit') {
        // Envoyer toutes les données, y compris le montant initial
        if (this.isEditMode && this.selectedContratId !== null) {
          this.updateContrat(this.selectedContratId, contratData);
        } else {
          this.createContrat(contratData);
        }
      } else {
        // Le type de contrat n'est pas 'credit', mettre montant_initial à null
        contratData.montant_initial = null;
  
        if (this.isEditMode && this.selectedContratId !== null) {
          // Mise à jour du contrat sans le montant initial
          this.updateContrat(this.selectedContratId, contratData);
        } else {
          // Création du contrat sans le montant initial
          this.createContrat(contratData);
        }
      }
    }else
    {
      alert("Assurez vous de remplire tout les champs obligatoire")
    }
  }
  
  createContrat(contratData: any) {
    this.contratService.addContrat(contratData).subscribe({
      next: () => {
        this.listeContrat();
        this.closeModal();
        this.errorMessages = []
      },
      error: (err) => {
        this.errorMessages = extractErrorMessages(err)
      }
    });
  }

  updateContrat(contratId: number, contratData: any) {
    const { chauffeur, moto, ...restData } = contratData;
    const chauffeurId = chauffeur; 
    const motoId = moto; 
       
    if (chauffeurId && motoId) {
      const updatedContratData = {
        ...restData,
        chauffeur: chauffeurId,
        moto: motoId
      };
  
      this.contratService.updateContrat(contratId, updatedContratData).subscribe({
        next: () => {
          this.listeContrat();
          this.closeModal();
          this.errorMessages = []
        },
        error: (err) => {
          this.errorMessages = extractErrorMessages(err)
        }
      });
    } else {
      console.error('Both chauffeur and moto fields are required.'); // Handle error appropriately
    }
  }
  
  onTypeContratChange(typeContrat: string): void {
    if (typeContrat === 'credit') {
      this.isMontantInitialEnabled = true;
      this.contratForm.get('montant_initial')?.enable();
      this.contratForm.get('montant_initial')?.setValidators( [
        Validators.required,
        Validators.pattern('^[0-9]{1,8}(?:\\.[0-9]{1,2})?$') // 8 chiffres partie entiere, 2 chiffres parti decimale
      ]);
    } else {
      this.isMontantInitialEnabled = false;
      this.contratForm.get('montant_initial')?.disable();
      this.contratForm.get('montant_initial')?.clearValidators();
    }
    this.contratForm.get('montant_initial')?.updateValueAndValidity();
  }

   editContrat(contrat: any) {
    this.isEditMode = true;
    this.selectedContratId = contrat.id;
    this.selectedContrat = contrat

    this.updateFormValues(contrat)
    this.openModal(contrat)
  }
  
  updateFormValues(contrat: any) {
    if (contrat.chauffeur) {
        this.contratForm?.patchValue({
            chauffeur: contrat.chauffeur.id,
            moto: contrat.moto.id,
            type_contrat: contrat.type_contrat,
            montant_initial: contrat.montant_initial,
            montant_journalier: contrat.montant_journalier,
            date_debut: contrat.date_debut,
            date_fin: contrat.date_fin,
            etat: contrat.etat,
        });
    }
}

  deleteContrat(contratId: number) {
    if(confirm("Voullez vous continuez?"))
    {
      this.contratService.deleteContrat(contratId).subscribe({
        next: () => {
          this.listeContrat();
        },
        error: (error) => {
          if(error.status == 403)  alert(`Impossible vous n'avez pas les autorisations de supprimer \n Erreur : ${error.status } - ${error.statusText}`)
        }
      });
    }
   
  }

  getChauffeurLibre(contrat : any = null)
  {
    this.utilisateurService.getChauffeursLibre().subscribe({
      next: (response) =>{
        this.chauffeurs = response
        if(contrat) {
            if (!this.chauffeurs.find(c => c.id === contrat.chauffeur.id)) 
            {
                this.chauffeurs.push(contrat.chauffeur);
            }
           
        }

      },
      error : (err) =>{
          console.log(err);
      }
    })
    
  }

  getMotosLibre(contrat : any = null)
  {
    this.motoService.getMotosLibre().subscribe({
      next : (response) =>{
        this.motos = response
        if(contrat) {
           // Ajoute moto sans doublon
           if (!this.motos.find(m => m.id === contrat.moto.id))
           {
              this.motos.push(contrat.moto);
          }
        }
      },
      error : (err) =>{
        console.log(err);
      }
    })
  }
  
  openModal(contrat : any = null) {
    this.getChauffeurLibre(contrat)
    this.getMotosLibre(contrat)
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.isEditMode = false;
    this.selectedContratId = null;
    this.contratForm.reset();
    
  }
  updatePagination() {
    this.paginateContrats = this.contrats
  }
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.listeContrat(this.currentPage); // Re-fetch the data for the new page
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.listeContrat(this.currentPage); // Re-fetch the data for the new page
    }
  }

}
