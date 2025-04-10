import express, { Request, Response } from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for all routes so your Angular app can access these endpoints.
app.use(cors());

// Use an environment variable for your API key, or replace with your key directly.
const API_KEY: string = process.env.GOOGLE_API_KEY || 'AIzaSyDJ7_QiHdOH9gGSdvBS7A_viz0dVYlfp1Q';

// Endpoint for nearby search:
// Example: /api/nearbysearch?location=LAT,LNG&radius=1500&type=PLACE_TYPE
app.get('/api/nearbysearch', async (req: Request, res: Response): Promise<void> => {
  try {
    const location = req.query.location as string;
    const radius = req.query.radius as string;
    const type = req.query.type as string;

    if (!location || !radius || !type) {
      res.status(400).json({
        error: 'Missing required query parameters: location, radius, and type.',
      });
      return;
    }

    const googleURL = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=${type}&key=${API_KEY}`;
    const response = await axios.get(googleURL);
    res.json(response.data);
  } catch (error: any) {
    console.error('Error fetching data from Google Places API:', error.message);
    res.status(500).json({ error: 'Error fetching data from Google Places API' });
  }
});

// New endpoint for Place Details:
// Example: /api/placedetails?placeId=PLACE_ID
app.get('/api/placedetails', async (req: Request, res: Response): Promise<void> => {
  try {
    const placeId = req.query.placeId as string;
    if (!placeId) {
      res.status(400).json({
        error: 'Missing required query parameter: placeId.'
      });
      return;
    }

    // Construct the URL for the Place Details API call.
    const detailsURL = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,photos,price_level,formatted_address,opening_hours&key=${API_KEY}`;
    const response = await axios.get(detailsURL);
    res.json(response.data);
  } catch (error: any) {
    console.error('Error fetching place details from Google Places API:', error.message);
    res.status(500).json({ error: 'Error fetching place details from Google Places API' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
