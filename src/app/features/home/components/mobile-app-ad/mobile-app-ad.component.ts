import { Component } from '@angular/core';

@Component({
  selector: 'app-mobile-app-ad',
  templateUrl: './mobile-app-ad.component.html',
  styleUrl: './mobile-app-ad.component.scss'
})
export class MobileAppAdComponent {


  openStore(type: 'android' | 'ios') {
  if (type === 'android') {
    window.open('https://play.google.com/store/apps/details?id=com.caxita.ejazza_travels', '_blank');
  } else if (type === 'ios') {
    window.open('https://apps.apple.com/eg/app/ejazza-travels/id1032695334', '_blank');
  }
}

}
