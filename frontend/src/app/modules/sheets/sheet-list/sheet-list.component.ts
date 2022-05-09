import { Component, OnInit, ViewChild } from '@angular/core'; 
import { Sheet } from 'src/app/common/sheet';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort'; 
import { formatDate } from '@angular/common';
import { ProfileService } from 'src/app/services/profile.service';
import { AuthService } from 'src/app/auth/auth.service';
import { SheetsService } from 'src/app/services/sheets.service';
import { DialogService } from 'src/app/services/dialog.services';

@Component({
  selector: 'app-sheet-list',
  templateUrl: './sheet-list.component.html',
  styleUrls: ['./sheet-list.component.css']
})



export class SheetListComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  userIsAuthenticated = false;
  userRole='' ;
  userId='' ;
  sheets: Observable<Sheet[]>;
  displayedColumns: string[] = ['bloodpressure', 'pulse','weight','height','symptoms','entrydate','doctorName', 'patientName'];
  public dataSource = new MatTableDataSource<Sheet>()
  searchKey : String;

  constructor(
    private authService:AuthService,
    private profileService:ProfileService,
    private sheetService: SheetsService,
    private router: Router)   {}

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    if (this.userIsAuthenticated)  {
      this.userRole = this.authService.getAuthData().role;
      this.userId = this.authService.getAuthData().userId;
      this.loadData();
    }
  }
 

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = (data, filter) => {
      return this.displayedColumns.some(ele => {
        return ele != 'actions' && data[ele].toString().toLowerCase().indexOf(filter) != -1;
      });
    };
  }

  formatToDate(date):string {
    const format = 'dd/MM/yyyy';
    const locale = 'en-US';
    return formatDate(date,format, locale)
  }
  loadData(){
    this.sheetService.getSheetList()
    .subscribe(res => {
      this.dataSource.data = res['sheets'] as Sheet[];
    })
  }
/* 
 deleteSheet(id) {
     this.sheetService.removeSheet(id)
      .subscribe(
        data => {
          console.log(data);
        },
        error => console.log(error));
  } */

  sheetDetails(id){
    this.router.navigate(['details', id]);
  }

  onSearchClear(){
    this.searchKey="";
  }

  applyFilter(){
    this.dataSource.filter = this.searchKey.trim().toLowerCase();
  }

  onCreate(){
    this.router.navigate(["/sheets/new"]);
  }

  onEdit(id){
    //this.sheetService.setSession('UserId', id); 
    
  } 

  // onDelete(id: string){
  //   this.dialogService.openConfirmDialog('Are you sure to delete this record?')
  //   .afterClosed().subscribe(res =>{
  //     if(res){
  //       this.sheetService.removeSheet(id).subscribe(message=>{
  //         this.loadData();
  //         var msg = JSON.parse(message);
  //         this.notificationService.warn(msg.message);
  //       });
  //     }
  //   });
  // }

}
