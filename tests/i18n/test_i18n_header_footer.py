"""Data-driven i18n tests for Header and Footer.

Tests are driven entirely by the data file `tests/i18n/data/translations.json`.
Required languages: en (English), es (Español).
Optional languages (enabled via env var INCLUDE_OPTIONAL_LANGS=1): ja (日本語)
"""

import os
import json
import pytest
from pathlib import Path

DATA_PATH = Path(__file__).parent / "data" / "translations.json"

with open(DATA_PATH, encoding="utf-8") as f:
    data = json.load(f)

selectors = data["selectors"]
translations = data["translations"]

required_langs = ["en", "es"]
optional_langs = ["ja"]


def _languages_to_test():
    langs = list(required_langs)
    if os.getenv("INCLUDE_OPTIONAL_LANGS") == "1":
        langs += optional_langs
    return langs


@pytest.mark.parametrize("lang", _languages_to_test())
def test_header_footer_translations(fetcher, lang):
    """Fetch the page with the requested language and compare each configured key.

    - The test does not hardcode selectors or expected texts; both come from the data file.
    - Keep assertions minimal so console output is concise.
    """
    expected = translations.get(lang)
    assert expected is not None, f"No translations provided for language '{lang}' in data file"

    actual = fetcher(lang, selectors)

    for key, exp_text in expected.items():
        assert key in selectors, f"Selector for key '{key}' missing in data file"
        act_text = actual.get(key, "")
        assert act_text == exp_text, f"Mismatch for '{key}' in lang '{lang}': expected '{exp_text}', got '{act_text}'"
