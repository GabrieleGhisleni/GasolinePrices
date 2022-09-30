from shapely.geometry import mapping
import geopandas as gpd
import datetime as dt
import pandas as pd
import unicodedata
import numpy as np
import copy
import json
import os


class FetchSave:
    def __init__(self, 
                    url_prezzi= "https://www.mise.gov.it/images/exportCSV/prezzo_alle_8.csv",
                    json_folder = './data/prices_for_municipality', 
                    url_comuni = './data/municipalities.csv.zip',
                    url_impianti= "./data/detail.json"
                ):

        self.json_folder = json_folder
        self.price = pd.read_csv(url_prezzi, delimiter=';', skiprows=1)
        self.price.loc[:, 'descCarburante'] = self.price.descCarburante.apply(FetchSave.standard_gasoline)
        self.unique_gasoline = self.price.descCarburante.unique()

        self.processed_municipality = pd.read_csv(url_comuni)
        self.processed_municipality.COMUNE = self.processed_municipality.COMUNE.apply(FetchSave.remove_punctuations)

        with open(url_impianti, 'r') as file: self.detail_dict = json.load(file)


    def update_daily_storage(self):
        res, total_error, actual, remaining, start = [], 0, 0, len(self.processed_municipality), dt.datetime.now()
        print(f'End loading, start processing n={remaining}')
        for idx, row in self.processed_municipality.iterrows():
            try: self.process_and_save(row)
            except Exception as e: 
                print('Error', e)
                total_error += 1
            actual += 1
            if actual % 1000 == 0: print(f'actual={actual}, remaining={remaining-actual}, execution time: {dt.datetime.now() - start}')
        print(f'Skipped {total_error}')


    def process_and_save(self, comune):
        all_sets = set([int(x) for x in comune['all_stations'].split(';')]) if (type(comune['all_stations']) != float) else [None]
        buffer_1_set = set([int(x) for x in comune['stationsId_one'].split(';')]) if (type(comune['stationsId_one']) != float) else [None]
        buffer_3_set = set([int(x) for x in comune['stationsId_three'].split(';')]) if (type(comune['stationsId_three']) != float) else [None]
        buffer_5_set = set([int(x) for x in comune['stationsId_five'].split(';')]) if (type(comune['stationsId_five']) != float) else [None]

        all_records_filtered = self.price.loc[self.price.idImpianto.isin(all_sets)]

        buffer_one_recors = all_records_filtered.loc[all_records_filtered.idImpianto.isin(buffer_1_set)]
        buffer_three_recors = all_records_filtered.loc[all_records_filtered.idImpianto.isin(buffer_3_set)]
        buffer_five_recors = all_records_filtered.loc[all_records_filtered.idImpianto.isin(buffer_5_set)]
        res = dict( area_comune = comune['area_comune'],
                    comune = comune['COMUNE'],
                    buffer_1 = comune['buffer_1'],
                    buffer_3 = comune['buffer_3'],
                    buffer_5 = comune['buffer_5'],
                    centroid = comune['centroid']
                    )

        buffers = [buffer_one_recors, buffer_three_recors,buffer_five_recors]
        keys = [1,3,5]
        for carburante in self.unique_gasoline:
            res[carburante] = dict()
            if carburante:
                for idx in range(len(buffers)):
                    res[carburante][keys[idx]] = self.from_pd_to_dict(buffers[idx], carburante)
        self.saving(res)



    def from_pd_to_dict(self, stations, carburante):
        if carburante == 'Metano' or carburante == 'GPL': extracted_only_carb = stations.loc[(stations.descCarburante == carburante) & (stations.isSelf == 0)]
        else: extracted_only_carb = stations.loc[(stations.descCarburante == carburante) & (stations.isSelf == 1)]
        list_of_processed_station = []
        if not extracted_only_carb.empty:
            for idx in range(len(extracted_only_carb)):
                if str(extracted_only_carb.iloc[idx].idImpianto) in self.detail_dict:
                    stations_detail = copy.deepcopy(self.detail_dict[str(extracted_only_carb.iloc[idx].idImpianto)])
                    stations_detail['price'] = extracted_only_carb.iloc[idx].prezzo
                    stations_detail['ultima_rilevazione'] = extracted_only_carb.iloc[idx].dtComu
                    list_of_processed_station.append(stations_detail)
        return list_of_processed_station



    def saving(self, comune_dict):
        path = f"{self.json_folder}/{comune_dict['comune']}.json"
        with open(path, 'w') as file: json.dump(comune_dict, file)


    @staticmethod
    def standard_gasoline(carb: str) -> str:
        if carb == 'Benzina': return 'Benzina'
        if carb == 'Benzina Plus': return 'Benzina'
        if carb == 'Benzina WR 100': return 'Benzina'
        if carb == 'Benzina speciale 320': return 'Benzina'
        if carb == 'Blue Diesel': return 'Blue Diesel'
        if carb == 'Blue Super': return 'Blue Diesel'
        if carb == 'DieselMax': return 'Diesel High Quality'
        if carb == 'Excellium Diesel': return 'Diesel High Quality'
        if carb == 'Supreme Diesel': return 'Diesel High Quality'
        if carb == 'Hi-Q Diesel': return 'Diesel High Quality'
        if carb == 'HiQ Perform+': return 'Diesel High Quality'
        if carb == 'Supreme Diesel': return 'Diesel High Quality'
        if carb == 'Gasolio': return "Gasolio" 
        if carb == 'Gasolio Alpino': return 'Gasolio High Quality'
        if carb == 'Gasolio Oro Diesel': return 'Gasolio High Quality'
        if carb == 'Gasolio Premium': return 'Gasolio High Quality'
        if carb == 'Gasolio speciale': return 'Gasolio High Quality'
        if carb == 'Metano' : return 'Metano'
        if carb == 'GPL': return 'GPL'
        return None
            

    @staticmethod
    def remove_punctuations(text: str) -> str:
        text = unicodedata.normalize('NFD', text).encode('ascii', 'ignore').decode("utf-8")
        text = text.replace("'",'')
        text = text.replace(' ','-')
        text = text.lower()
        return str(text)


if __name__ == '__main__':
    FetchSave().update_daily_storage()
