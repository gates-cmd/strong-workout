import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-alert-confirm-component',
  imports: [MatDialogModule],
  templateUrl: './alert-confirm-component.html',
  styleUrl: './alert-confirm-component.css',
})
export class AlertConfirmComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
