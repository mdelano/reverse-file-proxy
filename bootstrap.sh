#!/usr/bin/env bash

sudo apt-get update

# Install NodeJS
sudo apt-get install -q -y python-software-properties
sudo add-apt-repository ppa:chris-lea/node.js
sudo apt-get update
sudo apt-get install -q -y nodejs
sudo npm install forever -g # For running our app as a service

# Misc Dependencies
apt-get install -q -y build-essential
apt-get install -q -y zip

# Document Dependencies
apt-get install -q -y libreoffice
apt-get install -q -y swftools
apt-get install -q -y pdf2svg
apt-get install -q -y xpdf

#pdf2swf
apt-get -y install libart-2.0-2 libjpeg62 libt1-5       # Manually-resolve dependencies for swftools_0.8.1
wget -P /tmp/ http://launchpadlibrarian.net/11111323/swftools_0.8.1-1ubuntu1_amd64.deb
dpkg -i /tmp/swftools_0.8.1-1ubuntu1_amd64.deb
rm /tmp/swftools_0.8.1-1ubuntu1_amd64.deb

# Image Dependencies
# GraphicsMagick Dependencies
apt-get install -q -y libpng-dev
apt-get install -q -y dcraw
apt-get install -q -y ghostscript
apt-get install -q -y libgs-dev
apt-get install -q -y libwebp-dev
apt-get install -q -y libjpeg-dev
apt-get install -q -y libgif-dev
apt-get install -q -y libpnglite-dev
apt-get install -q -y libfreetype6-dev
apt-get install -q -y libt1-dev

# ImageMagick
sudo apt-get install imagemagick

# GraphicsMagick
tar -xvzf /vagrant/deployment/deps/GraphicsMagick-1.3.20.tar.gz -C /vagrant
sudo mkdir -p /vagrant/GraphicsMagick-1.3.20/build
cd /vagrant/GraphicsMagick-1.3.20/build
sudo /vagrant/GraphicsMagick-1.3.20/configure --with-gslib=yes
sudo make
sudo make install

cd /vagrant/app && node app
