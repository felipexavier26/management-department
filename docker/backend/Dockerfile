FROM debian:12

RUN apt-get update && apt-get install -y \
    bash \
    curl \
    git \
    unzip \
    php \
    php-cli \
    php-fpm \
    php-mysql \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /usr/local/bin/scripts

COPY docker/backend/scripts /usr/local/bin/scripts/

RUN chmod +x /usr/local/bin/scripts/*.sh

RUN ls -l /usr/local/bin/scripts/  

RUN /usr/local/bin/scripts/install-dependencies.sh  

RUN /usr/local/bin/scripts/install-composer.sh

COPY docker/backend/env-variables.ini /usr/local/etc/php/conf.d/env-variables.ini

WORKDIR /var/www/html

COPY . .

CMD ["php", "-S", "0.0.0.0:8000", "-t", "/var/www/html"]
