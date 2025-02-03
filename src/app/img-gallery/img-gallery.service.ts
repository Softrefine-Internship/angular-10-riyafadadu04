import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Image } from './image.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImgGalleryService {
  images: Image[] = [];
  imagesChanged = new Subject<Image[]>();

  constructor(private http: HttpClient) {}

  getImages() {
    this.http
      .get<Image[]>(environment.apiUrl + '/images.json')
      .subscribe((img) => {
        this.images = img;
        this.imagesChanged.next([...this.images]);
      });
  }

  putImages() {
    this.http
      .put(environment.apiUrl + '/images.json', this.images)
      .subscribe((response) => {
        console.log(response);
      });
  }

  deleteImage(id: number) {
    this.images = this.images.filter((img) => img.id !== id);
    this.imagesChanged.next(this.images.slice());
    this.putImages();
  }

  addImage(image: Image) {
    console.log(this.images);
    if (!this.images) this.images = [];
    this.images.push(image);
    this.imagesChanged.next([...this.images]);
    this.putImages();
  }

  updateImage(id: number, image: Image) {
    const index = this.images.findIndex((image) => image.id === id);
    this.images[index] = image;
    this.imagesChanged.next(this.images.slice());
    this.putImages();
  }

  updateImageTags(id: number, tags: any[]) {
    const index = this.images.findIndex((image) => image.id === id);
    this.images[index].tags = tags;
    this.imagesChanged.next(this.images.slice());
    this.putImages();
  }
}
