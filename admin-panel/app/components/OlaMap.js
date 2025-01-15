'use client'
import React, { useEffect, useRef, useState } from 'react';
import { Card, Button } from 'antd';
import { OlaMaps } from '@/OlaMapsWebSDKNew';
import dynamic from 'next/dynamic';

const OlaMap = ({apiKey, onLocationSelect}) => {
    const mapContainer = useRef(null);
    const markerRef = useRef(null);
    const [center, setCenter] = useState([72.8777, 19.0760]); // Default to Mumbai coordinates

  // Reverse geocode to get address from lat/lon
  const reverseGeocode = async (lat, lon) => {
    try {
      const url = `http://localhost:5000/proxy?lat=${lat}&lon=${lon}&apiKey=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();
      console.log('Reverse geocoding response:', data);
      const results = data.results || [];
      if (results.length > 0) {
        console.log('Reverse geocoding successful:', results[0]);
        return results[0]; // Return the first result
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      return null;
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Get user's current location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCenter([longitude, latitude]);

          // Initialize map
          const olaMaps = new OlaMaps({
            apiKey,
            headers: {
              'X-Request-Id': 'a623e8cd-bcd5-4d9a-beb3-ea7df3f5092e',
            },
          });

          const map = olaMaps.init({
            container: mapContainer.current,
            style: 'https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json',
            center: [longitude, latitude],
            zoom: 12,
            crossOrigin: 'anonymous',
          });

          // Add draggable marker
          const marker = olaMaps
            .addMarker({
              color: '#1890ff',
              draggable: true,
            })
            .setLngLat([longitude, latitude])
            .addTo(map);

          markerRef.current = marker;

          // Handle marker drag
          marker.on('drag', async () => {
            const lngLat = marker.getLngLat();
            const place = await reverseGeocode(lngLat.lat, lngLat.lng);
            const address = place?.formatted_address || `Lat: ${lngLat.lat}, Lon: ${lngLat.lng}`;
            onLocationSelect({ lat: lngLat.lat, lon: lngLat.lng, address: address });
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, [apiKey]);

  const handleSaveMarkerLocation = async () => {
    if (!markerRef.current) return;
    const lngLat = markerRef.current.getLngLat();
    const place = await reverseGeocode(lngLat.lat, lngLat.lng);
    const address = place?.formatted_address || `Lat: ${lngLat.lat}, Lon: ${lngLat.lng}`;
    onLocationSelect({ lat: lngLat.lat, lon: lngLat.lng, address: address });
    console.log('Marker location saved:', lngLat);
  };

      return (
        <Card>
          <div ref={mapContainer} style={{ width: '100%', height: '400px' }} />
          <Button
            type="primary"
            onClick={async() => {
             await handleSaveMarkerLocation();
            }}
            style={{ marginTop: 16 }}
          >
            Save Marker Location
          </Button>
        </Card>
      );
}

export default OlaMap;