# Sử dụng Nginx bản nhẹ để phục vụ web static
FROM nginx:alpine

# Copy toàn bộ source code FE vào thư mục chứa web của Nginx
COPY . /usr/share/nginx/html

# Mở cổng 80 chuẩn web
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]