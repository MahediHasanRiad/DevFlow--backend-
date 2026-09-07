FROM node:22-alpine

WORKDIR /src

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 5000

CMD ["npm", "run", "dev"]