import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { StudentListComponent } from './components/students/student-list/student-list.component';
import { StudentAddComponent } from './components/students/student-add/student-add.component';
import { StudentEditComponent } from './components/students/student-edit/student-edit.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'students', component: StudentListComponent },
  { path: 'students/add', component: StudentAddComponent },
  { path: 'students/edit/:id', component: StudentEditComponent },
  { path: '**', redirectTo: '' }
];