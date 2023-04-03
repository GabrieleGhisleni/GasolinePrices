import {FormState} from "../components/DetailForm";
import {Point} from "geojson";


export interface StationDetail {
    price: number,
    ultima_rilevazione: string,
    Gestore: string,
    Bandiera: string,
    Tipo_impianto: string,
    Indirizzo: string,
    Nome_impianto: string,
    Comune: string,
    idImpianto: number,
    geometry: Point
    is_old?: boolean,
}

export interface Stations {
    "1": StationDetail[],
    "3": StationDetail[],
    "5": StationDetail[],
}


export interface SearchState {
    buffer_1: string,
    buffer_3: string,
    buffer_5: string,
    area_comune: string,
    area_coverage: "1" | "3" | "5",
    number_stations: "5" | "10" | "100"
    stations: Stations,
}


const url = "https://raw.githubusercontent.com/GabrieleGhisleni/GasolinePrices/master/data/prices_for_municipality/";

async function fetchStationsData(formData: FormState): Promise<SearchState> {
    let comune = (
        formData.comune
            .normalize('NFD')
            .replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '')
            .trim()
            .replaceAll("'", '')
            .replaceAll(" ", '-')
            .toLowerCase()
    ) + '.json'

    try{
        const response = await fetch(url + comune);
        const data = await response.json();
        return {
            area_coverage: formData.area_coverage,
            buffer_1: data.buffer_1,
            buffer_3: data.buffer_3,
            buffer_5: data.buffer_5,
            area_comune: data.area_comune,
            stations: data[formData.carburante],
            number_stations: formData.number_stations,
        };
    }
    catch (e) {
        alert("Comune non trovato")
        return {} as SearchState;
    }
}

export default fetchStationsData;
