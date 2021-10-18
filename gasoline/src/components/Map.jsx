import React, { Component } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polygon} from 'react-leaflet';
import { useMapEvents, useMap, setCenter, GeoJSON, flyToBounds, FeatureGroup} from 'react-leaflet';
import data from './../shared/it_macro_regions.json';
import {CreateMarkers} from './Markers';
import L from 'leaflet';


function BufferComponent({props}){
    const map = useMap()
    if (props.action){
        if (props.area === '3'){
            var multipolygon = L.geoJson(props.buffer_3);
            map.flyToBounds(multipolygon.getBounds());
            return <GeoJSON key={props.area.toString()} data={props.buffer_3} color={'steelblue'} opacity={1}/>

        } else {
            var multipolygon = L.geoJson(props.buffer_5);
            map.flyToBounds(multipolygon.getBounds());
            return  <GeoJSON key={props.area.toString()} data={props.buffer_5} color={'steelblue'} opacity={1}/>
        }}

    else {
        return null
    }
}

function ComuneArea({props}){
    if (props.action){
    return(
        <GeoJSON key={props.comune} data={props.area_comune} color={'saddlebrown'} opacity={1}/>
    );
    }
    else{return null}
}

function MarkersComponent({props}){
    if (props.action){
        var Tmp;
        if (props.area === '3'){Tmp = props.stations_3}
        else{Tmp = props.stations_5}  
        

        return(<React.Fragment>
                    <CreateMarkers markers = {Tmp} slice={props.nstations} carburante={props.carburante}/>
                </React.Fragment>
        )
    } 
    else if (props.first){
        return <GeoJSON key={'default'} data={data.features}/>
    }
    else {return null}
}

export const FunctionalMap = ({props}) => {
    return(
            <MapContainer 
                center={[41.8933203,12.4829321]} 
                zoom={6}
                scrollWheelZoom={true} 
                className='mapContainer'>
                <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                <BufferComponent props={props}/>
                <ComuneArea props={props} />
                <MarkersComponent props={props} />

            </MapContainer>

            )
}
