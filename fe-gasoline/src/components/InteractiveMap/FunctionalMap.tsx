import React from "react";
import {MapContainer, TileLayer} from 'react-leaflet'
import {FeatureCollection} from 'geojson';

import FlyToMap from "./FlyToMap";
import BufferAreaComune from "./BufferAreaComune";
import MarkersStations from "./Markers";
import { Stations} from "../../api/fetchStationsData";


interface FunctionalMapProps {
    italyMap: FeatureCollection,
    buffer_1: string,
    buffer_3: string,
    buffer_5: string,
    area_coverage: "1" | "3" | "5",
    number_stations: "5" | "10" | "15"
    stations: Stations,
}

const FunctionalMap: React.FC<FunctionalMapProps> = ({
                                                         italyMap,
                                                         buffer_1,
                                                         buffer_3,
                                                         buffer_5,
                                                         area_coverage,
                                                         number_stations,
                                                         stations
                                                     }) => {
    return (
        <MapContainer
            center={[41.8933203, 14.4829321]}
            scrollWheelZoom={true}
            zoom={5}
            className='mapContainer'
            style={{border: 'solid 1px rgb(103, 121, 105)', borderRadius: '20px'}}
        >
            <FlyToMap area_coverage={area_coverage}
                      buffer_1={buffer_1}
                      buffer_3={buffer_3}
                      buffer_5={buffer_5}
                      italy_features={italyMap}
            />
            <MarkersStations
                station={stations}
                number_stations={number_stations}
                area_coverage={area_coverage}
            />
            <BufferAreaComune
                area_coverage={area_coverage}
                buffer_1={buffer_1}
                buffer_3={buffer_3}
                buffer_5={buffer_5}
            />
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
        </MapContainer>
    )
}

export default FunctionalMap;
