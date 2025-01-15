@echo off

rem faster npm i (forces lockfile usage)
npm ci --frozen-lockfile --no-audit && npm start
