import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { UserListeComponent } from './Utilisateur/user-liste/user-liste.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RecetteListeComponent } from './Recette/recette-liste/recette-liste.component';
import { EntretienListeComponent } from './Entretien/entretien-liste/entretien-liste.component';
import { ContratComponent } from './Contrat/contrat-liste/contrat-liste.component';
import { PanneListeComponent } from './Panne/panne-liste/panne-liste.component';
import { InterceptorModule } from './Intercepteur/intercepteur.module';
import { AuthInterceptor } from './Intercepteur/intercepteur';
import { LayoutComponent } from './layout/layout.component';
import { MotoComponent } from './Moto/moto-liste/moto-liste.component';
import { HomeComponent } from './Home/home/home.component';
import { ChauffeurComponent } from './Chauffeur/chauffeur/chauffeur.component';

@NgModule({
  declarations: [
    AppComponent,
    UserListeComponent,
    DashboardComponent,
    MotoComponent,
    RecetteListeComponent,
    EntretienListeComponent,
    ContratComponent,
    PanneListeComponent,
    LayoutComponent,
    HomeComponent,
    ChauffeurComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    InterceptorModule,
  ],
  providers: [
    {
      provide : HTTP_INTERCEPTORS,
      useClass : AuthInterceptor,
      multi : true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
