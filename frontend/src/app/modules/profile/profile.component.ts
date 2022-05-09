import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Profile } from 'src/app/common/profile';
import { ProfileService } from 'src/app/services/profile.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile:Profile;
  constructor(private profileService:ProfileService) { }

  ngOnInit() {
    this.loadData();
  }

  loadData(){
     this.profileService.getProfile()
    .subscribe(res => {
      this.profile = res['profile'] as Profile;
    })
  }

  formatToDate(date):string {
    const format = 'dd/MM/yyyy';
    const locale = 'en-US';
    return formatDate(date,format, locale)
  }

}
