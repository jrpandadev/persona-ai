"""
Candidate profile loader.

Reads the authoritative candidate.json once from disk and caches the
result for the lifetime of the process. All downstream services receive
the same immutable dict.
"""

import json
import logging
from functools import lru_cache
from pathlib import Path

logger = logging.getLogger("persona-ai")

_DATA_DIR = Path(__file__).resolve().parent.parent / "data"


@lru_cache(maxsize=1)
def load_candidate() -> dict:
    """Load and cache candidate profile from JSON. Only reads disk once."""
    path = _DATA_DIR / "candidate.json"

    if not path.exists():
        # Intentionally omit the full server path to avoid leaking directory structure
        raise FileNotFoundError("candidate.json is missing from the data directory")

    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)

    name = data.get("personal", {}).get("name", "Unknown")
    logger.info("Loaded candidate profile: %s", name)
    return data