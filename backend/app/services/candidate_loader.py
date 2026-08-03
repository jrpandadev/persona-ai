import json
from pathlib import Path


def load_candidate():
    try:
        data_dir = Path(__file__).parent.parent / "data"
        path = data_dir / "candidate.json"
        
        if not path.exists():
            path = data_dir / "candidate.example.json"

        with open(path, "r", encoding="utf-8") as file:
            return json.load(file)

    except FileNotFoundError:
        raise FileNotFoundError("Neither candidate.json nor candidate.example.json was found.")
    except json.JSONDecodeError:
        raise ValueError("Candidate data file contains invalid JSON.")