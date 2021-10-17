import React, { Component } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polygon} from 'react-leaflet';
import { useMapEvents, useMap, setCenter, GeoJSON} from 'react-leaflet';
import data from './../shared/it_macro_regions.json';
import {CreateMarkers} from './Markers';


function BufferComponent({props}){
    const map = useMap()
    if (props.action){
        if (props.area === '3'){
            let value = props.buffer_3[0].properties.area
                if (value < 0.01){map.setZoom(12)}
                else if (value < 0.0086){map.setZoom(12)}
                else if (value < 0.01){map.setZoom(11)}
                else{map.setZoom(9)}
            return  <GeoJSON key={props.area.toString()} data={props.buffer_3} color={'green'} opacity={0.7}/>

        } else {
            let value = props.buffer_5[0].properties.area
                if (value < 0.01){map.setZoom(10)}
                else if (value < 0.1){map.setZoom(11)}
                else if (value < 0.15){map.setZoom(10)}
                else{map.setZoom(9)}
            return  <GeoJSON key={props.area.toString()} data={props.buffer_5} color={'green'} opacity={0.7}/>
        }}

    else {
        return null
    }
}

function ComuneArea({props}){
    if (props.action){
    return(
        <GeoJSON key={props.comune} data={props.area_comune} color={'firebrick'} opacity={0.6}/>
    );
    }
    else{return null}
}

function MarkersComponent({props}){
    const map = useMap()

    if (props.action){
        var Tmp;
        if (props.area === '3'){Tmp = props.stations_3}
        else{Tmp = props.stations_5}    
        map.flyTo([props.centroid.coordinates[1],props.centroid.coordinates[0]])

        return(<React.Fragment>
                    <CreateMarkers markers = {Tmp} slice={props.nstations} carburante={props.carburante}/>
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
                <BufferComponent props={props}/>
                <ComuneArea props={props} />
                <MarkersComponent props={props} />

            </MapContainer>

            )
}
