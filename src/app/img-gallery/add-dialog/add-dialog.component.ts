import { Component, Inject, Optional } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Image } from '../image.model';
import { ImgGalleryService } from '../img-gallery.service';

@Component({
  selector: 'app-add-dialog',
  templateUrl: './add-dialog.component.html',
  styleUrls: ['./add-dialog.component.scss'],
})
export class AddDialogComponent {
  nameInput = new FormControl('', Validators.required);
  imageUrl: string | null = null; // for base64
  image!: Image | null | undefined;
  selectedFile: File | null = null;
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

  get isMobileView(): boolean {
    const width = window.innerWidth;
    return width <= 768;
  }

  ngOnInit() {
    this.image = this.isMobileView
      ? this.bottomSheetData ?? null
      : this.dialogData ?? null;
    console.log(this.image);

    if (this.image) {
      this.nameInput.setValue(this.image.name);
      this.imageUrl = this.image.imageUrl;
      this.tags = this.image.tags.slice();
    }
  }

  closeDialog() {
    if (this.dialogRef) {
      this.dialogRef.close();
    } else if (this.bottomSheetRef) {
      this.bottomSheetRef.dismiss();
    }
  }

  onFileDropped(files: FileList) {
    if (files.length > 0) {
      this.onFileSelect({ target: { files } });
    }
  }

  onFileSelect(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      if (this.selectedFile) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imageUrl = e.target.result;
        };
        reader.readAsDataURL(this.selectedFile);
      }
    }
  }

  saveImage() {
    if (!this.nameInput) {
      alert('Please provide an image name.');
      return;
    }

    const name = this.nameInput.value || '';
    const imageUrl = this.imageUrl || this.image?.imageUrl || '';

    if (this.image) {
      this.image.name = name;
      this.image.imageUrl = imageUrl;
      this.image.tags = [...this.tags];
      this.image.uploadDate = this.image.uploadDate;

      this.imgGalleryService.updateImage(this.image.id, this.image);
      this.closeDialog();
    } else {
      if (!this.selectedFile) {
        alert('Please select an image to upload.');
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(this.selectedFile);

      reader.onload = () => {
        const newImage: Image = {
          id: Date.now(),
          name: this.nameInput.value || '',
          uploadDate: new Date(),
          tags: this.tags,
          imageUrl: reader.result as string,
        };

        this.imgGalleryService.addImage(newImage);
        this.closeDialog();
      };
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
}
