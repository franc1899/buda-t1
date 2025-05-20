#!/bin/sh

if [ "$RUN_MIGRATIONS" = "true" ]; then
  echo "Running database migrations..."
  npx prisma migrate deploy
  echo "Migration completed!"
fi

echo "Generating Prisma client..."
npx prisma generate
echo "Prisma client generated!"

echo "Starting server..."
if [ "$NODE_ENV" = "production" ]; then
  node dist/src/server.js
else
  npm run dev
fi