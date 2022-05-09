import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment'; 
import { Observable, Subject } from "rxjs";
import { Sheet } from '../common/sheet';
import { Profile } from '../common/profile';

const baseURL = environment.API_URL + 'profile';
 

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private httpClient :HttpClient) { }
   
  getProfile(): Observable<Profile> {
    return this.httpClient.get<Profile>(`${baseURL}/`);
  }

}
