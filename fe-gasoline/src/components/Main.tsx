import React, {useState} from "react";

import {Row, Col} from 'reactstrap';
import {FeatureCollection} from "geojson";

import {FormState} from "./DetailForm";
import DetailForm from "./DetailForm";
import fetchStationsData, {SearchState} from "../api/fetchStationsData";
import FunctionalMap from "./InteractiveMap/FunctionalMap";

interface MainProps {
    italyMap: FeatureCollection
    nameHints: string[]
}

const Main: React.FC<MainProps> = ({italyMap, nameHints}) => {
    const [searchState, setSearchState] = useState<SearchState>({} as SearchState);

    // This is the function that is passed to the DetailForm component and
    // refresh only a couple of states for better map interaction.
    const smartRefresh = (evt: React.ChangeEvent<HTMLInputElement>) => {
        setSearchState({...searchState, [evt.target.name]: evt.target.value})
    }

    // This is the function that is passed to the DetailForm component and
    // only when the form is submitted it refresh all the states by calling the
    // repository files.
    const onSubmit = ((formData: FormState) => {
        fetchStationsData(formData).then((data) => {
            setSearchState(data)
        });
    });


    return (
        <React.Fragment>
            <Row className='primaryRow align-items-center'>
                <Col xs='12' sm='5' md='5' className='text-center'>
                    <DetailForm onSubmit={onSubmit} nameHints={nameHints} smartRefresh={smartRefresh}/>
                </Col>
                <Col xs='12' sm='7' className='text-center' id='map'>
                    <FunctionalMap
                        italyMap={italyMap}
                        buffer_1={searchState.buffer_1}
                        buffer_3={searchState.buffer_3}
                        buffer_5={searchState.buffer_5}
                        number_stations={searchState.number_stations}
                        area_coverage={searchState.area_coverage}
                        stations = {searchState.stations}
                    />
                </Col>
            </Row>
        </React.Fragment>
    )

}

export default Main;
