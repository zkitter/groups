FROM node:19-alpine as base

RUN apk update
RUN apk add bash
RUN npm i -g pnpm

WORKDIR app

COPY .npmrc package.json pnpm-lock.yaml ./
COPY package-scripts.yaml ./

FROM base as build

COPY prisma prisma
RUN pnpm install --frozen-lockfile --prod
RUN cp -R node_modules prod_node_modules

RUN pnpm i --frozen-lockfile

COPY src src
COPY .barrelsby.json tsconfig.json tsconfig.compile.json ./
RUN pnpm run nps barrels compile

FROM base as release

COPY --from=build /app/prod_node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY public ./public

EXPOSE 3000

COPY secrets-entrypoint.sh /usr/local/bin/secrets-entrypoint.sh
RUN chmod +x /usr/local/bin/secrets-entrypoint.sh
ENTRYPOINT ["secrets-entrypoint.sh"]

CMD ["pnpm", "run", "start"]

