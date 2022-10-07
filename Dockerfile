FROM node:alpine
WORKDIR "/app"
COPY ./package.json ./
RUN npm install
RUN npm install --platform=linuxmusl --arch=x64 sharp
COPY . .
CMD ["npm", "run", "start:dev"]