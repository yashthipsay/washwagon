import ('../../OlaMapsWebSDKNew').then((module) => {
    const { OlaMaps } = module;
});
import { Card, Input, List } from 'antd';
import React, { useState, useEffect } from 'react';
import { getCurrentLocation } from '../utils/getCurrentLocation';

const Autocomplete = ({apiKey, onSelect}) => {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [location, setLocation] = useState({ lat: null, lon: null });

    useEffect(() => {
        getCurrentLocation()
        .then((loc) => setLocation(loc))
        .catch((error) => console.error('Error getting location:', error));
    }, [])

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        if (e.target.value.length > 2) {
          fetchSuggestions(e.target.value);
        } else {
          setSuggestions([]);
        }
      };

      const handleSuggestionClick = (item) => {
        setInputValue(item.description);
        setSuggestions([]); // Clear suggestions
        if (onSelect) {
          onSelect(item);
        }
      };

      const fetchSuggestions = async (input) => {
        if (!location.lat || !location.lon) return;
    
        const response = await fetch(
          `https://api.olamaps.io/places/v1/autocomplete?input=${input}&api_key=tx0FO1vtsTuqyz45MEUIJiYDTFMJOPG9bWR3Yd4k`,
          {
            headers: {
              'X-Request-Id': 'a623e8cd-bcd5-4d9a-beb3-ea7df3f5092e',
            },
          }
        );
    
        const data = await response.json();
        if (data.predictions) {
          setSuggestions(data.predictions);
        }
      };

      return (
        <div style={{ position: 'relative', width: '100%' }}>
        <Input
          placeholder="Enter a location"
          value={inputValue}
          onChange={handleInputChange}
          style={{ marginBottom: 12 }}
        />
        {suggestions.length > 0 && (
          <List
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              zIndex: 1000,
              background: '#fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              borderRadius: '4px',
              maxHeight: '300px',
              overflowY: 'auto'
            }}
            dataSource={suggestions}
            renderItem={(item) => (
              <List.Item
                onClick={() => handleSuggestionClick(item)}
                style={{ 
                  cursor: 'pointer',
                  padding: '8px 12px',
                  transition: 'background-color 0.3s'
                }}
                className="location-suggestion-item"
              >
                {item.description}
              </List.Item>
            )}
          />
        )}
      </div>
      );
    };

    export default Autocomplete;