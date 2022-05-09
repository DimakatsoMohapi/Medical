import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment'; 
import { Observable, Subject } from "rxjs";
import { Sheet } from '../common/sheet';

const baseURL = environment.API_URL + 'sheet';
const sheets:Sheet[] = [
 
];

@Injectable({
  providedIn: 'root'
})
export class SheetsService {

  constructor(private httpClient :HttpClient) { }

  getSheetList():Observable<Sheet[]> {
    return this.httpClient.get<Sheet[]>(`${baseURL}/mylist`);
  }

  createSheet(sheet:Sheet):Observable<Sheet> {
    return this.httpClient.post<Sheet>(`${baseURL}/`, sheet);
  }
  removeSheet(id):Observable<any> {
    let _id = id.replace(/[' "]+/g,'')
    return this.httpClient.delete(`${baseURL}/${_id}`, {responseType:"text"});
  }
}
