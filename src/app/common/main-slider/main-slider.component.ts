import { CommonModule, NgClass, NgIf, NgOptimizedImage } from '@angular/common';
import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { MainSliderService } from './main-slider.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-main-slider',
    standalone: true,
    imports: [
        CommonModule,
        NgIf,
        NgClass,
        NgOptimizedImage,
        TranslateModule
    ],
    templateUrl: './main-slider.component.html',
    styleUrls: ['./main-slider.component.scss'],
    providers: [MainSliderService],
})
export class MainSlider implements OnInit, OnDestroy {
    sliderData: any[] | null = null;
    currentSlideIndex = 0;
    private autoplayTimeoutId: number | null = null;
    private isAutoplayPaused = false;
    private readonly autoplayDelay = 5000;
    private readonly prefersReducedMotion =
        typeof window !== 'undefined'
            && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    constructor(
        private mainSliderService: MainSliderService,
        public translate: TranslateService,
        private ngZone: NgZone
    ) { }

    ngOnInit(): void {
        this.fetchSliderData();
    }

    ngOnDestroy(): void {
        this.clearAutoplay();
    }

    fetchSliderData(): void {
        this.mainSliderService.index().subscribe({
            next: (response: any) => {
                this.sliderData = response.data || [];
                this.currentSlideIndex = 0;
                this.startAutoplay();
            },
            error: () => {
                this.sliderData = [];
                this.clearAutoplay();
            }
        });
    }

    prevSlide(): void {
        this.moveToSlide(this.currentSlideIndex - 1);
    }

    nextSlide(): void {
        this.moveToSlide(this.currentSlideIndex + 1);
    }

    goToSlide(index: number): void {
        this.moveToSlide(index);
    }

    pauseAutoplay(): void {
        this.isAutoplayPaused = true;
        this.clearAutoplay();
    }

    resumeAutoplay(): void {
        this.isAutoplayPaused = false;
        this.startAutoplay();
    }

    trackBySlide(index: number, slide: any): string | number {
        return slide?.id || slide?.image_url || index;
    }

    isSlideActive(index: number): boolean {
        return index === this.currentSlideIndex;
    }

    private moveToSlide(index: number): void {
        if (!this.sliderData?.length) {
            return;
        }

        const slideCount = this.sliderData.length;
        this.currentSlideIndex = (index + slideCount) % slideCount;
        this.startAutoplay();
    }

    private startAutoplay(): void {
        this.clearAutoplay();

        if (this.prefersReducedMotion || this.isAutoplayPaused || !this.sliderData || this.sliderData.length < 2) {
            return;
        }

        this.ngZone.runOutsideAngular(() => {
            this.autoplayTimeoutId = window.setTimeout(() => {
                this.autoplayTimeoutId = null;
                this.ngZone.run(() => {
                    this.nextSlide();
                });
            }, this.autoplayDelay);
        });
    }

    private clearAutoplay(): void {
        if (this.autoplayTimeoutId !== null) {
            window.clearTimeout(this.autoplayTimeoutId);
            this.autoplayTimeoutId = null;
        }
    }
}
