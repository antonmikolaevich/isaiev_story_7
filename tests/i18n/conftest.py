"""Pytest fixtures and helpers for i18n tests.

Fixtures provided:
- base_url: base URL of the application under test (env: BASE_URL, default: http://localhost:8000)
- lang_param: query parameter name used to switch language (env: LANG_QUERY_PARAM, default: "lang")
- session: requests.Session instance
- fetcher: helper callable to fetch page and extract texts by selectors

The fetcher is intentionally simple (uses HTTP GET with a query parameter) to keep the tests framework- and deployment-agnostic.
"""

import os
import requests
from bs4 import BeautifulSoup
import pytest


@pytest.fixture(scope="session")
def base_url():
    """Return the base URL of the application under test.

    Configure via BASE_URL environment variable. Default: http://localhost:8000
    """
    return os.getenv("BASE_URL", "http://localhost:8000")


@pytest.fixture(scope="session")
def lang_param():
    """Return the query parameter name used to switch language (e.g. ?lang=es).

    Configure via LANG_QUERY_PARAM environment variable. Default: 'lang'
    """
    return os.getenv("LANG_QUERY_PARAM", "lang")


@pytest.fixture
def session():
    """Provide a requests.Session for the test.

    Tests should avoid printing extra information; network errors will raise normally.
    """
    return requests.Session()


def fetch_texts(session, base_url, lang_param, lang, selectors):
    """Fetch the page for a given language and extract texts using provided selectors.

    - session: requests.Session
    - base_url: e.g. http://localhost:8000
    - lang_param: query parameter name to set language
    - lang: language code (e.g. 'en', 'es')
    - selectors: dict mapping keys to CSS selectors

    Returns: dict mapping keys to extracted text (empty string if selector not found)
    """
    params = {lang_param: lang}
    resp = session.get(base_url, params=params, timeout=10)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "html.parser")
    result = {}
    for key, sel in selectors.items():
        el = soup.select_one(sel)
        result[key] = el.get_text(strip=True) if el else ""
    return result


@pytest.fixture
def fetcher(session, base_url, lang_param):
    """Return a callable fetcher(lang, selectors) -> dict of texts.

    Example usage in tests:
        actual = fetcher('es', selectors)
    """

    def _fetch(lang, selectors):
        return fetch_texts(session, base_url, lang_param, lang, selectors)

    return _fetch
