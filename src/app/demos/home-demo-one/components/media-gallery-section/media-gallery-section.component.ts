import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SafePipe } from '../../../../shared/pipes/safe.pipe';

interface MediaItem {
    id: number;
    title: string;
    type: 'image' | 'video';
    file: string | null;
    video_url: string | null;
    created_at: string;
}

@Component({
    selector: 'app-media-gallery-section',
    standalone: true,
    imports: [CommonModule, TranslateModule, SafePipe],
    templateUrl: './media-gallery-section.component.html',
    styleUrls: ['./media-gallery-section.component.scss']
})
export class MediaGallerySectionComponent implements OnInit, OnChanges {
    @Input() mediaItems: MediaItem[] = [];

    filteredItems: MediaItem[] = [];
    selectedFilter: 'all' | 'image' | 'video' = 'all';
    selectedMedia: MediaItem | null = null;
    showLightbox = false;

    ngOnInit(): void {
        this.filterMedia('all');
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['mediaItems'] && changes['mediaItems'].currentValue) {
            this.filterMedia(this.selectedFilter);
        }
    }

    filterMedia(type: 'all' | 'image' | 'video'): void {
        this.selectedFilter = type;
        if (type === 'all') {
            this.filteredItems = this.mediaItems;
        } else {
            this.filteredItems = this.mediaItems.filter(item => item.type === type);
        }
    }

    openLightbox(media: MediaItem): void {
        this.selectedMedia = media;
        this.showLightbox = true;
        document.body.style.overflow = 'hidden';
    }

    closeLightbox(): void {
        this.showLightbox = false;
        this.selectedMedia = null;
        document.body.style.overflow = 'auto';
    }

    getYouTubeEmbedUrl(url: string): string {
        if (!url) return '';
        const videoId = this.extractYouTubeId(url);
        return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }

    private extractYouTubeId(url: string): string | null {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    // Get video thumbnail - YouTube thumbnail or default image
    getVideoThumbnail(item: MediaItem): string {
        // If there's a file (uploaded thumbnail), use it
        if (item.file) {
            return item.file;
        }

        // If it's a YouTube video, get the thumbnail from YouTube
        if (item.video_url) {
            const videoId = this.extractYouTubeId(item.video_url);
            if (videoId) {
                // Use high quality thumbnail from YouTube
                return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
            }
        }

        // Default fallback image (logo or placeholder)
        return 'assets/images/logo.svg';
    }
}
