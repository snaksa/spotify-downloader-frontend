This repo contains a ReactJS application which connects to Symfony API implemented in the following repository **[spotiy-downloader-backend](https://github.com/snaksa/spotify-downloader-backend)**

## Tech Stack
- **[ReactJS](https://reactjs.org)**
- **[Docker](https://www.docker.com)**

### Requirements
- **[Docker](https://www.docker.com)**

### Prerequisites
- **[Spotify project and API key](https://developer.spotify.com)**

### Installation
Clone the GitHub repository
```bash
git clone git@github.com:snaksa/spotify-downloader-frontend.git
cd spotify-downloader-frontend
```

Build docker image or use the public one from **[DockerHub](https://hub.docker.com/u/snaksa)**
```bash
docker build -t snaksa/spotify-downloader-frontend .
```

Docker Compose configuration to run the project
```yaml
version: "3"

services:
  app:
    image: snaksa/spotify-downloader-frontend
    build:
      context: .
    container_name: spotify-frontend
    env_file:
      - .env
    ports:
      - "3000:3000"
``` 

### Environment variables
The application relies on several environment variables for its configuration.
- `REACT_APP_URL` - Current app URL
- `REACT_APP_API_URL` - Spotify backend URL (**[spotify-downloader-backend](https://github.com/snaksa/spotify-downloader-backend)**)
- `REACT_APP_DOWNLOAD_URL` - NodeJS app to download audio from Youtube URLs (**[youtube-mp3-downloader](https://github.com/snaksa/youtube-mp3-downloader)**)
- `REACT_APP_SPOTIFY_CLIENT_ID` - Spotify project API key

### Backend
You need the Symfony backend API to be able to use this app which is implemented in the following repository **[spotiy-downloader-backend](https://github.com/snaksa/spotify-downloader-backend)**. 

### NodeJS
You need the following NodeJS server to download audio from Youtube **[youtube-mp3-downloader](https://github.com/snaksa/youtube-mp3-downloader)**
