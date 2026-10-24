# Source presentation contract

Existing v1 Blocks/listings remain valid. Runtime v2 permits optional source-owned
`tags` and `presentation`. Public v2 listings project those values exactly from
the reviewed source. Tags are 1–6 unique lowercase words with optional hyphens,
at most 30 characters each. An optional `presentation.icon` must match a key in
`contracts/icons.json`, which maps approved host keys to Lucide names/exports.
An unset icon is valid. Retain Lucide ISC and Feather-derived MIT notices.

`presentation.screenshot` contains `path` and `alt`. Use a regular still PNG
inside the package, explicitly distributed, at most 2 MiB, 4096 pixels per edge
and 8 million pixels total. Full decoding is required. Reject links, traversal,
image URLs and vector assets. Recommended capture is 1280×800; complete natural
window dimensions are valid. Never fabricate gameplay or include private content.

Publisher-derived `presentationEvidence.screenshot` contains `sha256`, `width`,
`height` and `mediaType` (`image/png`). Source does not author evidence. Repository,
exact commit, package path and screenshot path pin the asset. Image changes
require a new source review. Metadata-only catalog validation never fetches images.

Dedicated screenshot frames use 16:10 centered contain fit and neutral
letterboxing, without stretch or meaningful-content cropping. Compact icon slots
may differ. Missing media uses an honest placeholder. Hash agreement establishes
content identity, not publisher authenticity, a signature or safety certification.

Older hosts may reject runtime v2. Require a host advertising presentation
support and declare a genuinely tested minimum OS version. Never rewrite an
existing user manifest or claim untested compatibility.
