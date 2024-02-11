# Use the official Bun image for the initial stages
# See all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1-alpine as base
WORKDIR /app

# Install dependencies into a temp directory
# This will cache them and speed up future builds
FROM base AS install
COPY package.json bun.lockb ./
RUN apk add --no-cache --force-overwrite --virtual=build-dependencies openssh python3-dev make g++ git && \
    bun install --frozen-lockfile --ignore-scripts && \
    apk del build-dependencies


# Copy node_modules from the temp directory
# Then copy all (non-ignored) project files into the image
FROM node:18-alpine AS prerelease
WORKDIR /app
COPY --from=install /app/node_modules /app/node_modules
COPY . .

RUN npm run build

# Copy production dependencies and built files into the final image
# Start fresh from the base to reduce the final image size
FROM ghcr.io/linuxserver/baseimage-alpine:3.17 as deploy
LABEL org.opencontainers.image.title=Yacht
LABEL org.opencontainers.image.url=https://github.com/SelfhostedPro/yacht-nuxt/pkgs/container/yacht-nuxt
LABEL org.opencontainers.image.description="A web interface for managing docker containers with an emphasis on making selfhosting easy"
LABEL org.opencontainers.image.documentation=https://yacht.sh/docs/
LABEL org.opencontainers.image.licenses=MIT
LABEL org.opencontainers.image.base.name=ghcr.io/selfhostedpro/yacht-nuxt:main
LABEL org.opencontainers.image.vendor=SelfhostedPro

LABEL build_version="Yacht version:- ${VERSION} Build-date:- ${BUILD_DATE}"
LABEL maintainer="SelfhostedPro"

WORKDIR /app
COPY root /
RUN apk add --no-cache \
    nodejs
COPY --from=prerelease /app/.output /app/
COPY package.json /app/

# Get Host from environment variable
# This is used to allow the container to be run on any host
ENV NUXT_HOST=0.0.0.0

EXPOSE 3000
