import pandas as pd
import geopandas as gpd
import json, os
import sys
import numpy as np
from shapely.geometry import mapping

def normalized_carbs(carb) -> str:
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


def extract_top_for_municipalities(com) -> dict:
    def top_n(df, storage, n, n_to):
        storage[str(n)] = []
        selected_gasoline = df.loc[df.gasoline_type == gasoline].sort_values('price')[n:n_to]
        for irow in range(len(selected_gasoline)):
            tmp_dict = selected_gasoline.iloc[irow].to_dict()
            tmp_geometry = mapping(tmp_dict['geometry'])
            tmp_dict['geometry'] = tmp_geometry
            storage[str(n)].append(tmp_dict)
    ###############################
    res = {'comune': np.unique(com.Comune)[0]}
    for gasoline in com.gasoline_type.unique():
        res[gasoline] = {}
        top_n(com, res[gasoline], 0, 3)
        top_n(com, res[gasoline], 3, 6)
        top_n(com, res[gasoline], 6, 11)

    return res


def process(df: gpd.GeoDataFrame) -> list:
    df.loc[:, 'gasoline_type'] = df.gasoline_type.apply(normalized_carbs)
    groups = df.groupby('Comune')
    res = []
    for group in groups.groups.keys():
        res.append(extract_top_for_municipalities(groups.get_group(group)))
    return res


def save(L:list, default_path = './data/prices_for_municipality') -> None:
    try:
        i = 0
        for comune in L:
            path = f"{default_path}/{comune['comune'].lower().replace(' ','-')}.json"
            path = path.replaceAll("[^a-zA-Z0-9]", "")
            with open(path, 'w') as file:
                json.dump(comune, file)
    except Exception as e:
        print(f"""Something went wrong with the path {e}.
                  Current path {os.getcwd()}
                  Default path {default_path}""")


    