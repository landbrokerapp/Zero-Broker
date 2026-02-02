# Quick Reference: Location Features

## For Users

### How to Use "Use My Location" Button

1. **Click the Button**
   - Look for the blue "Use My Location" button at the top of Step 2
   - Click it to auto-fill your location

2. **Allow Location Permission**
   - Your browser will ask for permission to access your location
   - Click "Allow" or "Yes"
   - This is safe and only used to fill the form

3. **Auto-Filled Fields**
   - ✅ City (Tamil Nadu)
   - ✅ Area / Locality
   - ✅ Pincode (if available)
   - ✅ Map Location (Google Maps link)

4. **Verify & Edit**
   - Check if the detected location is correct
   - You can manually change any field if needed

### Manual Location Entry

1. **Select City**
   - Click the "City (Tamil Nadu)" dropdown
   - Choose your city from the list (38+ cities available)
   - Cities are sorted alphabetically

2. **Select Area/Locality**
   - The locality dropdown will update based on your city
   - Choose your specific area/locality
   - Includes detailed localities and sub-areas

3. **Add Map Location (Optional)**
   - Go to Google Maps
   - Find your property location
   - Click "Share" → Copy link
   - Paste the link in the "Map Location" field

### Supported Map Link Formats

```
✅ https://www.google.com/maps?q=11.0168,76.9558
✅ https://maps.google.com/?q=11.0168,76.9558
✅ https://www.google.com/maps/@11.0168,76.9558,15z
✅ 11.0168,76.9558 (coordinates only)
```

## For Developers

### Using the Location Data

```typescript
import { 
  getAllCityNames, 
  getLocalitiesForCity,
  searchLocalities 
} from '@/data/tamilNaduLocations';

// Get all cities
const cities = getAllCityNames(); // Returns sorted array

// Get localities for a city
const localities = getLocalitiesForCity('Coimbatore');
// Returns: [{ name: 'Saravanampatti', subLocalities: [...] }, ...]

// Search across all localities
const results = searchLocalities('Sara');
// Returns: [{ city: 'Coimbatore', locality: {...} }, ...]
```

### Using Geolocation Services

```typescript
import { 
  getCurrentLocationData,
  generateGoogleMapsLink,
  parseGoogleMapsLink 
} from '@/lib/geolocation';

// Get current location
const locationData = await getCurrentLocationData();
console.log(locationData);
// {
//   city: 'Coimbatore',
//   area: 'Saravanampatti',
//   state: 'Tamil Nadu',
//   pincode: '641035',
//   coordinates: { latitude: 11.0168, longitude: 76.9558 }
// }

// Generate Google Maps link
const link = generateGoogleMapsLink({ 
  latitude: 11.0168, 
  longitude: 76.9558 
});
// Returns: "https://www.google.com/maps?q=11.0168,76.9558"

// Parse Google Maps link
const coords = parseGoogleMapsLink(link);
// Returns: { latitude: 11.0168, longitude: 76.9558 }
```

### Error Handling

```typescript
try {
  const location = await getCurrentLocationData();
  // Use location data
} catch (error) {
  if (error.message.includes('permission denied')) {
    // User denied location permission
    toast.error('Please enable location access');
  } else if (error.message.includes('unavailable')) {
    // Location services disabled
    toast.error('Please enable location services');
  } else {
    // Other errors
    toast.error('Failed to get location. Please enter manually.');
  }
}
```

## Available Cities (38+)

### Major Cities
- Chennai
- Coimbatore  
- Madurai
- Trichy (Tiruchirappalli)
- Salem
- Tiruppur
- Erode
- Vellore
- Tirunelveli
- Thoothukudi (Tuticorin)

### Tier-2 Cities
- Hosur
- Kancheepuram
- Thanjavur
- Nagercoil
- Karur
- Dindigul
- Cuddalore
- Namakkal
- Pudukkottai

### All Districts
- Ramanathapuram
- Sivaganga
- Virudhunagar
- Theni
- Krishnagiri
- Dharmapuri
- Ariyalur
- Perambalur
- Nagapattinam
- Tiruvarur
- Kanyakumari

## Example: Coimbatore Localities

### Main Localities
1. **Saravanampatti**
   - GKS Nagar
   - Janatha Nagar
   - Mani Nagar
   - Bankers Colony
   - Revenue Nagar

2. **Peelamedu**
   - Hopes College
   - Lakshmi Mills
   - Ram Nagar
   - Avinashi Road

3. **RS Puram**
   - Race Course
   - Sivananda Colony
   - DB Road
   - Ramnagar

4. **Gandhipuram**
   - Cross Cut Road
   - Big Bazaar Street
   - Oppanakara Street

5. **Vadavalli**
   - Maruthamalai Road
   - Thondamuthur Road
   - Vellalore

## Example: Chennai Localities

### Main Localities
1. **Adyar**
   - Thiruvanmiyur
   - Besant Nagar
   - Indira Nagar
   - Kasturba Nagar

2. **Velachery**
   - Taramani
   - Vijayanagar
   - Phoenix Market City Area

3. **Anna Nagar**
   - Anna Nagar East
   - Anna Nagar West
   - Thirumangalam
   - Mogappair

4. **OMR (Old Mahabalipuram Road)**
   - Sholinganallur
   - Perungudi
   - Thoraipakkam
   - Navalur
   - Kelambakkam

5. **T Nagar**
   - West Mambalam
   - Ashok Nagar
   - Kodambakkam

## Troubleshooting

### Location Not Detected
**Problem**: "Use My Location" button doesn't work

**Solutions**:
1. Check if location services are enabled on your device
2. Check if browser has location permission
3. Try using HTTPS (required for geolocation)
4. Clear browser cache and try again
5. Use manual entry as fallback

### Wrong Location Detected
**Problem**: Detected city/area is incorrect

**Solutions**:
1. Manually select the correct city from dropdown
2. Manually select the correct area from dropdown
3. The dropdowns will override auto-detected values

### Map Link Not Working
**Problem**: Google Maps link is invalid

**Solutions**:
1. Copy the link directly from Google Maps "Share" button
2. Ensure the link includes coordinates
3. Check supported formats (see above)
4. Leave blank if unsure (it's optional)

## Privacy & Security

### What Data is Collected?
- ✅ City name (stored)
- ✅ Area/Locality name (stored)
- ✅ Pincode (stored, if provided)
- ✅ Google Maps link (stored, if provided)
- ❌ Exact GPS coordinates (NOT stored)
- ❌ Real-time tracking (NOT done)

### How is Location Used?
- Only to pre-fill form fields
- Coordinates are converted to city/area names
- Only city/area names are saved to database
- Map link is saved for buyer convenience

### Can I Disable Location?
- Yes, deny browser permission
- Yes, use manual entry instead
- Yes, skip map location field (it's optional)

## Best Practices

### For Property Sellers
1. ✅ Use "Use My Location" if posting from property location
2. ✅ Verify auto-detected city and area
3. ✅ Add map location for better visibility
4. ✅ Fill landmark for easier discovery
5. ✅ Add pincode for accurate search results

### For Admins
1. ✅ Verify location data before approving listings
2. ✅ Check if map link is valid
3. ✅ Ensure city/area matches the property
4. ✅ Flag suspicious locations

## API Information

### Nominatim (OpenStreetMap)
- **Type**: Free, Open Source
- **Rate Limit**: 1 request/second
- **No API Key**: Required
- **Privacy**: No tracking, no data collection
- **Accuracy**: Good for city/area level
- **Coverage**: Worldwide

### Browser Geolocation API
- **Type**: Built-in browser feature
- **Permission**: Required from user
- **Accuracy**: 10-100 meters (depends on device)
- **Offline**: Requires internet connection
- **HTTPS**: Required (except localhost)

---

**Last Updated**: February 2, 2026  
**Version**: 1.0  
**Support**: Check documentation or contact admin
