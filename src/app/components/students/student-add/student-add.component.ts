import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIf, NgClass } from '@angular/common';
import { StudentService } from '../../../services/student.service';
import { Student } from '../../../models/student.model';

@Component({
  selector: 'app-student-add',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgIf, NgClass],
  templateUrl: './student-add.component.html',
  styleUrls: ['./student-add.component.scss']
})
export class StudentAddComponent {
  studentForm: FormGroup;
  message: string = '';
  messageType: string = '';
  submitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private router: Router
  ) {
    this.studentForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      course: ['', Validators.required],
      year: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      enrollmentDate: ['', Validators.required]
    });
  }

  get f() { return this.studentForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.studentForm.invalid) {
      return;
    }
    
    // Get next available ID before saving
    this.studentService.getNextId().subscribe({
      next: (nextId) => {
        const student: Student = {
          ...this.studentForm.value,
          id: nextId
        };
        
        this.studentService.addStudent(student).subscribe({
          next: () => {
            this.showMessage('Student added successfully', 'success');
            setTimeout(() => {
              this.router.navigate(['/students']);
            }, 2000);
          },
          error: (e) => {
            this.showMessage('Error adding student', 'danger');
            console.error(e);
          }
        });
      },
      error: (e) => {
        this.showMessage('Error generating student ID', 'danger');
        console.error(e);
      }
    });
  }
  
  showMessage(msg: string, type: string): void {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
    }, 3000);
  }
}