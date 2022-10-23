import json
import unicodedata


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
            set([int(x) for x in arr.split(";")])
            if (type(arr) != float)
            else [None]
        )