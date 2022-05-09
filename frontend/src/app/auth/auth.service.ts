import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Auth } from './auth';
import { Observable, Subject } from "rxjs"; 
import { User } from '../common/User';

const baseURL = environment.API_URL + 'auth';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private userId: string;
  private tokenTimer: any; //to clear timer on logout and clear token data
  private authStatusListener = new Subject<boolean>(); // to push authentation informmation to commponents/ boolean authenticated/or not

  constructor( private httpClient :HttpClient, private http: HttpClient, private router: Router ) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable(); // so we emit from within the service, and listen fromm other parts of app
  }

  createUser(email: string, password: string, name: string, birthdate: string, birthplace: string, phone: string) {
    const authData: Auth = { email: email, password: password, name:name, birthdate:birthdate, birthplace:birthplace, phone:phone};
    this.http
      .post<any>(`${baseURL}/signup`, authData)
      .subscribe(response => {
        this.router.navigate(["/"]);
      });
  }

  login(email: string, password: string) {
    const authData: Auth = { email: email, password: password };
    this.http
      .post<{ token: string; expiresIn: number, userId:string, role:string, email:string }>(
        `${baseURL}/login`,
        authData
      )
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.authStatusListener.next(true); 
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
         
          this.saveAuthData(token, expirationDate, response.userId, response.role, response.email );
          this.router.navigate(["/"]); // redirect users home after login
        }else{ 
          
        }
      });
  }

  // check if token available
  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.userId = authInformation.userId;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(["/login"]);
  }

  private setAuthTimer(duration: number) {
    console.log("Setting timer: " + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId:string, role:string, email:string) {
    localStorage.setItem("token", token); // save token to stay logged in on page refresh
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("userId", userId);
    localStorage.setItem("role", role);
    localStorage.setItem("email", email); 
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
  }

  public getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    const role = localStorage.getItem("role"); 
    const email = localStorage.getItem("email");
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId:userId,
      role:role, 
      email:email
    }
  }

  
  public getDoctorsList():Observable<User[]> {
    return this.httpClient.get<User[]>(`${baseURL}/doctors`);
  }

}
