# Micro-Commute UI 🗺️

## Continuous deployment
Commits to main deploy to https://micro-commute.netlify.app/.

[![Netlify Status](https://api.netlify.com/api/v1/badges/c05aaa12-2d84-44ea-9701-659e93fcdf85/deploy-status)](https://app.netlify.com/sites/micro-commute/deploys)

## Run locally
Run the site at http://localhost:8000.
```shell
npm run develop
```

## Run Storybook
Run the Storybook at http://localhost:6006.
```shell
npm run storybook
```

### Run interaction tests
[Run the Storybook](#run-storybook), then, run the storybook tests.
```shell
npm run test-storybook
```

## Format code
```shell
npx prettier src --write
```
