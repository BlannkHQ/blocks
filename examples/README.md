# Native starting points

The blank-canvas, timer, dashboard and small-game folders are generated from the
OS's canonical starter function at the revision in contracts/os-contract.json.
They contain only their manifest, QML, preview and dependency declaration.
The OS supplies Blannk.Design. No complete design library is copied.

custom-graph demonstrates original custom controls, a bundled QML module and a
dynamic view. It remains private and disabled. Its example graph is not a
third-party library and makes no claim to be an OS-provided widget.

Copy a starter and assign a unique ID once for a real new Block. Preserve an
existing ID when moving an existing Block through Git, Manager or a catalog PR.
Choose and include the actual license before releasing public source; examples
and listing placeholders are not an automatic license grant for someone else's
Block. Read docs/RUNTIME.md for static/native checks and custom dependencies.

The OS itself is not currently designated open source. These first-party starter snapshots remain private under the existing repository status; their public distribution/license policy needs an explicit owner decision. An open-source requirement for third-party Marketplace submissions does not relicense private OS code.
