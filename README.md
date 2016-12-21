# lobby-wall-events-map-app
React prototype for lobby wall map and event listing.

## Build Notes:

### .env variable for webpack module bundler build
The URL for the events data feed is saved as global EVENTS_API_URL variable
expected by webpack for dev and prod distribution builds. The variable is
saved in local .env file in project root and excluded from git repo.
