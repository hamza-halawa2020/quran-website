import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ContentCardComponent } from '../../../../shared/components/content-card/content-card.component';

@Component({
    selector: 'app-latest-courses-section',
    standalone: true,
    imports: [CommonModule, TranslateModule, ContentCardComponent],
    templateUrl: './latest-courses-section.component.html',
    styleUrls: ['./latest-courses-section.component.scss']
})
export class LatestCoursesSectionComponent {
    @Input() courses: any[] = [];
}
