# lobby-wall-events-map-app
React web application for lobby wall map and event listing.

## Build Notes:

### .env variable for webpack module bundler build
The URL for the events data feed is saved as global EVENTS_API_URL variable
expected by webpack for dev and prod distribution builds. The variable is
saved in local .env file in project root and excluded from git repo.

## Installation:

Clone lobby-wall-events-map repo locally.

```
$ cd lobby-wall-events-map
$ yarn
```

Find .env file in team Google Drive:
```
+-- DME: Web & Interactive
|   +-- Exhibit Interactives
|   |   +-- Lobby Welcome Wall Events App
|   |   |   +-- Technical
```

Copy .env into root of local lobby-wall-events-map project

## Testing

Unit and regression snapshot testing using Enzyme and Jest test utilities are
in place with test init script in package.json.

```
yarn test
```

# Development and Production Builds

Webpack build init scripts in package.json

```
yarn run dev
yarn run prod
```
