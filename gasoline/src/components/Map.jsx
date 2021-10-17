import React, { Component } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polygon} from 'react-leaflet';
import { useMapEvents, useMap, setCenter, GeoJSON} from 'react-leaflet';
import data from './../shared/it_macro_regions.json';

function MarkersComponent({props}){
    const map = useMap()
    if (props.action){
        console.log(data)
        const coords =[
          {lat: 45.669540,lng: 9.496720},
          {lat: 43.669540, lng: 9.496720},
          
        ]
        console.log('here', map.getCenter(), 'props',props)
        map.setZoom(13)
        map.flyTo([45.669540,9.496720])
        return(<React.Fragment>
                <Marker position={[45.669540, 9.496720]}>
                    <Popup>Hello world</Popup>
                </Marker>
                <Marker position={[45.669540, 9.506722]}>
                    <Popup>Hello world</Popup>
                </Marker>
                <Marker position={[45.669540, 9.456725]}>
                    <Popup>Hello world</Popup>
                </Marker>
                <Polygon color={'red'} positions={coords}/>
                </React.Fragment>
        )
    } 
    else{
            return null

    }
}



export const FunctionalMap = ({props}) => {
    console.log(data.features)

    return(
            <MapContainer 
                center={[props.coordinates[0], props.coordinates[1]]} 
                zoom={props.zoom} 
                scrollWheelZoom={false} 
                className='mapContainer'>
                <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                <GeoJSON data={data.features}/>
                
                <MarkersComponent props={props} />
            </MapContainer>

            )
}




// class Map extends Component{
//     constructor(props){
//         super(props)

//     }  
//     render(){
//         console.log('zooom', this.props.zoom, typeof(this.props.zoom), 'poly', this.props.poly)

//         return(

//                 <MapContainer 
//                     center={[this.props.coordinates[0], this.props.coordinates[1]]} 
//                     zoom={this.props.zoom} 
//                     scrollWheelZoom={false} 
//                     className='mapContainer'>

//                     <TileLayer
//                     attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
//                     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>

//                     <Polygon pathOptions={{color:'red'}} positions={IT} />

//                     <MarkersComponent />


//                 </MapContainer>

//         )
//     }
// }

// export default Map;