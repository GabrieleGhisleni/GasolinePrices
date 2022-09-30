import React from "react";
import L from 'leaflet';
import { MapContainer, TileLayer} from 'react-leaflet';
import { useMap, GeoJSON } from 'react-leaflet';
import {CreateMarkers} from './Markers';
import data from './../shared/it_macro_regions.json';

function FlyTo({props}){
    const map = useMap()
    if (props.action){
        var buff;
        switch (props.area) {
            case "1":
                buff = L.geoJson(props.buffer_1);
                break
            case "3":
                buff = L.geoJson(props.buffer_3);
                break;
            case "5":
                buff = L.geoJson(props.buffer_5);
                break
            default:
                break;
        }
        map.flyToBounds(buff.getBounds());
        return null
    }
    else if (props.first){return <GeoJSON key={'default'} data={data.features}/>}
    else {return null}
}

function BufferComponent({props}){
    if (props.action){
        switch (props.area) {
            case "1":
                return <GeoJSON key={props.area.toString()} data={props.buffer_1} color={'steelblue'} opacity={1}/>
            case "3":
                return <GeoJSON key={props.area.toString()} data={props.buffer_3} color={'steelblue'} opacity={1}/>
            case "5":
                return  <GeoJSON key={props.area.toString()} data={props.buffer_5} color={'steelblue'} opacity={1}/>
            default: 
                return null
        }}
    else {return null}}


function ComuneArea({props}){
    if (props.action){return(<GeoJSON key={props.comune} data={props.area_comune} color={'saddlebrown'} opacity={1}/>)}
    else{return null}
}

function MarkersComponent({props}){
    if (props.action){
        var stations
        switch (props.area) {
            case '1':
                stations = props.stations_1;
                break;
            case '3':
                stations = props.stations_3;
                break;
            case '5':
                stations = props.stations_5;
                break;
            default:
                break;
        }
        return(<CreateMarkers props = {props} markers = {stations}/>)
    } 
    else {return null}
}

export const FunctionalMap = ({props}) => {
    return(
            <MapContainer 
                center={[41.8933203, 14.4829321]} 
                scrollWheelZoom={true}
                zoom = {5}
                className='mapContainer'
                style={{border:'solid 1px rgb(103, 121, 105)', borderRadius:'20px' }}>
                <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                <FlyTo props={props}/>
                <MarkersComponent props={props} />
                <BufferComponent props={props}/>
                <ComuneArea props={props} />
            </MapContainer>
            )
}
