import os
import datetime as dt

from loguru import logger

from src import utils


class TestPricesStations:
    output_file_dir = "./data/prices_for_municipality"
    bases = {'Benzina', 'Gasolio', 'GPL', 'Metano'}

    def _get_items(self, n: int) -> list:
        files = os.listdir(self.output_file_dir)
        assert len(files) > 7500
        return [utils.load_json(f"{self.output_file_dir}/{city}") for city in files[:n]]

    def _get_item(self, name: str) -> dict:
        city = utils.load_json(f"{self.output_file_dir}/{name}")
        assert len(city) >= 1
        return city

    def test_carb_is_final_files(self):
        items = self._get_items(n=150)
        for item in items:
            for base in self.bases:
                assert base in item

    def test_carb_has_3_levels(self):
        items = self._get_items(n=150)
        for item in items:
            for carb in self.bases:
                assert item[carb].get('1') is not None
                assert item[carb].get('3') is not None
                assert item[carb].get('5') is not None

    def test_prices_are_updated(self):
        items = self._get_items(n=500)
        fresh, older = 0, 0

        for item in items:
            for carb in self.bases:
                for level in ['1', '3', '5']:
                    for station in item[carb][level]:
                        time = dt.datetime.strptime(station['ultima_rilevazione'].split(" ")[0], '%d/%m/%Y')
                        difference_in_days = (dt.datetime.now() - time).days
                        if difference_in_days > 5:
                            older += 1
                        else:
                            fresh += 1

        logger.success((fresh / (fresh+older)))

        assert (fresh / (fresh+older)) > .5

    def test_stations_medolago(self):
        item = self._get_item(name='medolago.json')
        all_stationsIds_in_medolago = {
           '46031', '16552', '50176', '54900',
           '4644', '36320', '11306', '54373', '11253',
           '48550', '54369', '25303', '51452', '33398',
           '50286', '26246', '25733', '43387', '36373',
           '39057', '38229', '15311', '11431', '15828', '55055'
        }

        for carb in self.bases:
            for level in ['1', '3', '5']:
                for station in item[carb][level]:
                    assert str(station['idImpianto']) in all_stationsIds_in_medolago
