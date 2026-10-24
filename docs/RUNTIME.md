# Runtime contract and verification

`contracts/os-contract.json` pins the OS revision and hashes of the authoritative
runtime, starter, dependency and installation sources. JSON schemas are review
snapshots of that implementation. Filesystem/launch checks in Python and real
Qt behavior remain authoritative. This is not an independently versioned fork
of the runtime. Inspect source changes when refreshing snapshots.

## Standard starting points

The four folders under `examples/native/` named blank-canvas, timer, dashboard and
small-game demonstrate stable example identities, native lifecycle IPC,
OS-provided controls and explicit distribution declarations. Their manifests
use private visibility and disabled defaults. Copy a starter,
assign a unique identity once, and implement the actual requested behavior.

The custom-graph example supplies an original custom QML module and a view
loaded dynamically. Its declared import root and dynamic assets are retained.
It is not a claim that BLANNK already provides a graph widget or that a specific
third-party graph library has been audited. Shared appearance is the default;
explicitly custom layouts and controls are valid.

Host QML modules and system packages must exist at runtime. Check providers on
each supported host. The catalog never executes package managers.
Bundled third-party content needs source, immutable revision, license/notices and matching checksums.
Custom QML, Python/native libraries, plugins, shaders and assets are not rejected
because they are unfamiliar. Distribution is author-declared, never guessed
static pruning. Preserve indirect resources and test dynamic paths.

## Checks

`npm run validate:contracts` validates included examples without executing QML.
`validate:block` validates a local descriptor, referenced runtime files, explicit
distribution, local imports, bundled module presence and dependency checksums.
It reports excluded source without deleting it. Optional `--listing` verifies
public intent and exact identity/version/capability agreement.

## Schema limits

Runtime v1 allows qml, hybrid and tui, the actual OS capability list, supported
surfaces and declared helpers. A hybrid runtime requires a body. Public catalog
entries must be optional Blocks, not system Services. `runtime.appId` is window
identity, normally equal to a new starter's Block ID, but the current OS does
not require equality and the snapshot does not invent that requirement.

The OS accepts legacy full-package distribution when no dependency declaration
exists; validation labels it explicitly. New submissions should use minimal
explicit distribution. JSON schemas cannot prove live host-module versions,
plugin ABI/architecture, every dynamic code path or effective permission
isolation. Declared capabilities are not proof of a sandbox. The minimum OS
version in a listing is the author's tested compatibility claim, not proof of
compatibility or an access-control boundary.

## Compatibility testing

Test lifecycle open/hide/state IPC, dependency availability, custom imports and
dynamic assets on each supported architecture. Static validation does not
replace runtime or interaction tests. Report checks actually performed and
known limitations with the submission.
