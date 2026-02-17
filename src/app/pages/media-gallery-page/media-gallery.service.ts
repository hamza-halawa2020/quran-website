import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
    providedIn: 'root'
})
export class MediaGalleryService {
    private apiUrl = environment.backEndUrl;

    constructor(private http: HttpClient) { }

    getMediaList(page: number = 1): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/media-center?page=${page}`);
    }
}
