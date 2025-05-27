# Online Wallpaper Store Backend

- [Online Wallpaper Store Backend](#online-wallpaper-store-backend)
- [Development](#development)
  - [Initialize](#initialize)
  - [Develop](#develop)
- [Production](#production)
  - [Initialize (Red Hat Enterprise Linux 9)](#initialize-red-hat-enterprise-linux-9)
  - [Deploy](#deploy)
- [Error handling](#error-handling)


This is a CMS for the online wallpaper store.

# Development

| Service | Version | Local Port |
|---------|---------|------------|
| Node.js | 22.11.0 | 3001       |
| MySQL   | 8.4.3   | 3002       |

## Initialize

```sh
> Install Docker and Node.js.
> Copy /template/ecosystem.config.js to / and update the config.

$ npm install
$ npm install -g pm2
$ docker compose up -d
```

## Develop

```sh
$ pm2 start ecosystem.config.cjs

# Restart the web server after update
$ pm2 restart ecosystem.config.cjs

# Stop the web server
$ pm2 stop app1

# Delete the web server
$ pm2 delete app1

# Check logging
$ pm2 logs app1

# Clear logging
$ pm2 flush

# Check the web server status
$ pm2 list
```

# Production

| Service | Version | Local Port |
|---------|---------|------------|
| Node.js | 22.16.0 | 3001       |
| MySQL   | 8.4.3   | 3306       |

## Initialize (Red Hat Enterprise Linux 9)

```sh
# Install Node.js. https://nodejs.org/en/download
$ sudo yum install unzip
$ curl -o- https://fnm.vercel.app/install | bash # Then, exit and open a new SSH connection
$ fnm install 22

# Install MySQL. https://dev.mysql.com/doc/mysql-yum-repo-quick-guide/en/
$ sodu yum install wget
$ wget https://dev.mysql.com/get/mysql84-community-release-el9-1.noarch.rpm
$ sudo yum localinstall mysql84-community-release-el9-1.noarch.rpm
$ sudo yum install mysql-community-server

# Initialize MySQL.
$ sudo grep 'temporary password' /var/log/mysqld.log # check root pw
$ mysql -uroot -p # enter the temporary root pw
$ ALTER USER 'root'@'localhost' IDENTIFIED BY 'MyNewPass4!'; # change the pw

# Start the MySQL server.
$ sudo su
$ systemctl start mysqld

# Install git.
$ sudo yum install git

> Pull the project. Go to the project root directory.

$ cp template/ecosystem.config.cjs ./ # update the config
$ npm install
$ npm install -g pm2

# Go to MySQL. Initialize the database.
mysql> source /home/ec2-user/online-wallpaper-store-backend/schema/inspiration.sql

# Start the server.
$ pm2 start ecosystem.config.cjs

# Install snapd (for certbot). https://snapcraft.io/docs/installing-snap-on-red-hat
$ sudo dnf install https://dl.fedoraproject.org/pub/epel/epel-release-latest-9.noarch.rpm
$ sudo dnf upgrade
$ sudo yum install snapd
$ sudo systemctl enable --now snapd.socket
$ sudo ln -s /var/lib/snapd/snap /snap

# Install certbot. https://certbot.eff.org/instructions?ws=other&os=ubuntufocal
$ sudo snap install --classic certbot

# Request SSL Certificates
> Map the domain name to the public IP address in the zone editor.
> Ensure port 80 of the instance is open
$ sudo certbot certonly --standalone -d domain-name
# After receiving SSL cert, ensure they can be accessed
# Certificates should be renewed automatically
```

## Deploy

```sh
> Go to the project root directory.

$ git pull
$ npm install # if necessary
$ pm2 restart ecosystem.config.cjs
```

Useful links:

- https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-up-node-on-ec2-instance.html
- https://gist.github.com/clodal/f19fc9f57e9c419f523164a145777d69

# Error handling

All client side error should include `status` (`400`, `404`, ...), `code` and `details`.

All server sider error, such as DB and unexpected error, should not expose any sensitive details.

All errors will finally be logged in Express middleware error handler.