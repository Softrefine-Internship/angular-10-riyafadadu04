import { Component, Inject, OnInit, Optional } from '@angular/core';
import { ImgGalleryService } from '../img-gallery.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AddDialogComponent } from '../add-dialog/add-dialog.component';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { Image } from '../image.model';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-tag-dialog',
  templateUrl: './tag-dialog.component.html',
  styleUrls: ['./tag-dialog.component.scss'],
})
export class TagDialogComponent {
  image!: Image | null | undefined;
  tags: string[] = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];

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
    this.tags = this.image?.tags || [];
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

  addTag(event: MatChipInputEvent) {
    const value = (event.value || '').trim();
    if (value && !this.tags.includes(value)) {
      this.tags.push(value);
    }
    event.chipInput!.clear();
  }

  editTag(tag: string, event: any) {
    const value = event.value.trim();
    const index = this.tags.indexOf(tag);
    if (value && index >= 0) {
      this.tags[index] = value;
    }
  }

  removeTag(tag: string) {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  saveTags() {
    if (this.image) {
      this.imgGalleryService.updateImageTags(this.image.id, this.tags);
    } else if (this.bottomSheetData) {
      this.bottomSheetData.tags = this.tags;
    }
    this.closeDialog();
  }
}
