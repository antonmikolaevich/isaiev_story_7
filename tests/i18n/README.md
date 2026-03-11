Usage

- Configure BASE_URL to point to the application under test (default: http://localhost:8000).
- Optionally set INCLUDE_OPTIONAL_LANGS=1 to include optional languages like 'ja'.
- Run the tests with pytest, e.g.

  BASE_URL=http://app-under-test:8000 pytest -q

Notes

- The tests are data-driven. Adjust `tests/i18n/data/translations.json` to add new languages or change selectors.
- The fetcher uses a simple GET with a query parameter (default ?lang=<code>) to switch languages. Adjust LANG_QUERY_PARAM if needed.
