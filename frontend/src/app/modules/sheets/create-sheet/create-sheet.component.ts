import { Component, OnInit } from '@angular/core';
import { Sheet } from 'src/app/common/sheet'; 
import { Router } from '@angular/router'; 
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs'; 
import { SheetsService } from 'src/app/services/sheets.service';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/common/User';

@Component({
  selector: 'app-create-sheet',
  templateUrl: './create-sheet.component.html',
  styleUrls: ['./create-sheet.component.css']
})
export class CreateSheetComponent implements OnInit {

  userIsAuthenticated = false;
  doctors:User[] = [];
  sheets:Sheet[] = [];
  sheet: Sheet = new Sheet(); 
  submitted = false;
  registerForm: FormGroup;
  graterThanZero : boolean;
  creating:boolean = false;

  constructor(
    private authService:AuthService,
    private sheetService: SheetsService,
    private router: Router,
    //public dialogRef : MatDialogRef<CreateSheetComponent>, 
    private formBuilder: FormBuilder) {
      this.userIsAuthenticated = this.authService.getIsAuth(); // to make sure authentication(token-check) runs first  before loading the component
      this.authService.getAuthStatusListener().subscribe( isAuthenticated =>{
        this.userIsAuthenticated = isAuthenticated;
      });
      this.authService.getDoctorsList().subscribe(docs => {
        this.doctors = docs['users'] as User[]; 
      })
     }

  ngOnInit() {
      this.registerForm = this.formBuilder.group({
          bloodpressure: ['', Validators.required],
          pulse: ['', Validators.required],
          weight: ['', Validators.required],
          height: ['', Validators.required],
          symptoms: [''],  
      });
      this.loadData();
  }

  loadData(){
    this.sheetService.getSheetList()
    .subscribe(res => {
      this.sheets = res['sheets'] as Sheet[];
    })
  }

  newSheet() : void{
    this.submitted = false;
  }


  save(){
    this.creating = true;
    console.log(this.sheet);
    
    this.sheetService.createSheet(this.sheet)
      .subscribe(data => {
        this.gotolist();
        }, error => { this.onClose(); this.gotolist();});
  }

  onSubmit() {
    if (this.registerForm.invalid) {
        return;
    }
    this.submitted = true;
    this.save();
  }

  onClose(){
   this.creating = false; 
  }

  gotolist(){
    this.router.navigate(['/sheets']);
  }
}
