import { Directive, ElementRef, HostListener , Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
@Directive({
  selector: '[appChangeIconOnHover]'
})
export class ChangeIconOnHoverDirective {

  @Input() IconNameEnter: string;
  @Input() IconNameLeave: string;

  constructor(private _el: ElementRef) { }

  @HostListener('mouseenter') onMouseEnter() {
    this.changeIcon(this.IconNameEnter);
  }

  @HostListener('mouseover') onMouseOver() {
    this.changeIcon(this.IconNameEnter);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.changeIcon(this.IconNameLeave);
  }

  private changeIcon(icon: string) {
    const elNative = this._el.nativeElement;
    const container = elNative.children[0];
    const children = container.children;
    let maticon = null;
    for (let index = 0; index < children.length; index++) {
      const element = children[index];
      if (element.nodeName === 'MAT-ICON') {
        maticon = element;
        break;
      }
    }
    if (maticon !== null) {
      maticon.innerText = icon;
    }
  }

}
