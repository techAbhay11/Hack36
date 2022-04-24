import React, { useRef, useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

import * as turf from "@turf/turf";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
mapboxgl.accessToken = "pk.eyJ1Ijoic2FoaWxuYXJlNzgiLCJhIjoiY2t5MDdndHEwMDBlczJxb2FvMmtoemR3ZiJ9.oyPoHxer2FC8Kr5P2f6BSg";


export const Directions = (props) => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(72.87);
    const [lat, setLat] = useState(19.07);
    const [zoom, setZoom] = useState(11);
    const [inpLng, setInpLng] = useState('');
    const [inpLat, setInpLat] = useState('');

    const truckLocation = [-83.093, 42.376];
    const warehouseLocation = [-83.083, 42.363];
    const lastAtRestaurant = 0;
    let keepTrack = [];
    const pointHopper = {};
    let restaurantIndex;

    const warehouse = turf.featureCollection([turf.point(warehouseLocation)]);
    const dropoffs = turf.featureCollection([]);
    const nothing = turf.featureCollection([]);

    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/light-v10",
            center: truckLocation,
            zoom: zoom,
        });
        // map.current.addControl(
        //     new mapboxgl.GeolocateControl({
        //         positionOptions: {
        //             enableHighAccuracy: true,
        //         },
        //         // When active the map will receive updates to the device's location as it changes.
        //         trackUserLocation: true,
        //         // Draw an arrow next to the location dot to indicate which direction the device is heading.
        //         showUserHeading: true,
        //     })
        // );
    });

    const moveMap = (lat, lng) => {
        map.current.flyTo({
            center: [lat, lng],
            essential: true, // this animation is considered essential with respect to prefers-reduced-motion
        });
    };

    const addWaypoints = async function (event) {
        // When the map is clicked, add a new drop off point
        // and update the `dropoffs-symbol` layer
        await newDropoff(map.current.unproject(event.point));
        updateDropoffs(dropoffs);
    }

    async function newDropoff(coordinates) {
        // Store the clicked point as a new GeoJSON feature with
        // two properties: `orderTime` and `key`
        const pt = turf.point([coordinates.lng, coordinates.lat], {
          orderTime: Date.now(),
          key: Math.random()
        });
        dropoffs.features.push(pt);
        pointHopper[pt.properties.key] = pt;
      
        // Make a request to the Optimization API
        const query = await fetch(assembleQueryURL(), { method: 'GET' });
        const response = await query.json();
      
        // Create an alert for any requests that return an error
        if (response.code !== 'Ok') {
          const handleMessage =
            response.code === 'InvalidInput'
              ? 'Refresh to start a new route. For more information: https://docs.mapbox.com/api/navigation/optimization/#optimization-api-errors'
              : 'Try a different point.';
          alert(`${response.code} - ${response.message}\n\n${handleMessage}`);
          // Remove invalid point
          dropoffs.features.pop();
          delete pointHopper[pt.properties.key];
          return;
        }
        // Create a GeoJSON feature collection
        const routeGeoJSON = turf.featureCollection([
          turf.feature(response.trips[0].geometry)
        ]);
        // Update the `route` source by getting the route source
        // and setting the data equal to routeGeoJSON
        map.current.getSource('route').setData(routeGeoJSON);
      }
      
      
    const updateDropoffs = function (geojson) {
        map.current.getSource('dropoffs-symbol').setData(geojson);
    }

    const assembleQueryURL = function() {
        // Store the location of the truck in a constant called coordinates
        const coordinates = [truckLocation];
        const distributions = [];
        keepTrack = [truckLocation];
      
        // Create an array of GeoJSON feature collections for each point
        const restJobs = Object.keys(pointHopper).map((key) => pointHopper[key]);
      
        // If there are any orders from this restaurant
        if (restJobs.length > 0) {
          // Check to see if the request was made after visiting the restaurant
          const needToPickUp =
            restJobs.filter((d) => {
              return d.properties.orderTime > lastAtRestaurant;
            }).length > 0;
      
          // If the request was made after picking up from the restaurant,
          // Add the restaurant as an additional stop
          if (needToPickUp) {
            restaurantIndex = coordinates.length;
            // Add the restaurant as a coordinate
            coordinates.push(warehouseLocation);
            // push the restaurant itself into the array
            keepTrack.push(pointHopper.warehouse);
          }
      
          for (const job of restJobs) {
            // Add dropoff to list
            keepTrack.push(job);
            coordinates.push(job.geometry.coordinates);
            // if order not yet picked up, add a reroute
            if (needToPickUp && job.properties.orderTime > lastAtRestaurant) {
              distributions.push(`${restaurantIndex},${coordinates.length - 1}`);
            }
          }
        }
      
        // Set the profile to `driving`
        // Coordinates will include the current location of the truck,
        return `https://api.mapbox.com/optimized-trips/v1/mapbox/driving/${coordinates.join(
          ';'
        )}?distributions=${distributions.join(
          ';'
        )}&overview=full&steps=true&geometries=geojson&source=first&access_token=${
          mapboxgl.accessToken
        }`;
      }
 

    useEffect(() => {
        if (!map.current) return; // wait for map to initialize

        map.current.on('load', async () => {
            const marker = document.createElement('div');
            marker.className = 'truck';
          
            // Create a new marker
            new mapboxgl.Marker(marker).setLngLat(truckLocation).addTo(map.current);

            map.current.addLayer({
                id: 'warehouse',
                type: 'circle',
                source: {
                  data: warehouse,
                  type: 'geojson'
                },
                paint: {
                  'circle-radius': 20,
                  'circle-color': 'white',
                  'circle-stroke-color': '#3887be',
                  'circle-stroke-width': 3
                }
              });
              
            // Create a symbol layer on top of circle layer
            map.current.addLayer({
                id: 'warehouse-symbol',
                type: 'symbol',
                source: {
                  data: warehouse,
                  type: 'geojson'
                },
                layout: {
                  'icon-image': 'grocery-15',
                  'icon-size': 1
                },
                paint: {
                  'text-color': '#3887be'
                }
              });

            map.current.addSource('route', {
                type: 'geojson',
                data: nothing
              });
              
            map.current.addLayer(
                {
                  id: 'routeline-active',
                  type: 'line',
                  source: 'route',
                  layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                  },
                  paint: {
                    'line-color': '#3887be',
                    'line-width': ['interpolate', ['linear'], ['zoom'], 12, 3, 22, 12]
                  }
                },
                'waterway-label'
              );

            map.current.addLayer(
                {
                  id: 'routearrows',
                  type: 'symbol',
                  source: 'route',
                  layout: {
                    'symbol-placement': 'line',
                    'text-field': '▶',
                    'text-size': ['interpolate', ['linear'], ['zoom'], 12, 24, 22, 60],
                    'symbol-spacing': ['interpolate', ['linear'], ['zoom'], 12, 30, 22, 160],
                    'text-keep-upright': false
                  },
                  paint: {
                    'text-color': '#3887be',
                    'text-halo-color': 'hsl(55, 11%, 96%)',
                    'text-halo-width': 3
                  }
                },
                'waterway-label'
              );
            
            map.current.addLayer({
                id: 'dropoffs-symbol',
                type: 'symbol',
                source: {
                  data: dropoffs,
                  type: 'geojson'
                },
                layout: {
                  'icon-allow-overlap': true,
                  'icon-ignore-placement': true,
                  'icon-image': 'marker-15'
                }
              });
            
            
            await map.current.on('click', addWaypoints);

        });

        map.current.on("move", () => {
            setLng(map.current.getCenter().lng.toFixed(4));
            setLat(map.current.getCenter().lat.toFixed(4));
            setZoom(map.current.getZoom().toFixed(2));
        });
    });

    return (
        <div>
            {/*<div className="sidebar">
                Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
            </div>*/}
            <div ref={mapContainer} className="map-container" />

            {/*<InputText type="text" value={inpLat} onChange={(e) => setInpLat(e.target.value)} placeholder="Lat"></InputText>
            <InputText type="text" value={inpLng} onChange={(e) => setInpLng(e.target.value)} placeholder="Lng"></InputText>
            <Button
                label="Submit"
                onClick={(e) => {
                    e.preventDefault();
                    setLat(inpLat);
                    setLng(inpLng);
                    moveMap(inpLng, inpLat);
                }}
                className="mr-2 mb-2"
            ></Button>*/}
        </div>
    );
};
