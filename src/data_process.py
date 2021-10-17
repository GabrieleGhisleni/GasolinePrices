from shapely.geometry.multipolygon import MultiPolygon
from shapely.geometry import mapping
from pprint import pprint
from typing import Tuple
import geopandas as gpd
import datetime as dt
import pandas as pd
import numpy as np
import unicodedata
import json
import sys
import os


class DataProcess:
    def __init__(self, municipalities: gpd.GeoDataFrame, prices: pd.DataFrame, impianti: gpd.GeoDataFrame, json_folder = './data/prices_for_municipality'):
        self.json_folder = json_folder
        self.df = impianti.merge(prices, on='id')
        self.municipalities = municipalities

        self.df.loc[:, 'Comune'] = self.df.Comune.apply(lambda x: DataProcess.remove_punctuations(x))
        self.df.loc[:, 'gasoline_type'] = self.df.gasoline_type.apply(DataProcess.standard_gasoline)
        self.unique_gasoline = self.df.gasoline_type.unique()

        self.municipalities.loc[:, 'COMUNE'] = self.municipalities.COMUNE.apply(lambda x: DataProcess.remove_punctuations(x))
        self.municipalities.loc[:, 'geometry'] = municipalities.simplify(500)


    def extract_cheap_stations(self) -> list:
        res, total_error, actual, remaining, start = [], 0, 0, len(self.municipalities), dt.datetime.now()
        municipalities = self.df.Comune.unique()
        municipalities = self.municipalities.COMUNE.unique()
        for municipality in municipalities:
            if municipality == 'medolago:
                try:
                    self.gasoline_types(municipality)
                except Exception():
                    total_error += 0
                actual += 1
                if actual%1000 == 0: 
                    print(f'actual={actual}, remaining={remaining-actual}, execution time: {dt.datetime.now() - start}')
        print(f'Skipped {total_error}')
        


    def gasoline_types(self, name_comune: str) -> None:
        res = dict(comune=name_comune)
        # first_buffer_stations, buffer_1 = self.create_buffer_and_locations(name_comune, 1000)
        second_buffer_stations, buffer_2  = self.create_buffer_and_locations(name_comune, 3000)
        third_buffer_stations, buffer_3  = self.create_buffer_and_locations(name_comune, 5000)
        buffer_geometry, agg = [buffer_2, buffer_3], [second_buffer_stations, third_buffer_stations]
        res['buffer_3'] = mapping(buffer_2)
        res['buffer_5'] = mapping(buffer_3)
        res['centroid'] = res['buffer_3'].centroid

        for gasoline in self.unique_gasoline:
            i, j = [3,5], 0
            res[gasoline] = {}
            avoid_duplicated = set()
            for buff in agg:
                multipolygon = mapping(buffer_geometry[j].simplify(500))
                res[gasoline][i[j]] = dict(price=[]) 
                if not agg[j].empty:
                    sorted_prices = self.sort_prices(gasoline, 
                                                    res[gasoline][(i[j])]["price"], 
                                                    agg[j], 
                                                    avoid_duplicated)
                j+=1

        self.save(res)


    def sort_prices(self, gasoline: str, dict_buff: dict, stations_df: gpd.GeoDataFrame, avoid_duplicate: set) -> None:
        tmp = stations_df.loc[stations_df.gasoline_type == gasoline].sort_values('price')
        for irow in range(len(tmp)):
            if tmp.iloc[irow]['Nome Impianto'] not in avoid_duplicate:
                tmp_dict = tmp.iloc[irow].to_dict()
                tmp_dict['geometry'] = mapping(tmp_dict['geometry'])
                avoid_duplicate.add(tmp.iloc[irow]['Nome Impianto'])
                del tmp_dict["gasoline_type"]
                dict_buff.append(tmp_dict)


    def create_buffer_and_locations(self, comune:str , buffer: int) -> Tuple[pd.DataFrame, MultiPolygon]: 
        mun = self.municipalities.loc[self.municipalities.COMUNE==comune, :]
        buffered = mun.buffer(buffer)
        if len(buffered) > 1: 
            buffered = MultiPolygon(buffered.to_crs(epsg=4326).values)
            buffered_4326 = buffered
        else:
            buffered_4326 = buffered.to_crs(epsg=4326).values[0]
        stations_within = self.df.loc[self.df.geometry.values.within(buffered_4326),:]
        if not stations_within.empty: return stations_within, buffered_4326
        else: return pd.DataFrame(), buffered_4326


    def save(self, comune_dict: dict) -> None:
        try:
            path = f"{self.json_folder}/{comune_dict['comune']}.json"
            with open(path, 'w') as file: json.dump(comune_dict, file)
        except Exception as e:
            print(f"""Error while saving: {e}.
                      Current path {os.getcwd()}, 
                      Default path {self.json_folder}""")


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