#!/bin/sh

if ! command -v composer &> /dev/null; then
    echo "Instalando o Composer..."
    apt update
    apt install -y curl
    curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
else
    echo "Composer já está instalado."
fi
