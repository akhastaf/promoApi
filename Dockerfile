FROM node:alpine
WORKDIR "/app"
COPY ./package.json ./
RUN chown root.root .
RUN npm install -g @nestjs/cli
# RUN npm install --unsafe-perm sharp
RUN npm install
# RUN npm run migration:run
COPY . .
CMD ["npm", "run", "start:dev"]