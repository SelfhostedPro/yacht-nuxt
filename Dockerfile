# Use the official Bun image for the initial stages
# See all versions at https://hub.docker.com/r/oven/bun/tags
FROM node:20-alpine as base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

# Install dependencies into a temp directory
# This will cache them and speed up future builds
FROM base as install
COPY package.json pnpm-lock.yaml ./
RUN apk add --no-cache --force-overwrite --virtual=build-dependencies python3-dev sqlite-dev make g++ && \
    pnpm install --frozen-lockfile && \
    apk del build-dependencies

# Copy node_modules from the temp directory
# Then copy all (non-ignored) project files into the image
FROM base as prerelease
WORKDIR /app
COPY --from=install /app/node_modules /app/node_modules
COPY . .

RUN pnpm run build

# Copy production dependencies and built files into the final image
# Start fresh from the base to reduce the final image size
FROM ghcr.io/linuxserver/baseimage-alpine:3.19 as deploy

# Create 
RUN mkdir -p \
    /data \
    /config

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