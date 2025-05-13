import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Student } from '../models/student.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = 'http://localhost:3000/students';

  constructor(private http: HttpClient) { }

  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.apiUrl);
  }

  getStudent(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/${id}`);
  }

  // New method to get the next ID
  getNextId(): Observable<number> {
    return this.http.get<Student[]>(this.apiUrl).pipe(
      map(students => {
        const maxId = students.reduce((max, student) => 
          student.id! > max ? student.id! : max, 0);
        return maxId + 1;
      })
    );
  }

  addStudent(student: Student): Observable<Student> {
    return this.http.post<Student>(this.apiUrl, student);
  }

  updateStudent(student: Student): Observable<Student> {
    return this.http.put<Student>(`${this.apiUrl}/${student.id}`, student);
  }

  deleteStudent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
  // New method for search functionality
  searchStudents(term: string): Observable<Student[]> {
    if (!term.trim()) {
      return this.getStudents();
    }
    
    return this.getStudents().pipe(
      map(students => students.filter(student => 
        student.name.toLowerCase().includes(term.toLowerCase()) ||
        student.email.toLowerCase().includes(term.toLowerCase()) ||
        student.course.toLowerCase().includes(term.toLowerCase())
      ))
    );
  }
}