## install nginx

```bash
sudo apt-get install -y nginx
cd /etc/nginx/sites-available

sude vim default

location /api {
    rewrite ^\/api\/(.*)$ /api/$1 break;
    proxy_pass http://localhost:5002;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}

sudo systemctl restart nginx