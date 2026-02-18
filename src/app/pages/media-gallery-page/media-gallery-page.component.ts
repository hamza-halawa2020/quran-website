import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MediaGalleryService } from './media-gallery.service';

interface MediaItem {
  id: number;
  title: string;
  type: 'image' | 'video';
  file: string | null;
  video_url: string | null;
  created_at: string;
}

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
  activeFilter: 'all' | 'image' | 'video' = 'all';
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
      next: (response: any) => {
        console.log('Media response:', response);
        // Handle both array and object with data property
        this.allMedia = Array.isArray(response) ? response : (response.data || []);
        this.filteredMedia = this.allMedia;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading media:', error);
        this.isLoading = false;
      }
    });
  }

  filterMedia(type: 'all' | 'image' | 'video'): void {
    this.activeFilter = type;
    if (type === 'all') {
      this.filteredMedia = this.allMedia;
    } else {
      this.filteredMedia = this.allMedia.filter(item => item.type === type);
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

  getVideoEmbedUrl(url: string): SafeResourceUrl {
    if (!url) return this.sanitizer.bypassSecurityTrustResourceUrl('');
    
    const videoId = this.extractYouTubeId(url);
    const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  getVideoThumbnail(item: MediaItem): string {
    // If there's a file (uploaded thumbnail), use it
    if (item.file) {
      return item.file;
    }

    // If it's a YouTube video, get the thumbnail from YouTube
    if (item.video_url) {
      const videoId = this.extractYouTubeId(item.video_url);
      if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      }
    }

    // Default fallback image
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
