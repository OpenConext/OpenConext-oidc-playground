FROM ghcr.io/openconext/openconext-basecontainers/apache2:latest
COPY ./build/ /var/www/html
COPY ./docker/conf/000-default.conf /etc/apache2/sites-enabled/000-default.conf
