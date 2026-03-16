import { Directive, ElementRef, OnInit, OnDestroy, Input } from '@angular/core';

@Directive({
  selector: '[scrollReveal]',
  standalone: true,
})
export class ScrollRevealDirective implements OnInit, OnDestroy {
  @Input() revealDelay = 0;

  private observer!: IntersectionObserver;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    const el = this.el.nativeElement;

    el.style.opacity = '0';
    el.style.transform = 'translateY(120px) scale(0.88)';
    el.style.filter = 'blur(6px)';
    el.style.transition = 'none';

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              el.style.transition = [
                'opacity 1.1s cubic-bezier(0.16, 1, 0.3, 1)',
                'transform 1.1s cubic-bezier(0.16, 1, 0.3, 1)',
                'filter 1.1s cubic-bezier(0.16, 1, 0.3, 1)',
              ].join(', ');
              el.style.opacity = '1';
              el.style.transform = 'translateY(0) scale(1)';
              el.style.filter = 'blur(0px)';

              // After animation completes, remove transform & filter entirely
              // so they don't break position:fixed children (modals, lightboxes)
              el.addEventListener('transitionend', () => {
                el.style.transform = '';
                el.style.filter = '';
                el.style.transition = '';
              }, { once: true });

            }, this.revealDelay);
            this.observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -50px 0px' }
    );

    this.observer.observe(el);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
