FROM debian:12

COPY ./scripts/* /usr/local/bin

RUN install-dependencies
RUN install-composer

COPY env-variables.ini /usr/local/etc/php/conf.d/env-variables.ini

WORKDIR /var/www/html

STOPSIGNAL SIGKILL

CMD test -d ./vendor || composer install; php artisan serve --host=0.0.0.0
