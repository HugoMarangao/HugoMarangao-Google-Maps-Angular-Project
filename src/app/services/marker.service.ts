import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { catchError, map } from 'rxjs/operators';

export interface Place {
  name: string;
  vicinity: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    }
  };
  photos?: any[];      // Information about the photos returned by the API.
  ticketInfo?: string; // Ticket or price information, if available.
}

@Injectable({
  providedIn: 'root'
})
export class MarkerService {
  private apiKey = 'AIzaSyDJ7_QiHdOH9gGSdvBS7A_viz0dVYlfp1Q'; // Not really used for the proxied calls.
  private location = '53.3498,-6.2603';
  private radius = 1500; // in meters.

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  /**
   * Search for tourist attractions and bars (pubs) and return a combined array of Place.
   */
  getPlaces(): Observable<Place[]> {
    if (!isPlatformBrowser(this.platformId)) {
      return of([]);
    }

    const attractionsUrl = `http://localhost:3000/api/nearbysearch?location=${this.location}&radius=${this.radius}&type=tourist_attraction`;
    const pubsUrl = `http://localhost:3000/api/nearbysearch?location=${this.location}&radius=${this.radius}&type=bar`;

    return forkJoin({
      attractions: this.http.get<{ results: Place[] }>(attractionsUrl),
      pubs: this.http.get<{ results: Place[] }>(pubsUrl)
    }).pipe(
      map(({ attractions, pubs }) => {
        const combinedPlaces: Place[] = [
          ...((attractions && attractions.results) || []),
          ...((pubs && pubs.results) || [])
        ];
        return combinedPlaces;
      }),
      catchError(error => {
        console.error('Error fetching tourist attractions and pubs:', error);
        return of([]);
      })
    );
  }

  /**
   * Get details for a place. This method now uses the proxy endpoint to avoid CORS issues.
   */
  getPlaceDetails(placeId: string): Observable<any> {
    if (!isPlatformBrowser(this.platformId)) {
      return of(null);
    }
    const detailsUrl = `http://localhost:3000/api/placedetails?placeId=${placeId}`;
    return this.http.get<any>(detailsUrl).pipe(
      catchError(error => {
        console.error(`Error fetching details for placeId ${placeId}:`, error);
        return of(null);
      })
    );
  }
}
