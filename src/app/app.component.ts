import { Component, NgZone, OnDestroy } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';
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
export class AppComponent {
    title = 'onlineislamicmadrasah';
    private destroy$ = new Subject<void>();

    constructor(
        private router: Router,
        private zone: NgZone
    ) {
        // Ensure every route change starts at the top (some pages use long scrolling).
        // We do it twice: immediately and after the new view becomes stable.
        this.router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                takeUntil(this.destroy$)
            )
            .subscribe(() => {
                // Don't fight anchor scrolling.
                if (this.router.url.includes('#')) return;

                this.scrollToTop();
                this.zone.onStable.pipe(take(1)).subscribe(() => this.scrollToTop());
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private scrollToTop(): void {
        // Force "instant" jump even if `scroll-behavior: smooth` is enabled globally.
        const html = document.documentElement;
        const previous = html.style.scrollBehavior;
        html.style.scrollBehavior = 'auto';

        try {
            window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        } catch {
            window.scrollTo(0, 0);
        }

        // Extra safety for browsers that track scroll on `documentElement`/`body`.
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;

        html.style.scrollBehavior = previous;
    }
}
