import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-latest-posts-section',
    standalone: true,
    imports: [CommonModule, RouterLink, TranslateModule],
    templateUrl: './latest-posts-section.component.html',
    styleUrls: ['./latest-posts-section.component.scss']
})
export class LatestPostsSectionComponent {
    @Input() posts: any[] = [];

    constructor(public translate: TranslateService) { }

    getImageUrl(imageUrl: string, fallback: string = 'assets/images/placeholder.jpg'): string {
        return imageUrl || fallback;
    }

    formatDate(dateString: string): string {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleDateString('ar-EG', { month: 'long' });
        return `${day} ${month}`;
    }
}
