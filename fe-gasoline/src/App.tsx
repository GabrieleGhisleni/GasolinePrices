import React, {useEffect, useState} from 'react';

import 'jquery';
import 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';

import './css/style.css';
import "leaflet/dist/leaflet.css";

import MyNavbar from "./components/NavBar";
import Footer from "./components/Footer";
import Main from "./components/Main";
import {FeatureCollection} from "geojson";
// import countapi from "countapi-js";

function App() {
  const [geojsonData, setGeojsonData] = useState<FeatureCollection>({} as FeatureCollection);
  const [nameHints, setNameHints] = useState<string[]>([]);

    useEffect(() => {
        // countapi.hit('opengasoline.com', process.env.REACT_APP_COUNTER_KEY || "default");

        fetch(`${process.env.PUBLIC_URL}/shared/names.json`)
            .then(response => response.json())
            .then(data => {
                const castedHints = data['name'] as string[];
                setNameHints(castedHints);
            });

        fetch(`${process.env.PUBLIC_URL}/shared/it_macro_regions.json`)
            .then(response => response.json())
            .then(data => {
                const castedGeojson = data as FeatureCollection;
                setGeojsonData(castedGeojson);
            });
    }, []);


  if (Object.keys(geojsonData).length === 0) {
    return <div>Loading...</div>;
  }

  return (
      <>
        <MyNavbar />
        <Main italyMap={geojsonData} nameHints={nameHints}/>
        <Footer />
      </>
  );
}

export default App;
