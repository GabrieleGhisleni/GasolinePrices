import pandas as pd
import geopandas as gpd
import sys, os


def retrive_prices() -> pd.DataFrame:
    try:
        url = "https://www.mise.gov.it/images/exportCSV/prezzo_alle_8.csv"
        df = pd.read_csv(url, delimiter=';', skiprows=1)
        df = df.loc[:, ['idImpianto', 'descCarburante', 'prezzo', 'dtComu']]
        df.columns = ['id', 'gasoline_type','price']
        return df
    except Exception as e:
        print(f'Something went wrong while fetching {url}, {e}')
        sys.exit()

