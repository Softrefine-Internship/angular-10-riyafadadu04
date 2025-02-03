import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ImgGalleryComponent } from './img-gallery/img-gallery.component';
import { TagDialogComponent } from './img-gallery/tag-dialog/tag-dialog.component';
import { AddDialogComponent } from './img-gallery/add-dialog/add-dialog.component';
import { DeleteDialogComponent } from './img-gallery/delete-dialog/delete-dialog.component';
import { ViewDialogComponent } from './img-gallery/view-dialog/view-dialog.component';
import { MaterialModule } from './material/material.module';
import { HeaderComponent } from './header/header.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { DragDropDirective } from './directives/drag-drop.directive';

@NgModule({
  declarations: [
    AppComponent,
    ImgGalleryComponent,
    TagDialogComponent,
    AddDialogComponent,
    DeleteDialogComponent,
    ViewDialogComponent,
    HeaderComponent,
    DragDropDirective,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
