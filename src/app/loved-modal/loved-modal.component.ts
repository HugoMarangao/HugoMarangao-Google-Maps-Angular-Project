import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface Place {
  title: string;
  position: {
    lat: number;
    lng: number;
  };
  description?: string;
}

@Component({
  selector: 'app-loved-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loved-modal.component.html',
  styleUrls: ['./loved-modal.component.scss']
})
export class LovedModalComponent implements OnInit {
  lovedPlaces: Place[] = [];

  constructor(
    public dialogRef: MatDialogRef<LovedModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    // Example: loading favorite locations
    this.lovedPlaces = this.getLovedPlacesFromCookies();
  }

  getLovedPlacesFromCookies(): Place[] {
    const places: Place[] = [];
    const cookies = document.cookie.split('; ');
    cookies.forEach(cookie => {
      const [key, value] = cookie.split('=');
      if (key.startsWith('love_') && value === 'true') {
        const title = decodeURIComponent(key.replace('love_', ''));
        places.push({
          title,
          position: { lat: 0, lng: 0 }, // Replace with real coordinates
          description: 'Favorite location'
        });
      }
    });
    return places;
  }

  selectPlace(place: Place) {
    this.dialogRef.close(place);
  }

  cancel() {
    this.dialogRef.close();
  }
}
