import { Routes } from '@angular/router';
import { LoginScreen } from './user-module/login-screen/login-screen';
import { NewUserScreen } from './user-module/new-user-screen/new-user-screen';
import { NotesScreen } from './notes-screen/notes-screen';

export const routes: Routes = [{path:"login-screen", loadComponent:()=>LoginScreen}, {path:"newUser", loadComponent:()=>NewUserScreen},  {path:"Central", loadComponent:()=>NotesScreen}];