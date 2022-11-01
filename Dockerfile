FROM node:alpine as development
WORKDIR "/app"
COPY ./package.json ./
RUN chown root.root .
RUN npm install -g @nestjs/cli
# RUN npm install --platform=linuxmusl --arch=x64 sharp
# RUN npm install --platform=linuxmusl --arch=arm64v8 sharp
RUN npm install
# RUN npm run migration:run
COPY . .
# RUN npm run build
CMD ["npm", "run", "start:dev"]
# CMD ["npm", "dist/main.js"]