import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon} from 'react-leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import L from 'leaflet'

function getIcon(url, size){
    return L.icon({
        iconUrl : url,
        iconSize:  size, 
        iconAnchor:   [22, 94],
        popupAnchor:  [-15, -90]
    }

    )
}

export const CreateMarkers = ({markers, slice, carburante}) => {
    var i = 0;
    var url;
    var size = [15,15];
    
    const stations = markers.price.map((stat) => {
        if (i === 0){
            url = 'https://www.pikpng.com/pngl/b/36-369401_location-marker-icon-google-maps-pointer-elsavadorla-google.png'
            size = [30,30]
        }
        else if (i === 1){
            url="https://www.pinclipart.com/picdir/big/79-798120_orange-map-pin-orange-location-icon-png-clipart.png" 
            size= [20,20]}
        else{url='https://cdn.pixabay.com/photo/2014/04/02/10/45/location-304467_1280.png'}
        i++

        return (<div className='popUp'>
                <Marker 
                position={[stat.geometry.coordinates[1],stat.geometry.coordinates[0]]}
                icon = {getIcon(url, size)}>
                    <Popup>
                        Prezzo {carburante}: <strong style={{fontSize:"1.2rem"}}>{stat.price}</strong> Euro/ litro <br/><br/>
                        Gestore: <span style={{fontSize:".7rem"}}>{stat.Gestore} </span><br/>
                        Indirizzo: {stat.Indirizzo} <br/>
                        Bandiera: {stat.Bandiera} <br/>
                        Comune: {stat.Comune}  <br/>
                        Coordinates: {stat.geometry.coordinates[1]} {stat.geometry.coordinates[0]}
                    </Popup>
                </Marker>
                </div>
            )
        })

    return (stations.slice(0, slice))

}




export default {CreateMarkers};