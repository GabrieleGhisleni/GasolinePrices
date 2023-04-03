import datetime as dt
from dataclasses import dataclass

import pandas as pd
from loguru import logger

import utils


@dataclass
class FetchSave:
    prices_url: str = "https://www.mise.gov.it/images/exportCSV/prezzo_alle_8.csv"
    json_dir: str = "./data/prices_for_municipality"
    stations_json: str = "./data/details/impianti.json"
    municipalities: str = "./data/static_stations/municipalities.csv.zip"

    def __init__(self):
        self.prices = (
            pd.read_csv(self.prices_url, delimiter=";", skiprows=1)
            .astype({"idImpianto": "string"})
            .assign(
                descCarburante=lambda x: x.descCarburante.apply(self.standard_gasoline),
            )
            .merge(
                (
                    pd.DataFrame(utils.load_json(self.stations_json)).T.reset_index(
                        names="idImpianto"
                    )
                ),
                on="idImpianto",
                how="right",
            )
        )

        logger.info(f"Loaded prices from {self.prices_url}")
        self.municipalities_df = pd.read_csv(self.municipalities).assign(
            COMUNE=lambda x: x.COMUNE.apply(utils.remove_punctuations)
        )
        logger.info(f"Loaded municipalities from {self.municipalities}")

        self.unique_gasoline = self.prices.descCarburante.unique()

    def update_daily_storage(self):
        total_error = 0
        start = dt.datetime.now()

        for idx, (_, row) in enumerate(self.municipalities_df.iterrows()):
            try:
                self.process_and_save(row)
            except Exception as e:
                total_error += 1
                logger.error(e)

            if idx and not idx % 500:
                logger.info(
                    f"actual={idx}, remaining={len(self.municipalities_df)-idx}, "
                    f"execution time: {dt.datetime.now() - start}"
                )

        logger.success(
            f"completed, municipality skipped: {total_error}, total time: {dt.datetime.now()-start}"
        )

    def process_and_save(self, comune: pd.Series):
        all_sets = utils.from_encoded_str_array_to_set(comune.all_stations)
        buffer_1 = utils.from_encoded_str_array_to_set(comune.stationsId_one)
        buffer_3 = utils.from_encoded_str_array_to_set(comune.stationsId_three)
        buffer_5 = utils.from_encoded_str_array_to_set(comune.stationsId_five)

        city_stations = self.prices.loc[self.prices.idImpianto.isin(all_sets)]
        buffer_one_stats = city_stations.loc[city_stations.idImpianto.isin(buffer_1)]
        buffer_three_stats = city_stations.loc[city_stations.idImpianto.isin(buffer_3)]
        buffer_five_stats = city_stations.loc[city_stations.idImpianto.isin(buffer_5)]

        res = comune.rename({"COMUNE": "comune"})[
            ["area_comune", "comune", "buffer_1", "buffer_3", "buffer_5", "centroid"]
        ].to_dict()

        for carburante in self.unique_gasoline:
            res[carburante] = {
                buffer: self.extract_info_to_dict(stats_in_buffer, carburante)
                for buffer, stats_in_buffer in [
                    (1, buffer_one_stats),
                    (3, buffer_three_stats),
                    (5, buffer_five_stats),
                ]
            }

        utils.write_json(f"{self.json_dir}/{res.get('comune')}.json", res)

    @staticmethod
    def extract_info_to_dict(stations, carburante):
        is_self = 0 if carburante in ["Metano", "GPL"] else 1
        return (
            stations.loc[
                (stations.descCarburante == carburante) & (stations.isSelf == is_self)
            ]
            .rename(columns={"prezzo": "price", "dtComu": "ultima_rilevazione"})[
                [
                    "idImpianto",
                    "price",
                    "ultima_rilevazione",
                    "Gestore",
                    "Indirizzo",
                    "Comune",
                    "Bandiera",
                    "geometry",
                ]
            ]
            .to_dict(orient="records")
        )

    @staticmethod
    def standard_gasoline(carb: str) -> str:
        if carb == "Gasolio":
            return "Gasolio"
        elif carb == "Benzina":
            return "Benzina"
        elif carb == "Metano":
            return "Metano"
        elif carb == "GPL":
            return "GPL"

        elif carb in {
            "Benzina Plus",
            "Benzina WR 100",
            "Benzina speciale 320",
            "Benzina speciale",
        }:
            return "Benzina High quality"

        if carb in {
            "DieselMax",
            "Excellium Diesel",
            "Hi-Q Diesel",
            "HiQ Perform+",
            "Supreme Diesel",
            "Blue Diesel",
            "Blue Super",
            "Gasolio Alpino",
            "Gasolio Oro Diesel",
            "Gasolio Premium",
            "Gasolio speciale",
        }:
            return "Diesel High Quality"


if __name__ == "__main__":
    FetchSave().update_daily_storage()
