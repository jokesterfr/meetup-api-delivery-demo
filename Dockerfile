# build image
# -----------
FROM node:alpine AS builder
RUN npm install -g pnpm 

WORKDIR /home/node
ADD package.json pnpm-lock.yaml ./
RUN pnpm install
ENV PATH /home/node/node_modules/.bin:$PATH

ADD . /home/node
RUN pnpm build

RUN pnpm spec:convert
RUN pnpm spec:generate-postman

# clean dev deps
RUN pnpm prune --prod

# production image
# ----------------
FROM node:alpine as production
ENV NODE_ENV=production
ENV APP_NAME=meetup-api-delivery-demo

WORKDIR /home/node
RUN npm install -g pnpm
COPY --from=builder /home/node/package.json ./
COPY --from=builder /home/node/node_modules ./node_modules
COPY --from=builder /home/node/dist ./dist

EXPOSE 3000
USER node
ENTRYPOINT [ "pnpm" ]
CMD [ "start" ]
