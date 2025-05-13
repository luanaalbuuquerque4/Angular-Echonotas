import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIf, NgClass } from '@angular/common';
import { StudentService } from '../../../services/student.service';
import { Student } from '../../../models/student.model';

@Component({
  selector: 'app-student-edit',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgIf, NgClass],
  templateUrl: './student-edit.component.html',
  styleUrls: ['./student-edit.component.scss']
})
export class StudentEditComponent implements OnInit {
  studentForm: FormGroup;
  studentId: number = 0;
  message: string = '';
  messageType: string = '';
  submitted: boolean = false;
  loading: boolean = true;

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private router: Router,
    private route: ActivatedRoute
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

  ngOnInit(): void {
    this.studentId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadStudent();
  }

  loadStudent(): void {
    this.studentService.getStudent(this.studentId).subscribe({
      next: (data) => {
        // Format the date as YYYY-MM-DD for the input field
        const formattedData = {
          ...data,
          enrollmentDate: new Date(data.enrollmentDate).toISOString().split('T')[0]
        };
        this.studentForm.patchValue(formattedData);
        this.loading = false;
      },
      error: (e) => {
        this.showMessage('Error loading student', 'danger');
        console.error(e);
        this.loading = false;
      }
    });
  }

  get f() { return this.studentForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.studentForm.invalid) {
      return;
    }
    
    const student: Student = this.studentForm.value;
    
    this.studentService.updateStudent(student).subscribe({
      next: () => {
        this.showMessage('Student updated successfully', 'success');
        setTimeout(() => {
          this.router.navigate(['/students']);
        }, 2000);
      },
      error: (e) => {
        this.showMessage('Error updating student', 'danger');
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