FROM node:alpine
WORKDIR "/app"
COPY ./package.json ./
RUN chown root.root .
RUN npm install -g @nestjs/cli
# RUN npm install --platform=linuxmusl --arch=x64 sharp
RUN npm install
# RUN npm run migration:run
COPY . .
CMD ["npm", "run", "start:dev"]