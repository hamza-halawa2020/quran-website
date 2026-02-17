import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-work-samples-section',
    standalone: true,
    imports: [CommonModule, RouterLink, TranslateModule],
    templateUrl: './work-samples-section.component.html',
    styleUrls: ['./work-samples-section.component.scss']
})
export class WorkSamplesSectionComponent {
    @Input() workSamples: any[] = [];

    constructor(public translate: TranslateService) { }

    getImageUrl(imageUrl: string, fallback: string = 'assets/images/placeholder.jpg'): string {
        return imageUrl || fallback;
    }

    truncateText(text: string, maxLength: number = 100): string {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }
}
