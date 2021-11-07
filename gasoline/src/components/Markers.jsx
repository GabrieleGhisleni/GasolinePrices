import React from 'react';
import { Marker, Popup, Tooltip} from 'react-leaflet';
import L from 'leaflet'

function getIcon(url_c, size){
    return L.icon({
        iconUrl : url_c,
        iconSize:  size, 
        iconAnchor:   [0, 0],
        popupAnchor:  [-15, -90]
    })
}

export const CreateMarkers = ({props, markers}) => {
    var green = props.mean - 0.5 * props.standard_deviation;
    var yellow = props.mean;
    var red  = props.mean +  props.standard_deviation;
    var death  = props.mean +  (2*props.standard_deviation);

    var url_death = 'https://icon-library.com/images/skull-crossbones-icon/skull-crossbones-icon-6.jpg'
    var url_green = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png'
    var url_red = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png'
    var url_yellow = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png'
    
    var idx = 0;
    var flag = false;
    var tooltip;
    const stations = markers.map((stat) => {
        if (idx <= props.nstations) {
            ++idx
            var url, size
            if (stat.price <= green) {url = url_green; size = [20,20]; flag=true}
            else if (stat.price <= yellow)  {url = url_yellow; size = [17,17]; flag=true}
            else if (stat.price <= death)  {url = url_red; size = [16,16]; flag=false}
            else if (stat.price >= death)  {url = url_death; size = [16,16]; flag=false}
            else {url = url_death; size = [14,14];}
            if ((flag)) {tooltip = <Tooltip direction='top' offset={[1,0]} permanent><span style={{fontWeight:'bold'}}>{stat.price}</span></Tooltip> }
            else {tooltip = <Tooltip direction='top' offset={[1,1]} opacity={0.9} ><span style={{fontWeight:'bold'}}>{stat.price}</span></Tooltip> }

            return (<div className='popUp'>
                        <Marker 
                        position={[stat.points[0].geometry.coordinates[1],stat.points[0].geometry.coordinates[0]]}
                        icon = {getIcon(url, size)}>
                            {tooltip}
                            <Popup>
                                Prezzo {props.carburante}: <strong style={{fontSize:"1.2rem"}}>{stat.price}</strong> Euro/ litro <br/><br/>
                                Gestore: <span style={{fontSize:".7rem"}}>{stat.Gestore} </span><br/>
                                Indirizzo: <a 
                                            style={{fontSize:'0.6rem'}}
                                            href= {`geo:${stat.points[0].geometry.coordinates[1]},${stat.points[0].geometry.coordinates[0]}`} 
                                            target='_blank'> {stat.Indirizzo} </a> <br/>
                                Comune: {stat.Comune.charAt(0).toUpperCase() + stat.Comune.slice(1)}  <br/>
                                Ultima rilevazione: {stat.ultima_rilevazione} <br/>
                                Bandiera: {stat.Bandiera} <br/>
                                ID stazione : {stat.idImpianto} <br/>
                            </Popup>
                        </Marker>
                    </div> 
                    )

        }
        else {return <div></div>}
    })

    return (stations);
}




export default {CreateMarkers};