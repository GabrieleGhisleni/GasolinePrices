import pandas as pd
import geopandas as gpd
import os

class Stations:
    def __init__(self, path='./data/impianti.geojson', municipalities_path='./data/municipalities.geojson'):
        self.path = path
        self.municipalities_path = municipalities_path
        self.gov_url = "https://www.mise.gov.it/images/exportCSV/anagrafica_impianti_attivi.csv"

    def load_station(self) -> gpd.GeoDataFrame:
        try:
            return gpd.read_file(self.path)
        except Exception as e:
            print(f"""Something went wrong while loading the static impianti.geojson: {e},
                      Current working directory {os.getcwd()})""")
    
    def refresh_storage(self) -> None:
        df_impianti = pd.read_csv(self.gov_url, delimiter=';', skiprows=1)
        geometry = gpd.points_from_xy(df_impianti.Longitudine, df_impianti.Latitudine)
        geo_stations = gpd.GeoDataFrame(df_impianti, crs='EPSG:4326', geometry=geometry)
        geo_stations = geo_stations.loc[:, ['idImpianto', 'Gestore','Bandiera', 'Nome Impianto','Indirizzo', 'Comune', 'geometry']]
        geo_stations= geo_stations.loc[geo_stations.geometry.is_valid,:]
        geo_stations.rename(columns={'idImpianto': 'id'}, inplace=True)
        geo_stations.to_file(self.path, driver='GeoJSON')  

    def load_italian_municipalities(self) -> gpd.GeoDataFrame:
        return gpd.read_file(self.municipalities_path)



