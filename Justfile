set dotenv-load

setup: install

install:
    bun install --frozen-lockfile

start:
    bun run dev

build:
    bun run build

check:
    bun run check

deploy: install build
    bun run deploy
