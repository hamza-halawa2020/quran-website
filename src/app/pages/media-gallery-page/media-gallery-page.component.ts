import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MediaGalleryService, MediaItem } from './media-gallery.service';

@Component({
  selector: 'app-media-gallery-page',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './media-gallery-page.component.html',
  styleUrl: './media-gallery-page.component.scss'
})
export class MediaGalleryPageComponent implements OnInit {
  allMedia: MediaItem[] = [];
  filteredMedia: MediaItem[] = [];
  activeFilter: string = 'all';
  isLoading: boolean = true;
  lightboxOpen: boolean = false;
  videoModalOpen: boolean = false;
  selectedMedia: MediaItem | null = null;

  constructor(
    private mediaService: MediaGalleryService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.loadMedia();
  }

  loadMedia(): void {
    this.isLoading = true;
    this.mediaService.getAllMedia().subscribe({
      next: (data) => {
        this.allMedia = data;
        this.filteredMedia = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading media:', error);
        this.isLoading = false;
      }
    });
  }

  filterMedia(type: string): void {
    this.activeFilter = type;
    if (type === 'all') {
      this.filteredMedia = this.allMedia;
    } else {
      this.filteredMedia = this.allMedia.filter(item => item.media_type === type);
    }
  }

  truncateText(text: string, maxLength: number = 100): string {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
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

  getVideoEmbedUrl(url: string): SafeResourceUrl {
    // Convert YouTube watch URL to embed URL
    if (url.includes('youtube.com/watch')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      url = `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      url = `https://www.youtube.com/embed/${videoId}`;
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  // Get video thumbnail - YouTube thumbnail or default image
  getVideoThumbnail(item: MediaItem): string {
    // If there's a thumbnail_url, use it
    if (item.thumbnail_url) {
      return item.thumbnail_url;
    }

    // If it's a YouTube video, get the thumbnail from YouTube
    if (item.media_url) {
      const videoId = this.extractYouTubeId(item.media_url);
      if (videoId) {
        // Use high quality thumbnail from YouTube
        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      }
    }

    // Default fallback image (logo or placeholder)
    return 'assets/images/logo.svg';
  }

  private extractYouTubeId(url: string): string | null {
    if (!url) return null;

    // Handle different YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\?\/]+)/,
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
