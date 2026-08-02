import json
from pathlib import Path


def load_candidate():

    try:

        path = Path(__file__).parent.parent / "data" / "candidate.json"

        with open(path, "r", encoding="utf-8") as file:
            return json.load(file)

    except FileNotFoundError:
        raise FileNotFoundError("candidate.json not found.")

    except json.JSONDecodeError:
        raise ValueError("candidate.json contains invalid JSON.")