from dataclasses import dataclass
from loguru import logger
import geopandas as gpd
import datetime as dt
import pandas as pd
import utils
import json


@dataclass
class StaticStations:
    impianti_url: str = "https://www.mise.gov.it/images/exportCSV/anagrafica_impianti_attivi.csv"
    municipality: str = "./data/municipalities.geojson"
    buffers = [1000, 3000, 5000]

    def __init__(self):
        stations_tmp_df = (
            pd.read_csv(self.impianti_url, delimiter=";", skiprows=1, on_bad_lines="skip")
            .dropna(subset=["Latitudine", "Longitudine"])
            .reset_index(drop=True)
        )
        logger.info(f"fetched stations_tmp_df at {self.impianti_url}, n of row: {len(stations_tmp_df)}")

        self.geo_stations = (
            gpd.GeoDataFrame(
                stations_tmp_df,
                crs="EPSG:4326",
                geometry=gpd.points_from_xy(stations_tmp_df.Longitudine, stations_tmp_df.Latitudine)
            )
        )

        self.geo_stations = self.geo_stations.loc[self.geo_stations.geometry.is_valid]
        logger.info(f"Loaded into geo pandas format, number of row: {len(self.geo_stations)}")

        self.municipalities = gpd.read_file(self.municipality)
        logger.info(f"Loaded municipality at: {self.municipality}")

    def update_static_storage(self):
        start = dt.datetime.now()
        storage, total_error = [], 0

        for idx in range(len(self.municipalities)):
            try:
                storage.append(self.process_municipality(self.municipalities.iloc[idx: idx + 1]))
            except Exception as e:
                logger.error(f"{idx}: {e}")
                total_error += 1

            if idx and not idx % 500:
                logger.info(
                    f"actual={idx}, remaining={len(self.municipalities)-idx}, "
                    f"execution time: {dt.datetime.now() - start}"
                )

        logger.success(
            f"Finished processing, total error={total_error} "
            f"execution time: {dt.datetime.now() - start}"
        )

        pd.DataFrame(storage).to_csv("data/municipalities.csv.zip", compression="zip", index=False)

    def process_municipality(self, municipality) -> dict:
        first_buffer = utils.serialize_buffer(municipality.simplify(500).buffer(self.buffers[0]))
        second_buffer = utils.serialize_buffer(municipality.simplify(500).buffer(self.buffers[1]))
        third_max_buffer = utils.serialize_buffer(municipality.simplify(500).buffer(self.buffers[2]))

        all_stats_nearby = self.geo_stations[
            self.geo_stations.geometry.values.within(third_max_buffer)
        ]

        # estrae stazioni nel primo bufer e in seguito esclude tali stazioni da `all_stats_nearby`
        stations_in_one_buffer = all_stats_nearby[all_stats_nearby.geometry.values.within(first_buffer)]
        all_stats_nearby = all_stats_nearby.loc[~all_stats_nearby.index.isin(stations_in_one_buffer.index)]

        stations_in_three_buffer = all_stats_nearby[all_stats_nearby.geometry.values.within(second_buffer)]
        stations_in_max_buffer = all_stats_nearby.loc[~all_stats_nearby.index.isin(stations_in_three_buffer.index)]

        return {
            "centroid": json.dumps(utils.create_geojson(third_max_buffer.centroid)),
            "area_comune": json.dumps(
                utils.create_geojson(utils.serialize_buffer(municipality.buffer(0).simplify(10)))),
            "buffer_1": json.dumps(utils.create_geojson(first_buffer)),
            "buffer_3": json.dumps(utils.create_geojson(second_buffer)),
            "buffer_5": json.dumps(utils.create_geojson(third_max_buffer)),
            "stationsId_one": ";".join(stations_in_one_buffer.idImpianto.unique().astype('str').tolist()),
            "stationsId_three": ";".join(stations_in_three_buffer.idImpianto.unique().astype('str').tolist()),
            "stationsId_five": ";".join(stations_in_max_buffer.idImpianto.unique().astype('str').tolist()),
            "all_stations": ";".join(all_stats_nearby.idImpianto.unique().astype('str').tolist()),
            **municipality.to_dict(orient='records')[0]
        }


if __name__ == "__main__":
    StaticStations().update_static_storage()
