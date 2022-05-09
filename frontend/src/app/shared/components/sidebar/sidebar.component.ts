import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @Output() sidenavClose = new EventEmitter();
  userIsAuthenticated = false;
  userRole ;
  private authListenerSubs: Subscription;

  constructor(private authService:AuthService) {
    this.userIsAuthenticated = this.authService.getIsAuth();  
  this.authService.getAuthStatusListener().subscribe( isAuthenticated =>{
    this.userIsAuthenticated = isAuthenticated;
  });
}

  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getIsAuth();
    if (this.userIsAuthenticated) {
      this.userRole = this.authService.getAuthData().role;
    }
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }


  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }

  public onSidenavClose = () => {
    this.sidenavClose.emit();
  }

}
