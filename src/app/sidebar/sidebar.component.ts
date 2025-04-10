import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { LovedModalComponent } from '../loved-modal/loved-modal.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MatIconModule, FormsModule], // Import MatIconModule and FormsModule
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  // Property to store the input value.
  searchTerm: string = '';

  @Output() search = new EventEmitter<string>();
  @Output() categoryFilter = new EventEmitter<string>();

  constructor(private dialog: MatDialog) {}

  // Called when the input value changes.
  onSearchChange() {
    this.search.emit(this.searchTerm);
  }

  // Emit the category filter.
  filter(category: string) {
    this.categoryFilter.emit(category);
  }

  // Open the modal for loved locations.
  openLovedModal() {
    const dialogRef = this.dialog.open(LovedModalComponent, {
      width: '400px',
      data: {}
    });

    // When the modal is closed, update the input with the location name if selected.
    dialogRef.afterClosed().subscribe((selectedMarker) => {
      if (selectedMarker && selectedMarker.title) {
        this.searchTerm = selectedMarker.title;
        // Emit the new value so that the map filter is applied.
        this.search.emit(this.searchTerm);
      }
    });
  }
}
