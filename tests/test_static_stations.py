from typing import Iterator

import pandas as pd
import geopandas as gpd

from src import utils


class TestStaticStations:
    output_file_path = "./data/municipalities.csv.zip"

    def _get_items(self, n: int) -> Iterator[pd.Series]:
        static_stations = pd.read_csv(self.output_file_path)
        assert len(static_stations) > 7500
        for iel in range(n):
            yield static_stations.iloc[n]

    def _get_item(self, name: str) -> pd.DataFrame:
        static_stations = (
            pd.read_csv(self.output_file_path)
            .assign(COMUNE=lambda x: x.COMUNE.apply(utils.remove_punctuations))
        )
        assert len(static_stations) >= 1
        return static_stations.loc[static_stations.COMUNE == name]

    def test_stations_id_not_duplicated(self):
        items = self._get_items(n=50)
        for row in items:
            assert set(row.stationsId_one.split(";")) & set(row.stationsId_three.split(";")) == set()
            assert set(row.stationsId_three.split(";")) & set(row.stationsId_five.split(";")) == set()

    def test_source_is_still_working(self):
        impianti_url: str = "https://www.mise.gov.it/images/exportCSV/anagrafica_impianti_attivi.csv"
        stations_tmp_df = (
            pd.read_csv(impianti_url, delimiter=";", skiprows=1, on_bad_lines="skip")
            .dropna(subset=["Latitudine", "Longitudine"])
            .reset_index(drop=True)
        )

        geometry = gpd.points_from_xy(stations_tmp_df.Longitudine, stations_tmp_df.Latitudine)

        assert len(stations_tmp_df) > 20000
        assert sum(geometry.is_valid) > 20000

    def test_stations_medolago(self):
        item = self._get_item(name='medolago').to_dict(orient='records')[0]
        assert item["stationsId_one"] == '36320;25733'
        assert item["stationsId_three"] == '50176;38229;54369;55055;25303;11431;39057;26246;36373;15828'
        assert item["stationsId_five"] == '46031;54900;4644;33398;48550;54373;11306;15311;43387;50286;16552;11253;51452'
