from shapely.geometry import mapping, MultiPolygon
import geopandas as gpd
from loguru import logger
from dataclasses import dataclass
import datetime as dt
import pandas as pd
import json
import sys
import os
import utils


@dataclass
class StaticStations:
    impianti_url: str = "https://www.mise.gov.it/images/exportCSV/anagrafica_impianti_attivi.csv"
    municipality: str = "./data/municipalities.geojson"

    def __init__(self):
        stations_tmp_df = (
            pd.read_csv(self.impianti_url, delimiter=";", skiprows=1, on_bad_lines="skip")
            .dropna(subset=["Latitudine", "Longitudine"])
            .reset_index(drop=True)
        )
        logger.info(f"fetched stations_tmp_df at {self.impianti_url}")
        self.geo_stations = (
            gpd.GeoDataFrame(
                stations_tmp_df,
                crs="EPSG:4326",
                geometry=gpd.points_from_xy(stations_tmp_df.Longitudine, stations_tmp_df.Latitudine)
            )
            .pipe(lambda df: df.loc[df.geometry.is_valid])
        )
        logger.info(f"loaded into geo pandas format")

        self.municipalities = gpd.read_file(self.municipality)
        logger.info(f"loaded municipalityat: {self.municipality}")

    def update_static_storage(self):
        storage = []
        total_error, actual, remaining, start = (
            0,
            0,
            len(self.municipalities),
            dt.datetime.now(),
        )

        for idx, row in self.municipalities.iterrows():
            try:
                storage.append(
                    self.process_municipality(self.municipalities.iloc[idx : idx + 1])
                )
            except Exception as e:
                print(e)
                total_error += 1
            actual += 1
            if actual % 1000 == 0:
                print(
                    f"actual={actual}, remaining={remaining-actual}, execution time: {dt.datetime.now() - start}"
                )

        print(
            f"Finished processing, total error={total_error} execution time: {dt.datetime.now() - start}"
        )
        res = pd.concat(storage)
        res.to_csv("./data/municipalities.csv.zip", compression="zip", index=False)
        print(f"Finished saving, execution time: {dt.datetime.now() - start}")

    def process_municipality(self, comune):
        comune_max_buf = utils.serialize_buffer(comune.simplify(500).buffer(5000))
        comune_three_buf = utils.serialize_buffer(comune.simplify(500).buffer(3000))
        comune_one_buf = utils.serialize_buffer(comune.simplify(500).buffer(1000))

        area_comune = utils.create_geojson(utils.serialize_buffer(comune.buffer(0).simplify(10)))
        buffer_one_geojson = utils.create_geojson(comune_one_buf)
        buffer_three_geojson = utils.create_geojson(comune_three_buf)
        buffer_max_geojson = utils.create_geojson(comune_max_buf)
        centroid = utils.create_geojson(comune_max_buf.centroid)

        stats_5 = self.geo_stations[
            self.geo_stations.geometry.values.within(comune_max_buf)
        ]

        all_stations = stats_5.copy()
        stations_in_one_buffer = stats_5[stats_5.geometry.values.within(comune_one_buf)]

        stations_in_three_buffer = stats_5[
            (
                stats_5.geometry.values.within(comune_three_buf)
                & (
                    ~(
                        stats_5.idImpianto.isin(
                            stations_in_one_buffer.idImpianto
                        )
                    )
                )
            )
        ]
        stations_in_max_buffer = stats_5[
            (
                (
                    ~(
                        stats_5.idImpianto.isin(
                            stations_in_three_buffer.idImpianto
                        )
                    )
                )
                & (
                    ~(
                        stats_5.idImpianto.isin(
                            stations_in_one_buffer.idImpianto
                        )
                    )
                )
            )
        ]

        unique_one = stations_in_one_buffer.idImpianto.unique().tolist()
        unique_one = [str(x) for x in unique_one]
        unique_three = stations_in_three_buffer.idImpianto.unique().tolist()
        unique_three = [str(x) for x in unique_three]
        unique_five = stations_in_max_buffer.idImpianto.unique().tolist()
        unique_five = [str(x) for x in unique_five]
        unique_all = all_stations.idImpianto.unique().tolist()
        unique_all = [str(x) for x in unique_all]

        comune = comune.loc[:, ["COMUNE"]]
        comune["centroid"] = json.dumps(centroid)
        comune["area_comune"] = json.dumps(area_comune)
        comune["buffer_1"] = json.dumps(buffer_one_geojson)
        comune["buffer_3"] = json.dumps(buffer_three_geojson)
        comune["buffer_5"] = json.dumps(buffer_max_geojson)
        comune["stationsId_one"] = ";".join(unique_one)
        comune["stationsId_three"] = ";".join(unique_three)
        comune["stationsId_five"] = ";".join(unique_five)
        comune["all_stations"] = ";".join(unique_all)
        return comune


if __name__ == "__main__":
    StaticStations().update_static_storage()
