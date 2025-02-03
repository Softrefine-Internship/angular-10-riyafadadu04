import {
  Directive,
  HostListener,
  ElementRef,
  Renderer2,
  Output,
  EventEmitter,
} from '@angular/core';

@Directive({
  selector: '[appDragDrop]',
})
export class DragDropDirective {
  @Output() fileDropped = new EventEmitter<FileList>();

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.renderer.setStyle(this.el.nativeElement, 'border-color', '#3f51b5');
    this.renderer.setStyle(
      this.el.nativeElement,
      'background-color',
      'rgba(63, 81, 181, 0.1)'
    );
    this.renderer.setStyle(this.el.nativeElement, 'transform', 'scale(1.02)');
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.renderer.setStyle(this.el.nativeElement, 'border-color', '#aaa');
    this.renderer.setStyle(
      this.el.nativeElement,
      'background-color',
      'transparent'
    );
    this.renderer.setStyle(this.el.nativeElement, 'transform', 'scale(1)');
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.renderer.setStyle(this.el.nativeElement, 'border-color', '#aaa');
    this.renderer.setStyle(
      this.el.nativeElement,
      'background-color',
      'transparent'
    );
    this.renderer.setStyle(this.el.nativeElement, 'transform', 'scale(1)');

    if (event.dataTransfer?.files.length) {
      this.fileDropped.emit(event.dataTransfer.files);
    }
  }
}
