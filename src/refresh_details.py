import geopandas as gpd
import pandas as pd
from shapely.geometry import mapping

if __name__ == "__main__":
    (
        pd.read_csv(
            "https://www.mise.gov.it/images/exportCSV/anagrafica_impianti_attivi.csv",
            delimiter=";",
            skiprows=1,
            on_bad_lines="skip",
        )
        .dropna(subset=["Latitudine", "Longitudine"])
        .reset_index(drop=True)
        .fillna("")
        .assign(
            geometry=lambda x: gpd.points_from_xy(x.Longitudine, x.Latitudine),
        )
        .drop(columns=["Latitudine", "Longitudine"])
        .assign(geometry=lambda x: x.geometry.apply(lambda y: mapping(y)))
        .set_index("idImpianto")
        .to_json("./data/details/impianti.json", orient="index")
    )
