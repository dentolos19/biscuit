set dotenv-load
set dotenv-filename := dotenv_file
set dotenv-override

environment := ""
dotenv_file := if environment == "" { ".env" } else { ".env." + environment }

setup: install

install:
    bun install --frozen-lockfile

start:
    bun run dev

build:
    bun run build

check:
    bun lint --fix && bun fmt && bun check --no-script

deploy: install build
    #!/usr/bin/env bash
    set -euo pipefail
    bun run deploy --prebuilt
