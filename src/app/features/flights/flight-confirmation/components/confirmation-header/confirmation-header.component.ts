import { Component, inject } from '@angular/core';
import { IMainButton } from '../../../../../shared/models/flights/mainButton.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-confirmation-header',
  templateUrl: './confirmation-header.component.html',
  styleUrl: './confirmation-header.component.scss',
})
export class ConfirmationHeaderComponent {
  hgNumber!:string;
    private route = inject(ActivatedRoute);
  
  printButton: IMainButton = {
    title: 'Email E-ticket',
    height: '42px',
    width: 'none',
    borderRadius: '12px',
  };

  sendMailButton: IMainButton = {
    title: 'print',
    height: '42px',
    width: 'none',
    borderRadius: '12px',
  };
ngOnInit():void{
  this.hgNumber=this.route.snapshot.queryParamMap.get('HG')!;
}
  onPrintTicket(): void {
    window.print();
  }

  onSendMail(): void {
    // Logic for sending the ticket via email
  }
}
