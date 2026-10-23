# Identity and releases

| Concept | Meaning | Changes on publish/update? |
|---|---|---|
| Block ID | Permanent runtime/catalog identity | Preserve it |
| Name | Human-facing title | May change |
| CLI alias | Readable local handle pointing to an ID | Proposed OS feature, not implemented |
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

Current OS Git installation resolves a moving requested ref to an immutable
commit, shows it in the review/result, and fingerprints the staged package.
Those origin details are not yet a durable installed-origin receipt. Catalog
metadata does not currently include an exact package artifact digest. Git source
revision, the dependency subtree checksum, archive SHA256 and the OS's
mode-sensitive staged-tree fingerprint are different things; do not label them
interchangeably or invent an artifact signature.

A future updater should record origin, release version, resolved source revision,
package fingerprint and dependency state; detect local modifications; present
the change; preserve user data/registration; and retain an atomic rollback point.
Existing uninstall/restore archives are useful foundations, not a completed
version-aware updater. Establish canonical artifact serialization and the
installed receipt before adding package digest/signature fields to this catalog.
No such OS behavior is silently changed by this repository alignment.

The catalog exporter retains creator/publisher profile links and contributors independently of runtime identity. A website should display both the creator profile and source repository so users can inspect reputation and credit. A handle or profile link is not a verified endorsement. Publisher changes do not erase original creator attribution.

Optional `authorId` and `publisherId` retain GitHub numeric account identity alongside mutable handles. Maintainers must verify these against GitHub during review. They are self-declared metadata, not authenticated identity or package signatures. Handle changes must preserve verified account IDs and original creator credit.
