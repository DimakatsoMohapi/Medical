import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service'; 

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit { 
  displayedColumns: string[] = ['message', 'createdAt'];
  userIsAuthenticated = false;
  userActive='no user status found';
  constructor(private authService:AuthService) {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authService.getAuthStatusListener().subscribe( isAuthenticated =>{
      this.userIsAuthenticated = isAuthenticated;
    });
  }

  ngOnInit() {
    if (this.userIsAuthenticated) { 
    }
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.loadData();
  }

  loadData(){
     
  }


   
  public executeSelectedChange = (event) => {
    console.log(event);
  }
}
