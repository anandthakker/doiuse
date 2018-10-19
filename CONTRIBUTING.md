# Contributing

## Development

```sh
git clone git@github.com:anandthakker/doiuse.git
cd doiuse
yarn
yarn run babel
```

That last step transpiles the ES6 from src/ to ES5 in lib/. Already happens as a `pretest` step for `yarn test`.

## Contributors

Individuals making significant and valuable contributions are given commit-access to a project to contribute as they see fit. A project is more like an open wiki than a standard guarded open source project.

## Rules

There are a few basic ground-rules for contributors:

1. **No `--force` pushes** or modifying the Git history in any way.
1. **Non-master branches** ought to be used for ongoing work.
1. **External API changes and significant modifications** ought to be subject to an **internal pull-request** to solicit feedback from other contributors.
1. Internal pull-requests to solicit feedback are *encouraged* for any other non-trivial contribution but left to the discretion of the contributor.
1. Contributors should attempt to adhere to the prevailing code-style.

## Releases

Declaring formal releases remains the prerogative of the project maintainer(s).
