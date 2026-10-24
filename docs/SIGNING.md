# Signing and trust

Catalog validation and a GitHub merge do not establish a Signed, Verified
publisher or Safe status. The catalog schema does not define a package-signature
or trusted-publisher assertion.

- A Git commit pins source. A signed Git commit is a separate Git identity
  assertion, not a signature over an installed Block package.
- A checksum or package fingerprint identifies bytes or filesystem state. It
  does not establish publisher authority or safety.
- Maintainer review evaluates submission evidence. It does not execute or
  certify every behavior of a Block.
- Declared capabilities describe requested access. They are not proof of a
  sandbox or effective isolation.
- Dependency-provider signatures apply to that provider's packages, not to the
  complete Block.

Review source, license, dependencies and requested capabilities before installing.
Keep private working files and personal settings out of public distributions.
