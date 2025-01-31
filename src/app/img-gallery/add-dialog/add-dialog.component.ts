import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialogRef } from '@angular/material/dialog';
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
  selectedFile: File | null = null;
  tags: string[] = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(
    private bottomSheet: MatBottomSheet,
    private dialogRef: MatDialogRef<AddDialogComponent>,
    private imgGalleryService: ImgGalleryService
  ) {}

  closeDialog() {
    if (window.innerWidth <= 768) {
      this.bottomSheet.dismiss();
    } else {
      this.dialogRef.close();
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
    if (!this.nameInput.valid || !this.selectedFile) {
      alert('Please provide an image name and select a file.');
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
      console.log('Image Saved:', newImage);
      this.closeDialog();
    };

    reader.onerror = (error) => {
      console.error('Error converting image:', error);
      alert('Error processing image. Try again.');
    };
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
