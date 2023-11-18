@echo off

rem faster npm i (forces lockfile usage)
npm ci --frozen-lockfile

npm start
