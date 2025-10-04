# Development Notes

## Known Issues During Local Development

### 1. CORS Error (Expected)
```
Access to fetch at 'https://api-vierbeinerabsicherung.moazzammalek.com/api/allianz' 
from origin 'http://127.0.0.1:5500' has been blocked by CORS policy
```

**This is NORMAL during local development!**

The API server needs to have proper CORS headers configured to allow requests from localhost/127.0.0.1.

**Solutions:**
- **Production:** The app will work fine when deployed to the same domain or configured CORS domain
- **Local Development:** Use one of these methods:
  1. Run a local proxy server
  2. Use a browser extension to disable CORS (for testing only)
  3. Configure the API server to allow localhost origins
  4. Use Chrome with `--disable-web-security` flag (testing only)

### 2. Calendly Widget Error (widget.js)
```
Uncaught TypeError: Cannot read properties of null (reading 'split')
```

This error is from the Calendly external widget and doesn't affect the application functionality. 
It occurs because Calendly tries to initialize before the DOM is fully ready. This is a known issue with their widget.

**Impact:** Minimal - only affects the booking calendar display on the success screen.

## Testing the Application Flow

1. Fill out pet information (Steps 1-3)
2. Select an insurance plan (Basis, Smart, or Komfort)
3. Optionally select an addon
4. Click "Zur Antragstellung →"
5. Fill out the application form
6. Submit the application

## Fixed Issues

✅ Customer contact form removed
✅ "Zur Antragstellung →" button now works
✅ Application form integrated into single page
✅ `proceedToApplication` function made globally accessible
✅ `showApiError` function made globally accessible
✅ All functions properly scoped

## File Structure

- `index.html` - Main application page with all screens
- `script.js` - Main application logic
- `pricingtable.js` - Pricing table data
- `diseases.js` - Disease/condition data
- `styles.css` - Application styles
- `application.js` - (Now deprecated - logic moved to script.js)

## Next Steps for Production

1. Deploy to production server
2. Configure CORS headers on API server
3. Test the complete flow with real API
4. Remove development console logs if needed
