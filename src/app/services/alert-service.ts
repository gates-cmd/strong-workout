import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertComponent } from '../components/alert-service/alert-component';
import { AlertConfirmComponent } from '../components/alert-confirm-component/alert-confirm-component';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  constructor(private dialog: MatDialog) {}

  openDialog(text: string) {
    this.dialog.open(AlertComponent, {
      width: '250px',
      data: { message: text }
    });
  }

  openConfirmDialog(text: string) {
      const dialogRef = this.dialog.open(AlertConfirmComponent, {
      width: '250px',
      data: { message: text }
    });

    return dialogRef.afterClosed();
  }
}