import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-alert-component',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './alert-component.html',
  styleUrl: './alert-component.css'
})
export class AlertComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  
}