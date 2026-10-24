# Identity and releases

| Concept | Meaning | Changes on publish/update? |
|---|---|---|
| Block ID | Permanent runtime/catalog identity | Preserve it |
| Name | Human-facing title | May change |
| Slug | Publisher-prefixed website route/filename | Preserve for ordinary updates |
| Author | Original creator GitHub handle/profile | Preserve credit |
| Publisher | Current declared publisher handle/profile | Authority/transfer requires maintainer review |
| Repository | Public source link, separate from GitHub profile | Pin/review provenance |
| Version | Author-managed release in block.json and listing | Explicitly change for a release |
| Git commit/path | Exact source revision and package folder | Pin the intended release |
| Package fingerprint | OS review fingerprint of selected/staged files and modes | Recompute for actual installed bytes |

Private and public use the same runtime identity contract. `user.local.*` IDs
are not rewritten during publication. Namespace spelling alone is not proof of
ownership. Public catalog duplicates are rejected, but local name collisions,
identity claims, publisher changes and transfer/dispute policy still need human
review. Do not use automatic name lookup to open an ambiguous Block.

Native versions live in block.json. package.json versions belong to tools or
legacy web apps, not the native Block release. The OS starter begins at 0.1.0;
saving does not auto-increment. Public listing release/minimum-OS strings support
numeric major.minor.patch and optional prerelease identifiers. A listing version
must match the source manifest. Declaring a newer number does not update an
installed package: the current OS rejects an already installed ID.

Pin public listings to an immutable Git commit and exact package folder. Git
source revisions, dependency subtree checksums, archive SHA256 values and
mode-sensitive package fingerprints identify different objects. Do not label
those values interchangeably or describe a checksum as a publisher signature.
A catalog version change alone does not update an installed Block.

The catalog exporter retains creator/publisher profile links and contributors independently of runtime identity. A website should display both the creator profile and source repository so users can inspect reputation and credit. A handle or profile link is not a verified endorsement. Publisher changes do not erase original creator attribution.

Optional `authorId` and `publisherId` retain GitHub numeric account identity alongside mutable handles. Maintainers must verify these against GitHub during review. They are self-declared metadata, not authenticated identity or package signatures. Handle changes must preserve verified account IDs and original creator credit.
