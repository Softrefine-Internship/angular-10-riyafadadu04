import { Component, OnInit } from '@angular/core';
import { Image } from './image.model';
import { Subscription } from 'rxjs';
import { ImgGalleryService } from './img-gallery.service';
import { FormControl } from '@angular/forms';
import { AddDialogComponent } from './add-dialog/add-dialog.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { TagDialogComponent } from './tag-dialog/tag-dialog.component';
import { ViewDialogComponent } from './view-dialog/view-dialog.component';

@Component({
  selector: 'app-img-gallery',
  templateUrl: './img-gallery.component.html',
  styleUrls: ['./img-gallery.component.scss'],
})
export class ImgGalleryComponent implements OnInit {
  SortByList: string[] = ['Name', 'Date'];
  images: Image[] = [];
  filteredImages: Image[] = [];
  imagesSub!: Subscription;

  searchCtrl: FormControl = new FormControl('');
  sortCtrl: FormControl = new FormControl('');

  constructor(
    private imgGalleryService: ImgGalleryService,
    private bottomSheet: MatBottomSheet,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.imagesSub = this.imgGalleryService.imagesChanged.subscribe(
      (images) => {
        this.images = images;
        this.filteredImages = images;
      }
    );
    this.imgGalleryService.getImages();

    this.searchCtrl.valueChanges.subscribe((searchTerm) => {
      this.filterImages(searchTerm);
    });

    this.sortCtrl.valueChanges.subscribe((sortBy) => {
      this.sortImages(sortBy);
    });
  }

  filterImages(searchTerm: string) {
    searchTerm = searchTerm.toLowerCase();
    this.filteredImages = this.images.filter(
      (image) =>
        image.name.toLowerCase().includes(searchTerm) ||
        image.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
    );
  }

  sortImages(sortBy: string) {
    if (sortBy === 'Name') {
      this.filteredImages.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'Date') {
      this.filteredImages.sort(
        (a, b) => +new Date(b.uploadDate) - +new Date(a.uploadDate)
      );
    }
  }
  OnReset() {
    this.searchCtrl.setValue('');
    this.filteredImages = [...this.images];
  }

  get isMobileView(): boolean {
    const width = window.innerWidth;
    return width <= 768;
  }

  OpenAddDialog(image: Image | null = null) {
    if (this.isMobileView)
      this.bottomSheet.open(AddDialogComponent, {
        data: image,
        disableClose: true,
      });
    else
      this.dialog.open(AddDialogComponent, { data: image, disableClose: true });
  }

  openTagDialog(image: Image | null = null) {
    if (this.isMobileView)
      this.bottomSheet.open(TagDialogComponent, {
        data: image,
        disableClose: true,
      });
    else
      this.dialog.open(TagDialogComponent, { data: image, disableClose: true });
  }
  openDeleteDialog(image: Image | null = null) {
    if (this.isMobileView)
      this.bottomSheet.open(DeleteDialogComponent, {
        data: image,
        disableClose: true,
      });
    else
      this.dialog.open(DeleteDialogComponent, {
        data: image,
        disableClose: true,
      });
  }

  openViewDialog(image: Image | null = null) {
    if (this.isMobileView)
      this.bottomSheet.open(ViewDialogComponent, {
        data: image,
        disableClose: true,
      });
    else
      this.dialog.open(ViewDialogComponent, {
        data: image,
        disableClose: true,
      });
  }

  ngOnDestroy(): void {
    this.imagesSub?.unsubscribe();
  }
}
