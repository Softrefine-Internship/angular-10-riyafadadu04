import { Component, OnInit } from '@angular/core';
import { Image } from './image.model';
import { Subscription } from 'rxjs';
import { ImgGalleryService } from './img-gallery.service';
import { FormControl } from '@angular/forms';

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

  constructor(private imgGalleryService: ImgGalleryService) {}

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
}
