import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface MediaItem {
  id: number;
  title: string;
  description: string;
  media_type: 'image' | 'video' | 'audio';
  media_url: string;
  thumbnail_url?: string;
  category?: string;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class MediaGalleryService {
  private apiUrl = `${environment.backEndUrl}/media-center`;

  constructor(private http: HttpClient) { }

  getAllMedia(): Observable<MediaItem[]> {
    return this.http.get<MediaItem[]>(this.apiUrl).pipe(
      catchError(error => {
        // console.error('Error fetching media:', error);
        return of([]);
      })
    );
  }

  getMediaByType(type: string): Observable<MediaItem[]> {
    return this.http.get<MediaItem[]>(`${this.apiUrl}?type=${type}`).pipe(
      catchError(error => {
        // console.error('Error fetching media by type:', error);
        return of([]);
      })
    );
  }
}
