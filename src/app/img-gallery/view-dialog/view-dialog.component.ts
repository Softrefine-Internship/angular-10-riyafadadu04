import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AddDialogComponent } from '../add-dialog/add-dialog.component';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { Image } from '../image.model';

@Component({
  selector: 'app-view-dialog',
  templateUrl: './view-dialog.component.html',
  styleUrls: ['./view-dialog.component.scss'],
})
export class ViewDialogComponent {
  image!: Image | null | undefined;

  constructor(
    @Optional() private dialogRef?: MatDialogRef<AddDialogComponent>,
    @Optional()
    @Inject(MAT_BOTTOM_SHEET_DATA)
    private bottomSheetData?: Image | null,
    @Optional() private bottomSheetRef?: MatBottomSheetRef<AddDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private dialogData?: Image | null
  ) {}

  ngOnInit() {
    this.image = this.dialogData || this.bottomSheetData;
  }

  get isMobileView(): boolean {
    const width = window.innerWidth;
    return width <= 768;
  }

  get formattedUploadDate(): string {
    if (!this.image?.uploadDate) return '';

    return new Date(this.image.uploadDate).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  closeDialog() {
    if (this.dialogRef) {
      this.dialogRef.close();
    } else if (this.bottomSheetRef) {
      this.bottomSheetRef.dismiss();
    }
  }
}
