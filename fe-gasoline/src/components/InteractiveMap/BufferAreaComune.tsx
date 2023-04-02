import React from "react";
import {GeoJSON} from "react-leaflet";

interface BufferAreaComuneProps {
    area_coverage: "1" | "3" | "5",
    buffer_1: string,
    buffer_3: string,
    buffer_5: string,
}

const BufferAreaComune: React.FC<BufferAreaComuneProps> = ({area_coverage, buffer_5, buffer_1, buffer_3}) => {
    let geoJsonStyle = {
        color: 'steelblue',
        weight: 2,
        opacity: 1,
        fillColor: 'steelblue',
        fillOpacity: 0.2
    };

    switch (area_coverage) {
        case "1":
            return <GeoJSON key="buffer1" data={JSON.parse(buffer_1)} style={geoJsonStyle}/>
        case "3":
            return <GeoJSON key="buffer3" data={JSON.parse(buffer_3)} style={geoJsonStyle}/>
        case "5":
            return <GeoJSON key="buffer5" data={JSON.parse(buffer_5)} style={geoJsonStyle}/>
        default:
            //! initial rendering
            return <></>
    }
}


export default BufferAreaComune;
