import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
} from '@angular/core';

@Directive({
  selector: '[appOutsideClick]',
})
export class OutsideClickDirective {
  @Output() appOutsideClick = new EventEmitter<void>();

  constructor(private el: ElementRef) {}

  @HostListener('document:click', ['$event.target'])
  public onClick(target: HTMLElement) {
    const clickedInside = this.el.nativeElement.contains(target);
    if (!clickedInside) {
      this.appOutsideClick.emit();
    }
  }
}
