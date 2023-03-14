FROM node:alpine
RUN npm install -g pnpm 

WORKDIR /home/node
ADD package.json pnpm-lock.yaml ./
RUN pnpm install
ENV PATH /home/node/node_modules/.bin:$PATH

ADD . /home/node
RUN pnpm build

RUN pnpm spec:convert
RUN pnpm spec:generate-postman

EXPOSE 3000
USER node
ENTRYPOINT [ "pnpm" ]
CMD [ "start" ]
