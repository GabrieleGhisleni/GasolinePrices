import React from 'react';

import {Stations,} from "../../api/fetchStationsData";
import L, {PointTuple} from "leaflet";
import {mean, std} from 'mathjs'
import {Marker, Popup, Tooltip} from "react-leaflet";
import moment from 'moment';

interface MarkersStationsProps {
    station: Stations,
    area_coverage: "1" | "3" | "5"
    number_stations: "5" | "10" | "100"

}


const MarkersStations: React.FC<MarkersStationsProps> = ({station, area_coverage, number_stations}) => {
    if (station === undefined) {
        //! initial rendering
        return (<div></div>)
    }


    // The stations of the larger area should be included in the smaller area.
    let selected_stations
    if (area_coverage === "3") {
        let buffer_1_stations = station["1"]
        let buffer_3_stations = station[area_coverage]
        let buffer_3_stations_ids = buffer_3_stations.map((stat) => stat.idImpianto)
        let buffer_1_stations_ids = buffer_1_stations.map((stat) => stat.idImpianto)
        let buffer_1_stations_ids_not_in_buffer_3 = buffer_1_stations_ids.filter((id) => !buffer_3_stations_ids.includes(id))
        let buffer_1_stations_not_in_buffer_3 = buffer_1_stations.filter((stat) => buffer_1_stations_ids_not_in_buffer_3.includes(stat.idImpianto))

        selected_stations = buffer_3_stations.concat(buffer_1_stations_not_in_buffer_3)

    } else if (area_coverage === "5") {
        let buffer_1_stations = station["1"]
        let buffer_3_stations = station["3"]
        let buffer_5_stations = station[area_coverage]
        let buffer_5_stations_ids = buffer_5_stations.map((stat) => stat.idImpianto)
        let buffer_3_stations_ids = buffer_3_stations.map((stat) => stat.idImpianto)
        let buffer_1_stations_ids = buffer_1_stations.map((stat) => stat.idImpianto)
        let buffer_1_stations_ids_not_in_buffer_3_5 = buffer_1_stations_ids.filter((id) => !buffer_3_stations_ids.includes(id))
        let buffer_1_stations_not_in_buffer_3_5 = buffer_1_stations.filter((stat) => buffer_1_stations_ids_not_in_buffer_3_5.includes(stat.idImpianto))
        let buffer_3_stations_ids_not_in_buffer_5 = buffer_3_stations_ids.filter((id) => !buffer_5_stations_ids.includes(id))
        let buffer_3_stations_not_in_buffer_5 = buffer_3_stations.filter((stat) => buffer_3_stations_ids_not_in_buffer_5.includes(stat.idImpianto))

        selected_stations = buffer_5_stations.concat(buffer_3_stations_not_in_buffer_5).concat(buffer_1_stations_not_in_buffer_3_5)

    } else {
        selected_stations = station[area_coverage]
    }

    // We want to filter out the stations that are not updated
    let stations = [...selected_stations].map(stat => ({
        ...stat,
        is_old: moment(stat.ultima_rilevazione, 'DD/MM/YYYY HH:mm:ss').diff(moment(), 'days') < -30
    }));

    stations.sort((a, b) => a.price - b.price)
    let slice_stations = stations.slice(0, parseInt(number_stations))
    let all_prices: number[] = slice_stations.filter((stat) => !stat.is_old).map((stat) => stat.price)
    let price_mean = mean(all_prices)
    // @ts-ignore
    let price_std: number = std(all_prices);

    return (
        <>
            {
                slice_stations.map((stat) => {
                        return (
                            <div className='popUp' key={"marker" + stat.idImpianto + Date.now()}>
                                <Marker
                                    position={[stat.geometry.coordinates[1], stat.geometry.coordinates[0]]}
                                    icon={getIcon(
                                        ...getIconSizeColor(stat.price, price_mean, price_std, stat.is_old)
                                    )
                                    }
                                >
                                    <Tooltip direction='top' offset={[1, 1]} opacity={0.9}><span
                                        style={{fontWeight: 'bold'}}>Prezzo: {stat.price}</span>
                                    </Tooltip>
                                    <Popup>

                                        Prezzo: <strong style={{fontSize: "1.2rem"}}>{stat.price}</strong> Euro/ litro <br/><br/>
                                        Gestore: <span style={{fontSize: ".7rem"}}>{stat.Gestore} </span><br/>
                                        Indirizzo: <a
                                        style={{fontSize: '0.6rem'}}
                                        href={`geo:${stat.geometry.coordinates[0]},{stat.geometry.coordinates[1]}`}
                                        rel="noreferrer"
                                        target='_blank'> {stat.Indirizzo} </a> <br/>
                                        Comune: {stat.Comune.charAt(0).toUpperCase() + stat.Comune.slice(1)} <br/>
                                        Ultima rilevazione: {stat.ultima_rilevazione} <br/>
                                        Bandiera: {stat.Bandiera} <br/>
                                        ID stazione : {stat.idImpianto} <br/>
                                    </Popup>
                                </Marker>
                            </div>
                        )
                    }
                )}

        </>
    )
}

export default MarkersStations;


function getIcon(url_c: string, size: PointTuple) {
    return L.icon({
        iconUrl: url_c,
        iconSize: size,
        iconAnchor: [0, 0],
        popupAnchor: [-15, -90]
    })
}

function getIconSizeColor(price: number, mean: number, std: number, is_old: boolean): [string, PointTuple] {
    let url: string, size: PointTuple
    if (is_old) {
        url = `${process.env.PUBLIC_URL}/images/marker-grey.png`;
        size = [20, 20]
    } else if (price <= mean - 0.5 * std) {
        url = `${process.env.PUBLIC_URL}/images/marker-green.png`;
        size = [20, 20]
    } else if (price <= mean) {
        url = `${process.env.PUBLIC_URL}/images/marker-orange.png`;
        size = [20, 20]
    } else if (price <= mean + std) {
        url = `${process.env.PUBLIC_URL}/images/marker-red.png`;
        size = [20, 20]
    } else {
        url = `${process.env.PUBLIC_URL}/images/marker-black.png`;
        size = [20, 20]
    }
    return [url, size]
}
