# Reviewed catalog submission

Publish only source explicitly selected for public release. Creating a Block
does not authorize uploading it.

1. Keep the stable Block ID. Review selected distribution files, custom assets,
   dependency provenance, permissions, secrets and local changes.
2. Explicitly choose a public artifact/source release. Keep private working data
   separate. The export has public intent; a private manifest is not silently
   rewritten or submitted.
3. Publish the intended source under its actual open-source license in a public
   source repository. Select its immutable commit and package folder.
4. Prepare one listing from the template, with a unique publisher-prefixed slug,
   the exact runtime ID/version/capabilities and a genuinely tested OS minimum.
   Retain the creator GitHub handle/profile, source repository, and any distinct
   publisher/contributor credit.
5. Run metadata and local source validation. Record actual native preview,
   dependency and data/reinstall results, or clearly mark them not run.
6. Open a standardized PR. A maintainer checks source access, identity ownership,
   license, minimum-version claim, requested capabilities, included files and
   validation evidence. CI is metadata-only and does not fetch/execute QML.
7. A maintainer merges. The listing becomes eligible for the next explicit
   website catalog sync/build. No automatic website deployment, package upload,
   installed OS update or local enablement occurs in this repository.

Use another PR for updates, preserving ID/ordinary slug and changing version and
source commit. Validation does not currently compare against previous main to
prove a monotonic release, ownership continuity or source honesty; reviewers must
check these. Withdrawal removes a listing from the next build but does not
uninstall local copies or erase Git history. Ownership transfer, disputes and
slug redirects require a defined maintainer process, not automatic ID changes.

Do not submit private URLs, credentials, private source or local profiles.
Public Marketplace contributions need their own actual open-source licenses.
Public access to this catalog does not license the OS implementation or grant
redistribution rights to first-party starter files.
