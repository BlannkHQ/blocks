# Signing and trust: current facts

There is no implemented publisher/package signing protocol, signature field,
trusted-key store or revocation workflow in this repository/current Block
installer. Do not display a Signed, Verified publisher or Safe badge based only
on catalog validation or a GitHub merge.

- A Git commit pins source. A signed Git commit, if present, is a separate Git
  identity assertion and is not an installed-package signature.
- A SHA256 or OS package fingerprint identifies reviewed bytes/state. A checksum
  has no signer and does not prove author authority or safety.
- Maintainer PR approval accepts catalog metadata/source evidence under policy.
  It is not cryptographic signing and does not execute or certify the Block.
- Local Authentication authorizes a system operation. It does not sign the Block.
- Dependency manager signatures remain that provider's own verification; they
  are not signatures over the whole Block.

Before a signing feature, decide the artifact/manifest format and canonical
serialization, signer role (publisher and/or BLANNK), key issuance/storage,
rotation/revocation and verification/recovery policy. A publishing adapter must
show exactly what will leave the device and what will be signed, then request
explicit user action. Never upload a private Block to obtain a catalog identity.

The current GitHub plan reports that private branch protections/rulesets are not
available. Required-review enforcement needs a supported private-repo plan or
another independently enforced release gate before automated publication. Keep
repository visibility private; changing it or account billing is a separate
explicit decision. This alignment adds documentation/tests, not a pretend gate
or an unreviewed cryptographic protocol.
