# Ubunto 16.04

## New VPS

### Secure server

After Starting the server, and running `apt-get update` & `apt-get upgrade`, we need to secure the server by removing root access, and creating a new user with sudo rights.

> these commands will achieve this.

```shell
# create user
adduser marc
# now add the new account to the super user group
usermod -aG sudo marc
# create the hidden ssh keys directory
mkdir /home/marc/.ssh
# copy * files from root to my account
cp -rf /root/.ssh/* /home/marc/.ssh/
# because root copied these files, we need to change ownership
chown -R marc:marc /home/marc/.ssh
# To verify that everything copied correctly, list all files in the .ssh folder by typing:
ls -la /root/marc/.shh
# exit, and login with new user to install LAMP
```

### SSL

> installation

```shell
$ sudo apt-get update
$ sudo apt-get install software-properties-common
$ sudo add-apt-repository ppa:certbot/certbot
$ sudo apt-get update
$ sudo apt-get install python-certbot-apache

sudo certbot --apache


```

### Upgrade

Your Vultr VPS is almost ready to install WordPress and LAMP. But first, we want to make sure that it is running the latest base packages and security upgrades. To do so, log back in to the VPS with your newly-created sudo user and type the following:

> use these commands

```shell
sudo apt-get update && sudo apt-get upgrade
```

> Disable root login and turn off password authentication

```shell
# edit the ssh config file
sudo nano /etc/ssh/sshd_config
```

Changes to sshd_config | new value
--- | ---
PermitRootLogin yes | PermitRootLogin no
PasswordAuthentication yes | PasswordAuthentication no

## Firewall

### simple setup

> Enabling firewall

```shell
# allow port 22 for ssh
sudo ufw allow 22
# allow port 80 for wordpress
sudo ufw allow 80
# check if the status is correct, should see a list of rules
sudo ufw status verbose
# if correct, enable the firewall
sudo ufw enable
```

## Apache2

Apache is a free and open-source web server application that sends pages to your visitors’ browsers.

### installation

> code to install apache2

```shell
sudo apt-get install apache2
# test if it's working
hostname -I
#navigation to your ip address in a browser should now show apache2 homepage
```

## MySQl

### installation

> install mysql and depencies & secure

```shell
sudo apt-get install mysql-server php7.0-mysql
# choose a strong password, this will be the main database admin account
# secure the installation
sudo mysql_secure_installation

```

### database

> create database and assign user

```mysql
mysql -u root -p
/* enter password */
/* create database */
CREATE DATABASE wp_mywordpress;
/* create new user and grant privileges */
GRANT ALL PRIVILEGES ON wp_mywordpress.* TO 'your_username_here'@'localhost' IDENTIFIED BY 'your_password_here';
/* reset privs */
FLUSH PRIVILEGES;
/* exit */
EXIT;

```             

## Php 7

### installation

> install php

```shell
sudo apt-get install php7.0 libapache2-mod-php7.0 php7.0-cgi
# test if working below
```

> create info.php file on web server

```shell
sudo nano /var/www/html/info.php
```

> full the file and test

```
<?php
  phpinfo();
?>
// check the file in your browser  
// goto: http://server_IP_address/info.php
```

## Wordpress

### Installation

> navigate to html folder and do the following

```shell
cd /var/www/html

# remove default index page
sudo rm index.html

#download latest wordpress package
sudo wget -c http://wordpress.org/latest.tar.gz
#unzip
sudo tar -xzvf latest.tar.gz
#copy to html folder
sudo cp -r wordpress/* /var/www/html

# remove unneeded folder and package
sudo rm -r /var/www/html/wordpress && sudo rm latest.tar.gz

# everythings owned by root so change it to apache
sudo chown -R www-data:www-data /var/www/html/

# set correct perms for every file in the directory
sudo find /var/www/html/ -type d -exec chmod 755 {} \;
sudo find /var/www/html/ -type f -exec chmod 644 {} \;

# check if permissions are set correctly
ls -la
```

> after creating your database, enter your auth credentials here

```shell
# rename config file
sudo mv wp-config-sample.php wp-config.php
# edit the file and enter in your details
sudo nano wp-config.php

# restart apache and mysql
sudo service apache2 restart
sudo service mysql restart

# open in web browser and finish wp config
```

## CMD

### passwords

 > changing passwords

```shell
## to change sudo password
sudo passwd
# change user password
passwd
# to change another users password
sudo passwd USERNAME
```
