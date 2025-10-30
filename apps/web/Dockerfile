FROM node:20-alpine AS deps
WORKDIR /app
COPY ../../package.json ../../package-lock.json* ./
COPY ../../apps/web/package.json ./apps/web/
COPY ../../packages/contracts/package.json ./packages/contracts/
RUN npm install --workspace apps/web --workspace packages/contracts

FROM node:20-alpine AS builder
WORKDIR /app
COPY ../../ ./
RUN npm install
RUN npm run build -w apps/web

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app ./
EXPOSE 7860
CMD ["npm", "run", "start", "-w", "apps/web", "--", "-H", "0.0.0.0", "-p", "7860"]
