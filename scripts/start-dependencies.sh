#!/bin/sh

echo "📦 Installing dependencies – please wait..."
rm -rf libs/shared/dist
rm -f node_modules/.ready
npm install
touch node_modules/.ready
exec "$@"
