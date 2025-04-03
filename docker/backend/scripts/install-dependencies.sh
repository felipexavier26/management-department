#!/bin/sh

set -xe

apt update

# Instalar pacotes necessários e PHP
apt install -y \
    php \
    php-cli \
    php-fpm \
    php-gd \
    php-intl \
    php-opcache \
    php-mysql \
    php-mysqli \
    php-mbstring \
    php-imagick \
    php-zip \
    php-xml \
    libjpeg-dev \
    libwebp-dev \
    libgd-dev \
    php-curl \
    curl