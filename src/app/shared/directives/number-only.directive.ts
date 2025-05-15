import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appNumberOnly]',
  standalone: true,
})
export class NumberOnlyDirective {
  constructor(private readonly control: NgControl) {}

  @HostListener('input', ['$event'])
  public onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const cleaned = input.value.replace(/[^0-9]/g, '');

    if (input.value !== cleaned) {
      input.value = cleaned;
      this.control.control?.setValue(cleaned);
    }
  }

  @HostListener('keydown', ['$event'])
  public onKeyDown(event: KeyboardEvent): void {
    const allowed = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab'];
    if (allowed.includes(event.key) || event.ctrlKey || event.metaKey) {
      return;
    }

    if (!/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }
  }
}
