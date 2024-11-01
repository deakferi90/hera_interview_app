import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  standalone: true, // Mark this as a standalone component
  imports: [MatDialogModule, MatButtonModule], // Import Angular Material modules directly
})
export class ConfirmDialogComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>) {}

  onConfirm(): void {
    this.dialogRef.close(true); // Close dialog with 'true' as result
  }

  onCancel(): void {
    this.dialogRef.close(false); // Close dialog with 'false' as result
  }
}
