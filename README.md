# Blannk Blocks

The Git-backed Block catalog for **Blannk, LLC** and **blannk.com**. Private development repository; public contributions are not open yet. No database, web accounts, package upload service or OS installation runtime.

## What belongs here

One public-intent JSON listing per Block in `blocks/<github-handle>-<block>.json`. QML source remains in the developer's repository; a listing points to an immutable commit and a folder containing the Block. Public listings must reference public source with an open-source license.

This is a catalog schema, **not** the final OS runtime manifest. The OS extension contract and runtime remain in development. Declared permissions and minimum versions do not prove compatibility or safety. No QML is fetched or executed by these checks.

**Private Blocks never belong in this catalog**, even while the catalog repository itself is private. Keep private source, manifests and credentials on your own machine or in your own private repository. `visibility: private` is rejected, not hidden. Committed files remain accessible through Git history.

## Contribute

1. Clone this repository with authorized GitHub access (fork once public contributions open).
2. Keep your Block source, README and license in your source repository.
3. Copy `examples/listing-template.json` to `blocks/<handle>-<name>.json`.
4. Replace every placeholder. Use a lowercase namespaced ID, an author-prefixed slug, an allowed open-source license and a full 40-character source commit. `path` is a relative folder such as `block` or `packages/my-block`; traversal and root paths are not accepted.
5. Run `npm ci`, `npm test`, and `npm run validate` with Node.js 22+.
6. Open a pull request. A maintainer verifies source access, author authority, license and capabilities before merging. CI checks metadata automatically; it does not certify source code.
7. Sync the catalog into the website and rebuild. This initial repository does not deploy the site or install Blocks automatically.

Updates keep the same ID and slug, change the version and pinned commit, and use another PR. Remove a listing with a PR to withdraw it from the next website/catalog build. Removal does not uninstall existing local copies.

The supported license list can be extended through a schema contribution. Version fields use numeric major.minor.patch, with optional prerelease identifiers for the Block version. The public template's schema URL will work after the website is deployed; local validation uses `schema/listing.schema.json` now.

## Website integration

From the `blannk-website` checkout:

```sh
npm run catalog:sync -- ../blannk-blocks
npm run build
```

Sync imports validated listings and the schema/template, not source packages, credentials or Git history. The website builds static detail pages and `/blocks/catalog.json`. Only real listings appear in that feed; website design concepts are excluded. The website snapshot can build without access to this private repository.

## Launch later

Keep this repository private while testing. Before opening contributions, decide the supported OS contract, installation/signature protocol, abuse-reporting route, ownership policy and deployment automation. Public fork-and-PR submissions require a public contribution repository; private collaborators can use branches and PRs now. Changing repository visibility is a separate explicit decision.

© Blannk, LLC. Individual Blocks retain their own declared licenses. No blanket license is granted to third-party Blocks by catalog inclusion.
