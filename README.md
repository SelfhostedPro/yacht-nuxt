# Yacht Alpha

For alpha testing, you can start yacht with the following command:

```bash
docker run -d \
    --name yacht \
    -p 3000:3000 \
    -v /var/run/docker.sock:/var/run/docker.sock \
    ghcr.io/selfhostedpro/yacht-nuxt:main
```

if you'd like persistent configs you can run this instead:

```bash
docker run -d \
    --name yacht \ #or whatever name you want
    -p 3000:3000 \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v /path/to/config/dir/or/volume/name:/config \ # for yacht config directory
    -v /path/to/data/dir/or/volume/name:/data \ # for yacht project/data directory
    ghcr.io/selfhostedpro/yacht-nuxt:main
```

to pull a newer image run the following:

```bash
docker image pull ghcr.io/selfhostedpro/yacht-nuxt:main
```

you can remove yacht with the following command:

```bash
docker rm -f yacht # or whatever name you set above
```

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# pnpm
pnpm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# pnpm
pnpm run dev
```

## Production

Build the application for production:

```bash
# pnpm
pnpm run build
```

Locally preview production build:

```bash
# pnpm
pnpm run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
