import {FeatureCollection} from "geojson";
import React from "react";
import {GeoJSON, useMap} from "react-leaflet";
import L from "leaflet";

interface FlyToMapProps {
    area_coverage: string,
    buffer_1: string,
    buffer_3: string,
    buffer_5: string,
    italy_features: FeatureCollection
}

export const FlyToMap: React.FC<FlyToMapProps> = ({
                                                      area_coverage,
                                                      buffer_1,
                                                      buffer_3,
                                                      buffer_5,
                                                      italy_features
                                                  }) => {
    const map = useMap()
    let area_of_interest;

    switch (area_coverage) {
        case "1":
            area_of_interest = L.geoJson(JSON.parse(buffer_1));
            break
        case "3":
            area_of_interest = L.geoJson(JSON.parse(buffer_3));
            break;
        case "5":
            area_of_interest = L.geoJson(JSON.parse(buffer_5));
            break;
        default:
            //! initial rendering
            area_of_interest = null
    }

    if (area_of_interest != null) {
        map.flyToBounds(area_of_interest.getBounds());
        return <></>
    }

    return (<GeoJSON key={'default'} data={italy_features}/>)

}

export default FlyToMap;
