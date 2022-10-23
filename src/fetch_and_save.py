import src.utils as utils

from dataclasses import dataclass
from tqdm.auto import tqdm
from loguru import logger
import datetime as dt
import pandas as pd
import copy

@dataclass
class FetchSave:
    prices_url: str = "https://www.mise.gov.it/images/exportCSV/prezzo_alle_8.csv"
    json_dir: str = "./data/prices_for_municipality"
    stations_json: str = "./data/detail.json"
    municipalities: str = "./data/municipalities.csv.zip"

    def __init__(self):
        self.prices = (
            pd.read_csv(self.prices_url, delimiter=";", skiprows=1)
            .assign(descCarburante=lambda x: x.descCarburante.apply(utils.remove_punctuations))
        )

        logger.info(f"Loaded prices from {self.prices_url}")
        self.municipalities_df = (
            pd.read_csv(self.municipalities)
            .assign(COMUNE=lambda x: x.COMUNE.apply(self.standard_gasoline))

        )
        logger.info(f"Loaded municipalities from {self.municipalities}")

        self.unique_gasoline = self.prices.descCarburante.unique()
        self.stations_details = utils.load_json(self.stations_json)
        logger.info(f"Loaded stations details from {self.stations_json}")

    def update_daily_storage(self):
        current, total_error = 0, 0
        starting_time = dt.datetime.now()

        for _, row in tqdm(
                self.municipalities_df.iterrows(), total=len(self.municipalities_df)
        ):
            try:
                self.process_and_save(row)
            except Exception as e:
                total_error += 1
                logger.error(e)

        logger.success(
            f"completed, municipality skipped: {total_error}, total time: {starting_time-dt.datetime.now()}"
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

        res = (
            comune
            .rename({"COMUNE": "comune"})
            [['area_comune', 'comune', 'buffer_1', 'buffer_3', 'buffer_5', 'centroid']]
            .to_dict()
        )

        for carburante in self.unique_gasoline:
            res[carburante] = {}
            for stats_in_buffer, key in zip(
                    [buffer_one_stats, buffer_three_stats, buffer_five_stats], [1, 3, 5]
            ):
                res[carburante][key] = self.from_pd_to_dict(stats_in_buffer, carburante)

        utils.write_json(f"{self.json_dir}/{res['comune']}.json", res)

    def from_pd_to_dict(self, stations, carburante):
        # todo make this more readable
        if carburante == "Metano" or carburante == "GPL":
            extracted_only_carb = stations.loc[
                (stations.descCarburante == carburante) & (stations.isSelf == 0)
            ]
        else:
            extracted_only_carb = stations.loc[
                (stations.descCarburante == carburante) & (stations.isSelf == 1)
            ]

        list_of_processed_station = []
        if not extracted_only_carb.empty:
            for idx in range(len(extracted_only_carb)):
                if str(extracted_only_carb.iloc[idx].idImpianto) in self.stations_details:
                    stations_detail = copy.deepcopy(
                        self.stations_details[str(extracted_only_carb.iloc[idx].idImpianto)]
                    )
                    stations_detail["price"] = extracted_only_carb.iloc[idx].prezzo
                    stations_detail["ultima_rilevazione"] = extracted_only_carb.iloc[idx].dtComu
                    list_of_processed_station.append(stations_detail)
        return list_of_processed_station

    @staticmethod
    def standard_gasoline(carb: str) -> str:
        if carb == "Benzina":
            return "Benzina"
        if carb == "Benzina Plus":
            return "Benzina"
        if carb == "Benzina WR 100":
            return "Benzina"
        if carb == "Benzina speciale 320":
            return "Benzina"
        if carb == "Blue Diesel":
            return "Blue Diesel"
        if carb == "Blue Super":
            return "Blue Diesel"
        if carb == "DieselMax":
            return "Diesel High Quality"
        if carb == "Excellium Diesel":
            return "Diesel High Quality"
        if carb == "Supreme Diesel":
            return "Diesel High Quality"
        if carb == "Hi-Q Diesel":
            return "Diesel High Quality"
        if carb == "HiQ Perform+":
            return "Diesel High Quality"
        if carb == "Supreme Diesel":
            return "Diesel High Quality"
        if carb == "Gasolio":
            return "Gasolio"
        if carb == "Gasolio Alpino":
            return "Gasolio High Quality"
        if carb == "Gasolio Oro Diesel":
            return "Gasolio High Quality"
        if carb == "Gasolio Premium":
            return "Gasolio High Quality"
        if carb == "Gasolio speciale":
            return "Gasolio High Quality"
        if carb == "Metano":
            return "Metano"
        if carb == "GPL":
            return "GPL"
        return None




if __name__ == "__main__":
    FetchSave().update_daily_storage()
