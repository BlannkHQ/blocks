# BLANNK Blocks

The private Git-backed contract, starter and public-listing catalog repository
for **BLANNK OS**, **Blannk, LLC** and **blannk.com**. Public contributions are not
open yet. Repository visibility, website deployment and billing are unchanged.

## One runtime contract, private or public

The implementation is authoritative in
[BLANNK_OS_CANVAS](https://github.com/BlannkHQ/BLANNK_OS_CANVAS). This repository
contains reviewable, pinned schema snapshots and actual native starters, not a
second OS runtime implementation. See [contract provenance](contracts/os-contract.json)
and [runtime integration](docs/RUNTIME.md).

- `block.json` describes stable identity, version, runtime, surfaces and capabilities.
- `block-dependencies.json` selects distribution files and declares host/bundled
  modules, custom import paths, provenance and dynamic assets.
- Native starters import OS-provided `Blannk.Design 1.0`; they do not copy the OS
  control library. Custom interfaces, graphs and legitimate libraries are allowed.
- Private and public Blocks use those same runtime contracts. Private source is
  kept locally or in its owner's private repository, outside this public-intent catalog.

[Examples](examples/README.md) include the four canonical OS starters and a
custom graph with a dynamically loaded view. Examples are not catalog entries.

## Permanent identity

Keep the same Block ID when editing, publishing or releasing an update. An
existing `user.local.<generated-id>` is valid; publishing does not rename it to
a GitHub handle. The readable name, CLI alias, website slug, author, release
version, Git revision and exact installed-package fingerprint are separate
concepts. Only `user.*.*` optional Blocks belong in public installable listings;
OS-reserved `blannk.*` components are managed by the OS.

The listing's publisher-prefixed slug controls its website route and JSON
filename. It does not replace runtime identity. Duplicate IDs/slugs are rejected.
Maintainers verify ownership independently of the ID's spelling. See
[identity and release rules](docs/IDENTITY-AND-RELEASES.md).

## Contributor credit and provenance

Published records retain `author` as the creator's GitHub handle and export a
canonical `authorProfile` link. `repository` is a separate source-repository link.
An optional current `publisher` defaults to the author; its profile is exported
separately, and additional `contributors` can be credited. The `listingLinks`
helper returns those links for consumers. The Marketplace UI should display the
creator handle/profile and source link prominently, with publisher/contributor
credit when different. This PR provides that data contract, not a deployed
website renderer change.

A self-asserted handle/profile is attribution and evidence for human review,
not a verified endorsement or proof that the contributor owns the source/ID.
Maintainers still check authority, provenance and ownership continuity.

## Validate locally

Use Node.js 22+:

```sh
npm ci --ignore-scripts
npm test
npm run validate
npm run validate:contracts
npm run validate:block -- /path/to/block
npm run validate:block -- /path/to/public-block --listing blocks/publisher-example.json
```

The last command checks that public listing ID, version and permissions match
its actual runtime manifest, including explicit public artifact intent. It does
not change a private Block into a public one. Validation reads local files and
metadata; it does not fetch or execute submitted QML, install dependencies,
verify a signature, or certify compatibility/safety.

Maintainers can compare against the real OS validators and opt into isolated
native preview. See [runtime validation](docs/RUNTIME.md). Schema/fixture refresh
requires an explicitly selected trusted OS checkout and review of the pinned diff.

## Publish through a reviewed PR

This repository stores one **public-intent listing** per Block in
`blocks/<publisher>-<block>.json`. Source, README and actual license stay in the
publisher's public source repository. Copy `examples/listing-template.json` and
replace every placeholder, using the existing Block ID and a full immutable
40-character source commit. The listed path must identify the package folder.

An explicit publish request should prepare a preview of the exported source and
standardized listing PR. It must not upload private working folders, credentials,
local settings or unreviewed modifications. There is no automatic OS publish
adapter today. See [publishing](docs/PUBLISHING.md) for the current/manual flow.

A maintainer reviews identity ownership, source, license, capabilities, packaging
and actual validation evidence before merging. A merge makes the listing eligible
for the next website catalog sync/build; it does not deploy the website or install
anything by itself. The GitHub API currently reports that this account's plan
cannot enforce private-repository branch protections/rulesets. Review is the
maintainer policy, not a falsely claimed enforced gate. Keep private while that
publishing-enforcement decision is pending.

## Website integration

The existing export interface remains metadata-only:

```sh
npm run catalog:sync -- ../blocks
npm run build
```

Run those from the website checkout, pointing to this repository. Sync imports
validated listings/schema/template, not Block source, private data or Git history.
The website snapshot can build without live access to this private repository.
An existing website snapshot must sync the aligned validator/schema before
consuming newly permitted IDs, capabilities or Games listings. This PR does not
publish the website or change its deployed snapshot. Empty catalogs remain valid.

## Signatures and remaining integrations

No package-signing or trusted-key protocol exists here or in the current OS
installer. A pinned Git commit and package hash are integrity/review identifiers,
not a publisher signature, maintainer approval, or a security certificate.
[Signing and trust](docs/SIGNING.md) distinguishes those meanings and records the
remaining key/format/revocation decisions without inventing a protocol.

The current OS still needs a publishing adapter, readable aliases, durable
origin/install receipts, and a reviewed version-aware update/rollback flow.
Existing removal/restore archives are not yet that updater. These are distinct
OS features; this repository alignment does not silently implement or promise them.

The OS is not currently designated open source. This work does not authorize
opening or relicensing its private implementation. Public Marketplace
contributions are intended to have actual open-source source licenses. These
first-party contract/starter snapshots remain in this private repository; their
public distribution/license policy needs an explicit decision before opening it.

© Blannk, LLC. Individual Blocks retain their own declared licenses. Catalog
inclusion does not grant a blanket license to third-party Block source.
