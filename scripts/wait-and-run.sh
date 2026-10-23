#!/bin/sh

echo "📦 Waiting for dependencies to be ready – please wait..."
until [ -f node_modules/.ready ] && [ -f libs/shared/dist/src/index.js ]; do
  sleep 1
done

exec "$@"
