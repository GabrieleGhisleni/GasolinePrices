import json
import unicodedata

from shapely.geometry import mapping, MultiPolygon


def load_json(path) -> dict:
    with open(path, "r") as f:
        return json.load(f)


def write_json(path, d) -> None:
    with open(path, "w") as f:
        return json.dump(d, f)


def remove_punctuations(text: str) -> str:
    return (
        unicodedata.normalize("NFD", text)
        .encode("ascii", "ignore")
        .decode("utf-8")
        .replace("'", "")
        .replace(" ", "-")
        .lower()
    )


def from_encoded_str_array_to_set(arr) -> set | list:
    return (
            set([int(x) for x in arr.split(";") if x != " "])
            if (type(arr) != float)
            else [None]
        )


def serialize_buffer(buff):
    if len(buff) > 1:
        return MultiPolygon(buff.to_crs(epsg=4326).values)
    return buff.to_crs(epsg=4326).values[0]


def create_geojson(comune) -> list[dict]:
    return [dict(type="Feature", properties={}, geometry=mapping(comune))]
