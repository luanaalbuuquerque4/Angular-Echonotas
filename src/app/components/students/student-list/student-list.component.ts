import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { Student } from '../../../models/student.model';
import { StudentService } from '../../../services/student.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf, DatePipe],
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss']
})
export class StudentListComponent implements OnInit {
  students: Student[] = [];
  filteredStudents: Student[] = [];
  message: string = '';
  messageType: string = '';
  searchQuery: string = '';

  constructor(
    private studentService: StudentService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadStudents();
    
    // Subscribe to query param changes to handle search
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['search'] || '';
      this.filterStudents();
    });
  }

  loadStudents(): void {
    this.studentService.getStudents().subscribe({
      next: (data) => {
        this.students = data;
        this.filterStudents();
      },
      error: (e) => {
        this.showMessage('Error loading students', 'danger');
        console.error(e);
      }
    });
  }

  filterStudents(): void {
    if (!this.searchQuery) {
      this.filteredStudents = [...this.students];
      return;
    }
    
    const query = this.searchQuery.toLowerCase();
    this.filteredStudents = this.students.filter(student => 
      student.name.toLowerCase().includes(query) ||
      student.email.toLowerCase().includes(query) ||
      student.course.toLowerCase().includes(query) ||
      student.year.toString().includes(query)
    );
  }

  deleteStudent(id: number): void {
    if (confirm('Are you sure you want to delete this student?')) {
      this.studentService.deleteStudent(id).subscribe({
        next: () => {
          this.loadStudents();
          this.showMessage('Student deleted successfully', 'success');
        },
        error: (e) => {
          this.showMessage('Error deleting student', 'danger');
          console.error(e);
        }
      });
    }
  }

  showMessage(msg: string, type: string): void {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
    }, 3000);
  }
}