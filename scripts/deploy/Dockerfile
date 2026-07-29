FROM node:22-slim AS builder

# --max-old-space-size
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_OPTIONS=--max-old-space-size=8192
ENV TZ=Asia/Shanghai
ENV CI=true

ARG BUILD_SCRIPT=build:antd
ARG DIST_PATH=apps/web-antd/dist

RUN npm i -g corepack

WORKDIR /app

# copy package.json and pnpm-lock.yaml to workspace
COPY . /app

# 安装依赖
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run ${BUILD_SCRIPT}

RUN echo "Builder Success 🎉"

FROM nginx:stable-alpine AS production

ARG DIST_PATH=apps/web-antd/dist

# 配置 nginx
RUN rm -rf /etc/nginx/conf.d/default.conf

# 复制构建产物
COPY --from=builder /app/${DIST_PATH} /usr/share/nginx/html

# 复制 nginx 配置
COPY --from=builder /app/scripts/deploy/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]
