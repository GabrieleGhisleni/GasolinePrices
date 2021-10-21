import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, Tooltip} from 'react-leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import L from 'leaflet'
import { control } from 'leaflet';

function getIcon(url_c, size){
    return L.icon({
        iconUrl : url_c,
        iconSize:  size, 
        iconAnchor:   [0, 0],
        popupAnchor:  [-15, -90]
    }

    )
}

export const CreateMarkers = ({markers, slice, carburante}) => {
    var i=0, size=[[17,17],[15,15]], color=[], url, sz;

    var green = 'https://www.pikpng.com/pngl/b/36-369401_location-marker-icon-google-maps-pointer-elsavadorla-google.png'
    var orange = "https://www.pinclipart.com/picdir/big/79-798120_orange-map-pin-orange-location-icon-png-clipart.png"
    var red = 'https://cdn.pixabay.com/photo/2014/04/02/10/45/location-304467_1280.png'
    if (slice == 5){color = [green,orange,red,red,red]}
    else {
        color = [green,orange,orange,orange]
        for (let j = 0; j< (slice-3); j++ ){
            size.push([12,12])
            color.push(red)
        }
    }

    const stations = markers.map((stat) => {
        url = color.at(i)
        sz = size.at(i)
        if (sz === undefined){sz = [12,12]}
        // if (i==0){sz = [20,20]}
        // else{sz=[12,12]}
        i++
        return (<div className='popUp'>
                <Marker 
                position={[stat.points[0].geometry.coordinates[1],stat.points[0].geometry.coordinates[0]]}
                icon = {getIcon(url, sz)}>
                    <Tooltip direction='top' offset={[1,0]} permanent><span style={{fontWeight:'bold'}}>{stat.price}</span></Tooltip> 
                    <Popup>
                        Prezzo {carburante}: <strong style={{fontSize:"1.2rem"}}>{stat.price}</strong> Euro/ litro <br/><br/>
                        Gestore: <span style={{fontSize:".7rem"}}>{stat.Gestore} </span><br/>
                        Indirizzo: <a 
                                    style={{fontSize:'0.6rem'}}
                                    href= {`geo:${stat.points[0].geometry.coordinates[1]},{stat.points[0].geometry.coordinates[0]}`} 
                                    target='_blank'> {stat.Indirizzo} </a> <br/>
                        Comune: {stat.Comune.charAt(0).toUpperCase() + stat.Comune.slice(1)}  <br/>
                        Ultima rilevazione: {stat.date} <br/>
                        Bandiera: {stat.Bandiera} <br/>
                        ID: {stat.id } <br/>
                    </Popup>
                </Marker>
                </div>
            )
        })

    return (stations.slice(0, slice))

}




export default {CreateMarkers};