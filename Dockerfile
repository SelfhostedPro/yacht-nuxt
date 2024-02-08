# Use the official Bun image for the initial stages
# See all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1-alpine as base
WORKDIR /usr/src/app

# Install dependencies into a temp directory
# This will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && \
    # apk add --no-cache --force-overwrite --virtual=build-dependencies python3-dev cmake g++ && \
    bun install --frozen-lockfile --ignore-scripts

# Install dependencies without excluding devDependencies
# Since some dependencies might be needed for the build process
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
ENV NODE_ENV=production
RUN cd /temp/prod && bun install --frozen-lockfile --ignore-scripts


# Copy node_modules from the temp directory
# Then copy all (non-ignored) project files into the image
FROM node:18-alpine AS prerelease
WORKDIR /usr/src/app
COPY --from=install /temp/dev/node_modules /usr/src/app/node_modules
COPY . /usr/src/app

# Set NODE_ENV to production and run the build
ENV NODE_ENV=production
RUN npm run build

# Copy production dependencies and built files into the final image
# Start fresh from the base to reduce the final image size
FROM ghcr.io/linuxserver/baseimage-alpine:3.17 as deploy

LABEL build_version="Yacht version:- ${VERSION} Build-date:- ${BUILD_DATE}"
LABEL maintainer="SelfhostedPro"

WORKDIR /app
RUN apk add --no-cache \
    nodejs
COPY --from=install /temp/prod/node_modules /app/node_modules
COPY --from=prerelease /usr/src/app/.output /app/
COPY package.json /app/
COPY root /

# Get Host from environment variable
# This is used to allow the container to be run on any host
ENV NUXT_HOST=0.0.0.0

EXPOSE 3000
