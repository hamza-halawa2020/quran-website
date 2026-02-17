import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-testimonials-section',
    standalone: true,
    imports: [CommonModule, RouterLink, TranslateModule],
    templateUrl: './testimonials-section.component.html',
    styleUrls: ['./testimonials-section.component.scss']
})
export class TestimonialsSectionComponent {
    @Input() testimonials: any[] = [];

    constructor(public translate: TranslateService) { }

    getStarsArray(rating: number): number[] {
        const validRating = Math.max(0, Math.min(5, Math.floor(rating || 0)));
        return Array(validRating).fill(0);
    }
}
