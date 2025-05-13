import { Component, EventEmitter, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  searchQuery: string = '';
  
  constructor(private router: Router) {}
  
  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/students'], { 
        queryParams: { search: this.searchQuery.trim() } 
      });
    } else {
      this.router.navigate(['/students']);
    }
  }
}