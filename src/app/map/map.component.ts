import { Component, OnInit, Inject, PLATFORM_ID, ViewChild, Input } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { GoogleMap, MapMarker } from '@angular/google-maps';
import { MarkerService } from '../services/marker.service';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { SidebarComponent } from "../sidebar/sidebar.component";

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, GoogleMap, MapMarker, MatSidenavModule, SidebarComponent],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  @Input() searchTerm: string = '';
  @Input() activeCategory: string = '';

  isBrowser = false;
  center: google.maps.LatLngLiteral = { lat: 53.3498, lng: -6.2603 };
  zoom = 13;

  // Array of markers with extra info
  markers: any[] = [];
  // Currently selected marker (details shown in the side panel)
  selectedMarker: any = null;
  // Markers selected for the route calculation (max 2)
  selectedForRoute: any[] = [];
  // Stores the walking time (e.g., "15 mins")
  walkTime: string = '';

  @ViewChild(GoogleMap, { static: false }) mapRef!: GoogleMap;
  @ViewChild('sidenav') sidenav!: MatSidenav;

  // Controls the opening of the side panel
  sidenavOpen: boolean = false;
  // Renderer for the routes
  directionsRenderer: google.maps.DirectionsRenderer | null = null;
  // Variable to control the state of the "Love" button
  isLoved: boolean = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private markerService: MarkerService
  ) {}

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.markerService.getPlaces().subscribe((places) => {
        this.markers = places.map((place) => ({
          position: {
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng,
          },
          title: place.name,
          description: place.vicinity,
          photos: place.photos || [],
          ticketInfo: place.ticketInfo || null
        }));
      });
    }
  }
  ngAfterViewInit(): void {
    // Delay a bit to ensure the DOM is fully rendered.
    setTimeout(() => {
      if (this.mapRef && this.mapRef.googleMap) {
        google.maps.event.trigger(this.mapRef.googleMap, 'resize');
      }
    }, 300); // Adjust the delay if needed
  }

  // Apply search and category filters
  get filteredMarkers() {
    let filtered = this.markers;
    if (this.searchTerm) {
      filtered = filtered.filter(marker =>
        marker.title.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    if (this.activeCategory) {
      filtered = filtered.filter(marker =>
        marker.title.toLowerCase().includes(this.activeCategory.toLowerCase())
      );
    }
    return filtered;
  }

  // When a marker is clicked, show its details in the side panel
  onMarkerClick(markerData: any) {
    this.selectedMarker = markerData;
    // Get the "Love" state from cookie using key "love_{marker.title}"
    if (this.selectedMarker?.title) {
      const cookieName = "love_" + encodeURIComponent(this.selectedMarker.title);
      const cookieValue = this.getCookie(cookieName);
      this.isLoved = cookieValue === "true";
    } else {
      this.isLoved = false;
    }
    this.sidenav.open();
  }

  // Method called when the "Route" button is clicked in the side panel
  addRoute(): void {
    if (!this.selectedMarker) {
      return;
    }
    if (this.selectedForRoute.length === 0) {
      // First location for the route
      this.selectedForRoute.push(this.selectedMarker);
    } else if (this.selectedForRoute.length === 1) {
      // Second location for the route (do not select the same location)
      if (this.selectedForRoute[0].title === this.selectedMarker.title) {
        alert('The same location cannot be selected as the destination.');
        return;
      }
      this.selectedForRoute.push(this.selectedMarker);
      this.calculateRoute();
    } else {
      alert('There are already two locations selected for the route.');
    }
    // Close the side panel
    this.closeSidenav();
  }

  onSidenavClosed() {
    // When the side panel is closed, reset the selected marker
    this.selectedMarker = null;
  }

  // Calculate and draw the route (for driving) and then calculate the walking time
  calculateRoute(): void {
    const directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();

    if (this.mapRef.googleMap) {
      this.directionsRenderer.setMap(this.mapRef.googleMap);
    } else {
      console.error('Google Map instance is not available.');
      return;
    }

    const request: google.maps.DirectionsRequest = {
      origin: new google.maps.LatLng(
        this.selectedForRoute[0].position.lat,
        this.selectedForRoute[0].position.lng
      ),
      destination: new google.maps.LatLng(
        this.selectedForRoute[1].position.lat,
        this.selectedForRoute[1].position.lng
      ),
      travelMode: google.maps.TravelMode.DRIVING
    };

    directionsService.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.directionsRenderer?.setDirections(result);
        // After calculating the driving route, calculate the walking time
        this.calculateWalkingDuration();
      } else {
        console.error('Error obtaining route: ', status);
      }
    });
  }

  // Calculate the walking time and store it in walkTime
  calculateWalkingDuration(): void {
    if (this.selectedForRoute.length < 2) {
      this.walkTime = '';
      return;
    }
    const walkingService = new google.maps.DirectionsService();
    const request: google.maps.DirectionsRequest = {
      origin: new google.maps.LatLng(
        this.selectedForRoute[0].position.lat,
        this.selectedForRoute[0].position.lng
      ),
      destination: new google.maps.LatLng(
        this.selectedForRoute[1].position.lat,
        this.selectedForRoute[1].position.lng
      ),
      travelMode: google.maps.TravelMode.WALKING
    };

    walkingService.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK && result && result.routes.length > 0) {
        // Capture the duration (e.g., "15 mins")
        this.walkTime = result?.routes?.[0]?.legs?.[0]?.duration?.text ?? '';
      } else {
        console.error('Error obtaining walking route:', status);
        this.walkTime = '';
      }
    });
  }

  // Clear the route (remove the overlay and reset the selection)
  clearRoute(): void {
    if (this.directionsRenderer) {
      this.directionsRenderer.setMap(null);
    }
    this.selectedForRoute = [];
    this.walkTime = '';
  }

  // Close the side panel
  closeSidenav() {
    this.sidenavOpen = false;
  }

  // Toggle the state of the "Love" button
  toggleLove() {
    this.isLoved = !this.isLoved;
    if (this.selectedMarker && this.selectedMarker.title) {
      const cookieName = "love_" + encodeURIComponent(this.selectedMarker.title);
      this.setCookie(cookieName, this.isLoved ? "true" : "false", 30); // 30 days validity
    }
  }

  // Center the map on the marker selected from the modal
  onMarkerSelected(marker: any) {
    if (marker && marker.position) {
      this.center = marker.position;
      this.zoom = 15; // Adjust zoom if needed
      this.selectedMarker = marker;
      this.sidenav.open();
    }
  }

  // Function to set a cookie (name, value, and expiry in days)
  private setCookie(name: string, value: string, days: number): void {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
  }

  // Function to get a cookie by name
  private getCookie(name: string): string {
    return document.cookie.split('; ').reduce((r, v) => {
      const parts = v.split('=');
      return parts[0] === name ? decodeURIComponent(parts[1]) : r;
    }, '');
  }
}
