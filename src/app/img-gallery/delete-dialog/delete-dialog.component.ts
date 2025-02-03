import { Component, Inject, OnInit, Optional } from '@angular/core';
import { ImgGalleryService } from '../img-gallery.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AddDialogComponent } from '../add-dialog/add-dialog.component';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { Image } from '../image.model';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss'],
})
export class DeleteDialogComponent implements OnInit {
  image!: Image | null | undefined;

  constructor(
    private imgGalleryService: ImgGalleryService,
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

  closeDialog() {
    if (this.dialogRef) {
      this.dialogRef.close();
    } else if (this.bottomSheetRef) {
      this.bottomSheetRef.dismiss();
    }
  }

  deleteImage() {
    if (this.dialogData) {
      this.imgGalleryService.deleteImage(this.dialogData.id);
    } else if (this.bottomSheetData) {
      this.imgGalleryService.deleteImage(this.bottomSheetData.id);
    }
    this.closeDialog();
  }
}
