# docker build . -t goekesmi/brand-meister-to-discord-notifier
FROM node:16
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
COPY . .
CMD [ "node", "index.js" ]

# Lightsail push
# aws lightsail push-container-image --region us-east-2 --service-name long-running-services --label brand-meister-to-discord-notifier --image goekesmi/brand-meister-to-discord-notifier:latest
