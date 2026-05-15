#!/bin/bash
set -e
export NODE_ENV=development
export DB_PORT=3306
export DB_USERNAME=root
export DB_PASSWORD=password
export DB_NAME=splitwise

docker compose -f docker-compose.dev.yml down -v --remove-orphans
docker compose -f docker-compose.dev.yml up --build --force-recreate