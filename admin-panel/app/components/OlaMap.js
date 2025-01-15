'use client'
import React, { useEffect, useRef, useState } from 'react';
import { Card } from 'antd';
import { OlaMaps } from '@/OlaMapsWebSDKNew';

const OlaMap = ({apiKey, onLocationSelect}) => {
    const mapContainer = useRef(null);
    const markerRef = useRef(null);
    const [center, setCenter] = useState([72.8777, 19.0760]); // Default to Mumbai coordinates

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
              marker.on('dragend', () => {
                const lngLat = marker.getLngLat();
                onLocationSelect({
                  lat: lngLat.lat,
                  lon: lngLat.lng,
                });
              });
    
              return () => map.remove();
            },
            (error) => {
              console.error('Error getting location:', error);
            }
          );
        }
      }, [apiKey]);

      return (
        <Card>
          <div 
            ref={mapContainer} 
            style={{ width: '100%', height: '400px' }}
          />
        </Card>
      );
}

export default OlaMap;