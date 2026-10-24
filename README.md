# BLANNK Blocks

The public Block catalog, compatibility contracts and native examples for
**BLANNK OS**, **Blannk, LLC** and **blannk.com**.

## Build compatible Blocks

- `block.json` declares permanent identity, version, visibility, runtime,
  surfaces and capabilities.
- `block-dependencies.json` selects distribution files and declares host/bundled
  modules, import paths, provenance and dynamic assets.
- Native examples import OS-provided `Blannk.Design 1.0`. This repository does
  not include the host design library or the OS runtime implementation.
- Private and public Blocks use the same compatibility contracts. Keep private
  source and personal data outside public submissions.

See the [native examples](examples/README.md), [runtime contract](docs/RUNTIME.md)
and [identity and release rules](docs/IDENTITY-AND-RELEASES.md). Schema provenance
is recorded in [contracts/os-contract.json](contracts/os-contract.json).

Keep the same `user.*.*` Block ID when editing or publishing. Existing
`user.local.*` IDs remain valid. A name, website slug, author, version and Git
revision have separate meanings. OS-reserved `blannk.*` components are not public
installable catalog entries.

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

The last command checks that the public listing matches its source manifest's
ID, version, capabilities and public intent. Validation reads local metadata and
files. It does not fetch or execute submitted QML, install dependencies, verify
publisher signatures or certify safety. Test actual behavior on each supported
host and architecture.

## Submit a listing

Store one public-intent listing in `blocks/<publisher>-<block>.json`. Start with
`examples/listing-template.json`, preserve the runtime ID and pin a full
40-character source commit plus the package subdirectory. Source and its actual
open-source license belong in the publisher's public repository.

Retain the creator's `author` handle and source repository link. A distinct
`publisher` and additional `contributors` can be credited separately. Attribution
is not proof of ownership or an endorsement. Maintainers review submission
authority, source, license, capabilities and validation evidence.

Submit through a reviewed pull request. A merge makes a listing eligible for a
website catalog sync/build; it does not deploy the website, install a Block or
enable it locally. See [publishing](docs/PUBLISHING.md) and
[signing and trust](docs/SIGNING.md).

## Consume the catalog

The export interface is metadata-only. From a compatible website checkout:

```sh
npm run catalog:sync -- ../blocks
npm run build
```

Sync imports validated listings, schema and template, not Block source or Git
history. Consumers must use the matching schema/validator. Empty catalogs are
valid and do not affect locally installed Blocks.

## Rights

Public access to this catalog does not designate the BLANNK OS implementation
open source or grant a license to it. No blanket redistribution license is
granted here for first-party contract or starter files. Individual public Blocks
retain their own declared licenses; catalog inclusion does not relicense them.

© Blannk, LLC.
