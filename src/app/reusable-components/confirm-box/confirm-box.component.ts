import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-box',
  imports: [],
  templateUrl: './confirm-box.component.html',
  styleUrl: './confirm-box.component.css',
})
export class ConfirmBoxComponent {
  @Input() message: string = 'Do you want to continue?';
  @Input() continueButtonLabel: string = 'continue';
  @Input() cancelButtonLabel: string = 'cancel';
  @Output() continueDelete = new EventEmitter<boolean>();
}
