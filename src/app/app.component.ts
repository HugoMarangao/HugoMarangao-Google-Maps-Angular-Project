import { Component } from '@angular/core';
import { MapComponent } from "./map/map.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [MapComponent, SidebarComponent, MatSidenavModule]
})
export class AppComponent {
  searchTerm: string = '';
  activeCategory: string = '';

  // Called when the user searches for a location.
  onSearch(term: string) {
    this.searchTerm = term;
    // You can pass this search term to the MapComponent to filter the markers.
    console.log('Searching for:', term);
  }

  // Called when the user filters by a category.
  onCategoryFilter(category: string) {
    this.activeCategory = category;
    console.log('Filtering by category:', category);
  }
}
