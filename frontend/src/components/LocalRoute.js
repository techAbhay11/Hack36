import React, { useEffect, useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from "primereact/button";
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { RouteService } from '../service/RouteService';
import { Messages } from 'primereact/messages';
import { useGlobalState } from '../state';

import * as turf from "@turf/turf";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
mapboxgl.accessToken = "pk.eyJ1Ijoic2FoaWxuYXJlNzgiLCJhIjoiY2t5MDdndHEwMDBlczJxb2FvMmtoemR3ZiJ9.oyPoHxer2FC8Kr5P2f6BSg";



export const LocalRoute = () => {

    const [userData, setUserData] = useGlobalState("userData");

    const mapContainer = useRef(null);
    const map = useRef(null);
    const directions = useRef(null);
    const [zoom, setZoom] = useState(11);
    const [inpLng, setInpLng] = useState('');
    const [inpLat, setInpLat] = useState('');

    const submitDisplayMessage = useRef();

    // const [checkboxValue, setCheckboxValue] = useState([]);
    const [date, setDate] = useState('');
    const [volumeRequired, setVolumeRequired] = useState('');
    const [truckType, setTruckType] = useState(null);
    const [productType, setProductType] = useState(null);
    const [distance, setDistance] = useState(null);
    const [duration, setDuration] = useState(null);
    const [placeOrigin, setPlaceOrigin] = useState('');
    const [placeDestination, setPlaceDestination] = useState('');

    const truckTypes = [
        { name: 'Light Open Body', code: 'light-open-body' },
        { name: 'Heavy Open Body', code: 'heavy-open-body' },
        { name: 'Container Body', code: 'container-body' },
        { name: 'Mini Truck', code: 'mini-truck' }
    ];

    const productTypes = [
        { name: 'Chemical' },
        { name: 'Edibles' },
        { name: 'Construction' },
        { name: 'Plastic' }
    ];

    let origin, destination;

    const initLocation = [72.7902986, 21.1628106];

    const failureCallback = (callback) => {
        console.log(callback);
    }

    useEffect(() => {

        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/light-v10",
            center: initLocation,
            zoom: zoom,
        });

        directions.current = new MapboxDirections({
            accessToken: mapboxgl.accessToken,
            unit: 'metric',
            profile: 'mapbox/driving',
            alternatives: false,
            geometries: 'geojson',
            controls: { instructions: false },
            flyTo: false
          });
          
          map.current.addControl(directions.current, 'top-right');
          map.current.scrollZoom.enable();

          
          
          directions.current.on("route", (data) => {
                console.log(data.route[0].duration, data.route[0].distance);
                setDistance(data.route[0].distance);
                setDuration(data.route[0].duration);
            });

    }, []);

    const onSubmitData = () => {

        origin = directions.current.getOrigin();
        destination = directions.current.getDestination();

        const finalDistance = Math.round(distance/1000);
        const finalDuration = Math.round(duration/3600);
        

        const routeData = {
            "truckType" : truckType.code, "username": userData.user.username, "pickupLocation": {"lat": origin.geometry.coordinates[0], "lon": origin.geometry.coordinates[0]}, "dropLocation": {"lat": origin.geometry.coordinates[0], "lon": origin.geometry.coordinates[0]},
            "volumeRequired" : volumeRequired, "date": date.toISOString().split('T')[0], "productType": productType.name, distance: finalDistance, duration: finalDuration, originName: placeOrigin, destinationName: placeDestination
        };


        const routeService = new RouteService();
        routeService.addRoute(routeData).then((res) => {
            console.log(res);
            submitDisplayMessage.current.show({ severity: 'success', summary: `Your Load Details have been submitted!`, life: 300000 });
            setDate('');
            setVolumeRequired('');
            setTruckType(null);
            setProductType(null);
            setDistance(null);
            setDuration(null);
            setPlaceOrigin('');
            setPlaceDestination('');
        });
    }


    return (
        <div className="grid p-fluid">
            
            <div className="col-12">
                <div className="card">
                    <h4>Load Details</h4>
                    <div className="grid p-fluid pt-4">
                        <div className="col-12 md:col-6">
                            <h5>Product Type</h5>
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-star"></i>
                                </span>
                                <Dropdown value={productType} onChange={(e) => setProductType(e.value)} options={productTypes} optionLabel="name" placeholder="Select" />
                            </div>
                        </div>
                        <div className="col-12 md:col-6">
                            <h5>Type of Truck</h5>
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-star"></i>
                                </span>
                                <Dropdown value={truckType} onChange={(e) => setTruckType(e.value)} options={truckTypes} optionLabel="name" placeholder="Select" />
                            </div>
                        </div>

                        <div className="col-12 md:col-6">
                            <h5>Weight of Load</h5>
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-star"></i>
                                </span>
                                <InputText placeholder="Space Available (in Tons)" value={volumeRequired} onChange={(e) => setVolumeRequired(e.target.value)}/>
                            </div>
                        </div>

                        <div className="col-12 md:col-6">
                            <h5>Date</h5>
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-sun"></i>
                                </span>
                                <Calendar showIcon showButtonBar value={date} onChange={(e) => setDate(e.value)}></Calendar>
                            </div>
                        </div>

                        <div className="col-12 md:col-6">
                            <h5>Pick Up Location</h5>
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-star"></i>
                                </span>
                                <InputText placeholder="City, Town or Village" value={placeOrigin} onChange={(e) => setPlaceOrigin(e.target.value)}/>
                            </div>
                        </div>

                        <div className="col-12 md:col-6">
                            <h5>Drop Location</h5>
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-star"></i>
                                </span>
                                <InputText placeholder="City, Town or Village" value={placeDestination} onChange={(e) => setPlaceDestination(e.target.value)}/>
                            </div>
                        </div>

                    </div>

                    <div ref={mapContainer} className="map-container" />
                    
                    <div className="col-6 md:col-6 pt-4">
                        <Button
                            label="Submit"
                            onClick={(e) => {
                                e.preventDefault();
                                // onSubmitCropData();
                                onSubmitData();
                            }}
                            className="mr-2 mb-2"
                        ></Button>
                    </div>

                    <Messages ref={submitDisplayMessage} />
                </div>
            </div>
        </div >
    )
}
