FROM nginx:stable-alpine3.17-slim

WORKDIR /usr/share/nginx/html

COPY dist/. .

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
