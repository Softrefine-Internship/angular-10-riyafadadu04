import { Component } from '@angular/core';
import { AddDialogComponent } from '../img-gallery/add-dialog/add-dialog.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(private bottomSheet: MatBottomSheet, private dialog: MatDialog) {}

  get isMobileView(): boolean {
    const width = window.innerWidth;
    return width <= 768;
  }

  OpenAddDialog() {
    if (this.isMobileView)
      this.bottomSheet.open(AddDialogComponent, { disableClose: true });
    else this.dialog.open(AddDialogComponent, { disableClose: true });
  }
}
