
# Google Maps Angular Project

This project is an interactive **map-based web application** built with **Angular** and the **Google Maps JavaScript API**. The goal is to showcase mid-level front-end development skills by integrating a map, markers, filters, and optional route calculations. It also includes a small **Node.js/Express** proxy server (in TypeScript) to handle CORS issues for the Google Places API.

## Table of Contents
- [Overview](#overview)
- [Key Features](#key-features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Usage](#usage)
- [Additional Features](#additional-features)
- [Future Improvements](#future-improvements)
- [Credits](#credits)

---

## Overview

**Objective:**  
Build an Angular application that renders a Google Map, shows points of interest (hotels, pubs, restaurants, etc.), and allows users to filter and search these markers. The project demonstrates:
- Integration of the **Google Maps JavaScript API** for rendering the map.  
- Use of the **Google Places API** for retrieving real-time location data.  
- A **Node.js/Express** proxy backend to manage Google API calls and avoid CORS issues.  
- Angular components (e.g., map display, sidebar with search, filtering, and a “Loved Modal”).  
- Responsive design for both desktop and mobile screens.

This README explains how to install, run, and explore the application.

---

## Key Features

1. **Map Display & Marker Management**  
   - An interactive Google Map (zoom, pan) rendered with Angular Google Maps components.  
   - Markers for points of interest are dynamically fetched from the Google Places API (via the backend proxy).  
   - Marker filtering and searching (e.g., show only hotels, pubs, or restaurants).

2. **Advanced Marker Interactions**  
   - Clicking on a marker opens a side panel or info window with the title, description, and actions.  
   - Actions include “Love” for favoriting a location, route calculations, etc.

3. **Search & Filter Panel**  
   - A top or side bar to enter free-text search.  
   - Buttons to filter by category (hotels, pubs, restaurants).  
   - A “Loved” modal showing all favorited locations.

4. **Optional Distance or Routing**  
   - The user can select two markers to calculate a route.  
   - Displays walking or driving time using Google Maps Directions.

5. **Responsive Design**  
   - The layout adapts to various screen sizes, ensuring usability on mobile devices.

---

## Project Structure

A simplified view of the relevant folders:

```
google-maps-app/
├── back-end/
│   ├── google-places-proxy-ts/
│   │   ├── node_modules/
│   │   ├── server.ts       # Node.js/Express proxy server (TypeScript)
│   │   ├── tsconfig.json
│   │   └── package.json
├── src/
│   ├── app/
│   │   ├── services/
│   │   │   └── marker.service.ts  # Angular service for place data
│   │   ├── map/
│   │   │   └── map.component.ts   # Angular component showing the map
│   │   ├── sidebar/
│   │   │   └── sidebar.component.ts
│   │   ├── loved-modal/
│   │   │   └── loved-modal.component.ts
│   │   └── app.component.ts
│   ├── index.html
│   ├── main.ts
│   └── ...other Angular files
├── package.json
├── tsconfig.json
└── README.md                # <-- You are here
```

---

## Prerequisites

1. **Node.js** (v14+ recommended) and **npm**  
2. **Angular CLI** (optional but helpful for local development)  
3. A **Google Maps API key** with Places and Directions APIs enabled.

---

## Installation

1. **Clone this Repository**  
   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```

2. **Install Dependencies** (Angular Frontend)  
   ```bash
   npm install
   ```

3. **Set Up the Proxy Backend** (Node.js/Express in TypeScript)

   - Navigate to the **backend** folder (if separate) or the folder containing `server.ts`:
     ```bash
     cd back-end/google-places-proxy-ts
     ```
   - Install dependencies there:
     ```bash
     npm install
     ```
   - **Optional**: If you prefer environment variables, create a `.env` file or set `GOOGLE_API_KEY` in your environment. Otherwise, replace `'YOUR_API_KEY'` in `server.ts` with your real Google API key.

---

## Running the Application

1. **Start the Proxy Server**  
   From the backend folder, run:
   ```bash
   npx ts-node server.ts
   ```
   The server will start on port `3000` by default. If you see `Server is running on port 3000`, it’s working.

2. **Start the Angular Frontend**  
   Go back to the main project folder (if needed):
   ```bash
   cd ../../   # or the appropriate path
   ng serve
   ```
   By default, the Angular app runs on `http://localhost:4200`. Make sure the backend is still running on port 3000.

---

## Usage

- **Open** your browser to [http://localhost:4200](http://localhost:4200).
- You should see a Google Map centered in Dublin (latitude 53.3498, longitude -6.2603).
- The sidebar has a text input for searching and buttons (Hotels, Pubs, Restaurants, etc.) for filtering markers.
- Clicking on a marker opens details in a side panel, showing images and an option to calculate a route (if implemented).
- You can click “Love” to add that marker to a favorites list. Then click the heart icon to open the Loved Modal.

---

## Additional Features

- **Responsive Layout**: The map and sidebar adapt for mobile screens. The side panel can transform into a bottom sheet on mobile.  
- **Modal for Favorites**: The “Loved” or “favorite” feature is stored using cookies.  
- **Proxy Server in TypeScript**: The backend calls the Google Places API, avoiding CORS issues and protecting the API key from direct exposure in the client.

---

## Future Improvements

1. **Enhance the Route Calculations**: Show alternative transport modes (walk, drive, transit).  
2. **Incorporate SSR**: Possibly use Angular Universal for faster initial loads.  
3. **Add More Data**: E.g., user ratings, price ranges, or additional public APIs.  
4. **Authentication**: Users could log in and save favorites across sessions in a database.  
5. **Custom UI Themes**: Integrate Angular Material theming for a more polished look.

---

## Credits

- **Angular**: For the framework.  
- **Google Maps JavaScript API**: For map rendering and the Places service.  
- **Node.js + Express**: For building the proxy server in TypeScript.  
- **Font Awesome & Material Icons**: For icons throughout the UI.

---

**Thank you for checking out this project!**  

For any questions or feedback, feel free to reach out or open an issue on the repository.
# HugoMarangao-Google-Maps-Angular-Project
