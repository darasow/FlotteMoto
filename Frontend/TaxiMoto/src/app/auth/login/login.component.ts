import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Utilisateur } from 'src/app/interface/Utilisateur';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  message: string | undefined;
  user: Utilisateur | null = null;
  reponse: any | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router : Router
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }
    this.login();
  }

  login() {
    this.authService.login(this.loginForm.value.username, this.loginForm.value.password)
      .subscribe({
        next: (response) => {
          this.reponse = response; 
          this.user = this.reponse.user; 
           if(this.user?.type_utilisateur == "chauffeur")
           {
             this.router.navigateByUrl('chauffeur')

           }else{

             this.router.navigateByUrl('home')
           }
          
        },
        error: (error) => {
          console.log(error);
          
          this.message = "Identifiant ou mot de passe incorrect";
        }
      });
  }
}