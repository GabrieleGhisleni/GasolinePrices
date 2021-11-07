from shapely.geometry import mapping
import geopandas as gpd
import datetime as dt
import pandas as pd
import json
import sys
import os


class StaticStations:
    def __init__(self, url_impianti="https://www.mise.gov.it/images/exportCSV/anagrafica_impianti_attivi.csv", url_municipality='./data/municipalities.geojson'):
        try: df_impianti = pd.read_csv(url_impianti, delimiter=';', skiprows=1)
        except Exception as e: 
            print(f"{e} while fetching data from {url_impianti}")
            sys.exit()
        self.geo_stations = gpd.GeoDataFrame(df_impianti, crs='EPSG:4326', geometry=gpd.points_from_xy(df_impianti.Longitudine, df_impianti.Latitudine))
        self.geo_stations = self.geo_stations.loc[self.geo_stations.geometry.is_valid,:]
        self.municipalities = gpd.read_file(url_municipality)


    def update_static_storage(self):
        storage = []
        total_error, actual, remaining, start = 0, 0, len(self.municipalities), dt.datetime.now()
        print('Loaded static and starting the process!')
        for idx, row in self.municipalities.iterrows():
            if row.COMUNE == 'Medolago':
                try:
                    storage.append(self.process_municipality(self.municipalities.iloc[idx:idx+1]))
                except Exception as e:
                    print(e)
                    total_error += 1
            actual += 1
            if actual % 1000 == 0: print(f'actual={actual}, remaining={remaining-actual}, execution time: {dt.datetime.now() - start}')
        print(f'Finished processing, total error={total_error} execution time: {dt.datetime.now() - start}')
        res = pd.concat(storage)
        res.to_csv('./data/municipalities.csv.zip', compression="zip", index=False)
        print(f'Finished saving, execution time: {dt.datetime.now() - start}')


    def process_municipality(self, comune): 
        def serialize_buffer(buff):
            if len(buff) > 1: return MultiPolygon(buff.to_crs(epsg=4326).values)
            else: return buff.to_crs(epsg=4326).values[0]

        area_comune = comune.buffer(0).simplify(10)
        area_comune = serialize_buffer(area_comune)
        area_comune = [{"type": "Feature", "properties": {}, "geometry": (mapping(area_comune))}]

        comune_max_buffer = serialize_buffer( comune.simplify(500).buffer(5000) )
        comune_three_buffer = serialize_buffer( comune.simplify(500).buffer(3000) )
        comune_one_buffer = serialize_buffer( comune.simplify(500).buffer(1000) )

        buffer_one_geojson = [{"type": "Feature", "properties": {}, "geometry": mapping(comune_one_buffer)}]
        buffer_three_geojson = [{"type": "Feature", "properties": {}, "geometry": mapping(comune_three_buffer)}]
        buffer_max_geojson = [{"type": "Feature", "properties": {}, "geometry": mapping(comune_max_buffer)}]
        centroid = [{"type": "Feature", "properties": {}, "geometry": mapping(comune_max_buffer.centroid)}]

        stations_in_max_buffer = self.geo_stations[self.geo_stations.geometry.values.within(comune_max_buffer)]
        all_stations = stations_in_max_buffer.copy()      

        stations_in_one_buffer = stations_in_max_buffer[stations_in_max_buffer.geometry.values.within(comune_one_buffer)]
        stations_in_three_buffer = stations_in_max_buffer[(stations_in_max_buffer.geometry.values.within(comune_three_buffer) & (~(stations_in_max_buffer.idImpianto.isin(stations_in_one_buffer.idImpianto))))]        
        stations_in_max_buffer = stations_in_max_buffer[((~ (stations_in_max_buffer.idImpianto.isin(stations_in_three_buffer.idImpianto))) & (~(stations_in_max_buffer.idImpianto.isin(stations_in_one_buffer.idImpianto))))]
        
        unique_one = stations_in_one_buffer.idImpianto.unique().tolist()
        unique_one = [str(x) for x in unique_one]
        unique_three = stations_in_three_buffer.idImpianto.unique().tolist()
        unique_three = [str(x) for x in unique_three]
        unique_five = stations_in_max_buffer.idImpianto.unique().tolist()
        unique_five = [str(x) for x in unique_five]
        unique_all = all_stations.idImpianto.unique().tolist()
        unique_all = [str(x) for x in unique_all]

        comune = comune.loc[:, ['COMUNE']]
        comune['centroid'] =  json.dumps(centroid)
        comune['area_comune'] = json.dumps(area_comune)
        comune['buffer_1'] = json.dumps(buffer_one_geojson)
        comune['buffer_3'] = json.dumps(buffer_three_geojson)
        comune['buffer_5'] = json.dumps(buffer_max_geojson)
        comune['stationsId_one'] = ';'.join(unique_one)
        comune['stationsId_three'] = ';'.join(unique_three)
        comune['stationsId_five'] = ';'.join(unique_five)
        comune['all_stations'] = ';'.join(unique_all)
        return comune

if __name__ == "__main__":
    StaticStations().update_static_storage()