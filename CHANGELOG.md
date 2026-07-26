# Changelog

All notable changes per release. Versions follow [semver](https://semver.org)
pre-1.0 conventions: minor bumps may include breaking changes (called out
explicitly), patch bumps are docs / build / fixes only.

## v0.1.1 — 2026-07-26

- Made `LICENSE` the verbatim canonical GPL-3.0 text so hosting platforms auto-detect the license instead of reporting "Other." The explanatory preamble (why jstts is GPL — it bundles the eSpeakNG WASM engine) was moved out of `LICENSE`; that rationale already lives in `README.md` (`## License`) and `THIRD_PARTY.md`.

## v0.1.0 — 2026-07-26

First tagged release, plus a licensing correction.

- **Relicensed WTFPL → GPL-3.0-or-later.** jstts bundles the GPL-licensed eSpeakNG WebAssembly build, which makes the distributed whole a combined work under GPL. The `LICENSE` file is now GPL-3.0, and `README.md` reflects it.
- Added `THIRD_PARTY.md` documenting the bundled eSpeakNG (GPL) and other third-party components.
