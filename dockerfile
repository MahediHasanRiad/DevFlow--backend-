FROM node:26.8.2-alpine3.24

# Hardcoded dummy connection strings for the build phase only
ENV DIRECT_URL="postgresql://postgres:postgres@localhost:5432/dummy?schema=public"
ENV DATABASE_URL="postgresql://postgres:postgres@localhost:5432/dummy?schema=public"

RUN apk add --no-cache openssl libc6-compat

WORKDIR /src

COPY package*.json ./ 

RUN npm ci

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 5000

CMD ["npm", "run", "dev"]