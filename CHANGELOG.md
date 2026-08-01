# Changelog

All notable changes per release. Versions follow [semver](https://semver.org)
pre-1.0 conventions: minor bumps may include breaking changes (called out
explicitly), patch bumps are docs / build / fixes only.

## v0.1.4 — 2026-08-01

Infrastructure only. No code in this repo changed — every commit since v0.1.3
touches `.github/workflows/`.

- The pipeline was split: building and publishing stay in `pipeline.yml`, and
  everything that leaves the host now lives beside it in `mirror-and-archive.yml`.
- The repo is mirrored to Codeberg as well as GitLab.
- It is archived to the Wayback Machine, Software Heritage and archive.org.
- Issues opened on either mirror are copied back to GitHub every six hours, and
  closed here when the original closes.
- Pull requests are switched off on the mirrors: they are force-pushed from
  GitHub, so anything merged there would be destroyed by the next sync. Issues
  and forking stay enabled.

## v0.1.3 — 2026-07-27

- Added a GitHub Actions CI status badge to the README.

## v0.1.2 — 2026-07-27

- Added self-hosted version and license badges; added a pipeline.yml running the badges job.

## v0.1.1 — 2026-07-26

- Made `LICENSE` the verbatim canonical GPL-3.0 text so hosting platforms auto-detect the license instead of reporting "Other." The explanatory preamble (why jstts is GPL — it bundles the eSpeakNG WASM engine) was moved out of `LICENSE`; that rationale already lives in `README.md` (`## License`) and `THIRD_PARTY.md`.

## v0.1.0 — 2026-07-26

First tagged release, plus a licensing correction.

- **Relicensed WTFPL → GPL-3.0-or-later.** jstts bundles the GPL-licensed eSpeakNG WebAssembly build, which makes the distributed whole a combined work under GPL. The `LICENSE` file is now GPL-3.0, and `README.md` reflects it.
- Added `THIRD_PARTY.md` documenting the bundled eSpeakNG (GPL) and other third-party components.
