// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MotoComponent } from './Moto/moto-liste/moto-liste.component';
import { RecetteListeComponent } from './Recette/recette-liste/recette-liste.component';
import { UserListeComponent } from './Utilisateur/user-liste/user-liste.component';
import { AuthGuard } from './auth/auth.guard';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './auth/login/login.component';
import { ContratComponent } from './Contrat/contrat-liste/contrat-liste.component';
import { RoleComponent } from './role/role.component';
import { PanneListeComponent } from './Panne/panne-liste/panne-liste.component';
import { EntretienListeComponent } from './Entretien/entretien-liste/entretien-liste.component';
import { HomeComponent } from './Home/home/home.component';
import { ChauffeurComponent } from './Chauffeur/chauffeur/chauffeur.component';

const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirection par défaut
  { path: 'logout', redirectTo: "/login", pathMatch : 'full' },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'chauffeur', component: ChauffeurComponent, canActivate: [AuthGuard] },
  { path: '', component: LayoutComponent, children: [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'utilisateurs', component: UserListeComponent },
    { path: 'moto', component: MotoComponent },
    { path: 'recette', component: RecetteListeComponent },
    { path: 'panne', component: PanneListeComponent },
    { path: 'contrat', component: ContratComponent },
    { path: 'entretien', component: EntretienListeComponent},
    { path: 'roles', component: RoleComponent},  // Route pour lister les rôles
  ], canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/login', pathMatch: 'full' }, // Pour gérer les routes inconnues
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
