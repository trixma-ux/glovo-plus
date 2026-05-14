FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install
COPY . .
RUN npx prisma generate || true
RUN npm run build
EXPOSE 3003
CMD ["sh", "-c", "if [ -d prisma ]; then npx prisma db push; fi && npm run start:prod"]
