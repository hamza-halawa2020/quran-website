import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { RouterOutlet, Router, Event, NavigationEnd } from '@angular/router';
import { NavbarComponent } from './common/navbar/navbar.component';
import { WhatsappFloatComponent } from './common/whatsapp-float/whatsapp-float.component';
import { CustomCursorComponent } from './shared/components/custom-cursor/custom-cursor.component';
import { FooterComponent } from './common/footer/footer.component';
import { BackToTopComponent } from './common/back-to-top/back-to-top.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, NavbarComponent, WhatsappFloatComponent, CustomCursorComponent, FooterComponent, BackToTopComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
    title = 'onlineislamicmadrasah';
    showCustomCursor = false;
    private removeCursorBootstrapListener?: () => void;

    constructor(
        private router: Router,
        private viewportScroller: ViewportScroller,
        private ngZone: NgZone
    ) {
        this.router.events.subscribe((event: Event) => {
            if (event instanceof NavigationEnd) {
                // Scroll to the top after each navigation end
                this.viewportScroller.scrollToPosition([0, 0]);
            }
        });
    }

    ngOnInit(): void {
        if (typeof window === 'undefined') {
            return;
        }

        const supportsFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (!supportsFinePointer || prefersReducedMotion) {
            return;
        }

        this.ngZone.runOutsideAngular(() => {
            const enableCustomCursor = () => {
                this.removeCursorBootstrapListener?.();
                this.ngZone.run(() => {
                    this.showCustomCursor = true;
                });
            };

            window.addEventListener('mousemove', enableCustomCursor, { passive: true, once: true });
            this.removeCursorBootstrapListener = () => {
                window.removeEventListener('mousemove', enableCustomCursor);
                this.removeCursorBootstrapListener = undefined;
            };
        });
    }

    ngOnDestroy(): void {
        this.removeCursorBootstrapListener?.();
    }
}
