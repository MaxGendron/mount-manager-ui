import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  username: string;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.username = this.authService.currentUserValue.username
  }

  logout(): void {
    this.authService.logout();
  }
}
