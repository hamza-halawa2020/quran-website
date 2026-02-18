import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { MediaGalleryService } from '../../../../pages/media-gallery-page/media-gallery.service';

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
  imports: [CommonModule, TranslateModule, PaginationComponent],
  templateUrl: './media-gallery-section.component.html',
  styleUrls: ['../../../../pages/media-gallery-page/media-gallery-page.component.scss']
})
export class MediaGallerySectionComponent implements OnInit {
  @Input() items: MediaItem[] = [];

  allMedia: MediaItem[] = [];
  filteredMedia: MediaItem[] = [];
  activeFilter: 'all' | 'image' | 'video' = 'all';
  isLoading: boolean = true;
  lightboxOpen: boolean = false;
  videoModalOpen: boolean = false;
  selectedMedia: MediaItem | null = null;
  meta: any = null;
  currentPage: number = 1;

  constructor(
    private mediaService: MediaGalleryService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.loadMedia();
  }

  loadMedia(page: number = 1): void {
    this.isLoading = true;
    this.currentPage = page;
    this.mediaService.getAllMedia(page, this.activeFilter).subscribe({
      next: (response: any) => {
        this.allMedia = Array.isArray(response) ? response : (response.data || []);
        this.filteredMedia = this.allMedia;
        this.meta = response.meta || null;
        this.isLoading = false;
      },
        error: (error: any) => {
          console.error('Error loading media:', error);
          this.isLoading = false;
        }
    });
  }

  filterMedia(type: 'all' | 'image' | 'video'): void {
    this.activeFilter = type;
    this.currentPage = 1;
    this.loadMedia(1);
  }

  onPageChange(page: number): void {
    if (this.meta && page >= 1 && page <= this.meta.last_page && page !== this.meta.current_page) {
      this.loadMedia(page);
    }
  }

  openLightbox(media: MediaItem): void {
    this.selectedMedia = media;
    this.lightboxOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeLightbox(): void {
    this.lightboxOpen = false;
    this.selectedMedia = null;
    document.body.style.overflow = 'auto';
  }

  playVideo(media: MediaItem): void {
    this.selectedMedia = media;
    this.videoModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeVideoModal(): void {
    this.videoModalOpen = false;
    this.selectedMedia = null;
    document.body.style.overflow = 'auto';
  }

  getVideoEmbedUrl(url: string | null | undefined): SafeResourceUrl {
    if (!url) return this.sanitizer.bypassSecurityTrustResourceUrl('');
    const videoId = this.extractYouTubeId(url);
    const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  getVideoThumbnail(item: MediaItem): string {
    if (item.file) {
      return item.file;
    }
    if (item.video_url) {
      const videoId = this.extractYouTubeId(item.video_url);
      if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      }
    }
    return 'assets/images/logo.svg';
  }

  private extractYouTubeId(url: string): string | null {
    if (!url) return null;

    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^#&?]*)/,
      /youtube\.com\/watch\?.*v=([^&]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  }
}
