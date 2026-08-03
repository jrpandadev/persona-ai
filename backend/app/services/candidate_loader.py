import json
import logging
from pathlib import Path
from functools import lru_cache

logger = logging.getLogger("persona-ai")


@lru_cache(maxsize=1)
def load_candidate() -> dict:
    """Load and cache candidate profile from JSON. Only reads disk once."""
    data_dir = Path(__file__).parent.parent / "data"
    path = data_dir / "candidate.json"

    if not path.exists():
        raise FileNotFoundError(f"candidate.json not found at {path}")

    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)

    logger.info(f"Loaded candidate profile: {data.get('personal', {}).get('name', 'Unknown')}")
    return data