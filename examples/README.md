# Native starting points

The blank-canvas, timer, dashboard and small-game folders are generated from the
OS's canonical starter function at the revision in contracts/os-contract.json.
They contain only their manifest, QML, preview and dependency declaration.
The OS supplies Blannk.Design. No complete design library is copied.

custom-graph demonstrates original custom controls, a bundled QML module and a
dynamic view. Its manifest uses private visibility and disabled defaults. The
example graph is not a third-party library or an OS-provided widget.

Copy a starter and assign a unique ID once for a real new Block. Preserve an
existing ID when moving an existing Block through Git, Manager or a catalog PR.
Choose and include the actual license before releasing public source; examples
and listing placeholders are not an automatic license grant for someone else's
Block. Read docs/RUNTIME.md for static/native checks and custom dependencies.

Public availability of these examples does not license the OS implementation.
No blanket redistribution license is granted here for these first-party starter
files. Individual Blocks require their own actual license.
