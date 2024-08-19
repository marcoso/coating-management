import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Page404Component } from './authentication/page404/page404.component';
import { Roles } from './core/enums/roles';
import { AuthGuard } from './core/guard/auth.guard';
import { AuthLayoutComponent } from './layout/app-layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layout/app-layout/main-layout/main-layout.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: '/authentication/signin', pathMatch: 'full' },
	    {
        path: 'projects',
        loadChildren: () =>
          import('./projects/projects.module').then((m) => m.ProjectsModule),
          canActivateChild: [AuthGuard], data: { roles: [Roles.Administrator, Roles.ProjectManager, Roles.Inspector] }
      },      
	    {
        path: 'clients',
        loadChildren: () =>
          import('./clients/clients.module').then((m) => m.ClientsModule),
          canActivateChild: [AuthGuard], data: { roles: [Roles.Administrator, Roles.ProjectManager] }
      },
	    {
        path: 'users',
        loadChildren: () =>
          import('./users/users.module').then((m) => m.UsersModule),
          canActivateChild: [AuthGuard], data: { roles: [Roles.Administrator] }
      },
	    {
        path: 'configuration',
        loadChildren: () =>
          import('./configuration/configuration.module').then((m) => m.ConfigurationModule),
          canActivateChild: [AuthGuard], data: { roles: [Roles.Administrator] }
      },    
    ]
  },
  {
    path: 'authentication',
    component: AuthLayoutComponent,
    loadChildren: () =>
      import('./authentication/authentication.module').then(
        (m) => m.AuthenticationModule
      )
  },
  { path: '**', component: Page404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
