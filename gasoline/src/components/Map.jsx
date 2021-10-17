import React, { Component } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polygon} from 'react-leaflet';
import { useMapEvents, useMap, setCenter, GeoJSON} from 'react-leaflet';
import data from './../shared/it_macro_regions.json';
import {CreateMarkers} from './Markers';


function BufferComponent({props}){
    if (props.action){
        if (props.area == '3'){
            return  <GeoJSON key={props.area.toString()} data={props.buffer_3} color={'green'}/>
        } else {
            return  <GeoJSON key={props.area.toString()} data={props.buffer_5} color={'green'}/>
        }}

    else {
        return null
    }
}

function MarkersComponent({props}){
    const map = useMap()
    if (props.action){
        if (props.area === '3'){map.setZoom(12.5)}
        else{map.setZoom(12)}
        map.flyTo([props.centroid.coordinates[1],props.centroid.coordinates[0]])
        return(<React.Fragment>
                <CreateMarkers markers = {props.stations}
                                 slice={5}
                                 carburante={props.carburante}/>
                </React.Fragment>
        )
    } 
    else{
        return <GeoJSON key={'default'} data={data.features}/>
    }
}

export const FunctionalMap = ({props}) => {
    return(
            <MapContainer 
                center={[props.coordinates[0], props.coordinates[1]]} 
                zoom={6}
                scrollWheelZoom={true} 
                className='mapContainer'>
                <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                <MarkersComponent props={props} />
                <BufferComponent props={props}/>
            </MapContainer>

            )
}
