import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-certificates-section',
    standalone: true,
    imports: [CommonModule, RouterLink, TranslateModule],
    templateUrl: './certificates-section.component.html',
    styleUrls: ['./certificates-section.component.scss']
})
export class CertificatesSectionComponent {
    @Input() certificates: any[] = [];
    fallbackImage: string = '/assets/images/logo.svg';

    onImageError(event: any) {
        event.target.src = this.fallbackImage;
    }
}
