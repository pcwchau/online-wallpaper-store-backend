# Online Wallpaper Store Backend

# Development

| Service            | Local Port |
|--------------------|------------|
| Node.js web server | 3001       |
| Docker MySQL       | 3002       |

```sh
# Initialize the project for the first time
# Copy /template/ecosystem.config.js to / and update the config
npm install
npm install -g pm2


# Start the DB and the web server
docker compose up -d
pm2 start ecosystem.config.cjs
```

```sh
# Restart the web server after update
pm2 restart ecosystem.config.cjs

# Stop the web server
pm2 stop app1

# Delete the web server
pm2 delete app1

# Check logging
pm2 logs app1

# Clear logging
pm2 flush

# Check the web server status
pm2 list
```

# Deployment

```sh
# Go to the project directory
cd /home/ec2-user/online-wallpaper-store-backend/

# Follow the development guideline

# Get update from Git (access token is cached)
git pull
npm install # if necessary
pm2 restart ecosystem.config.cjs  # restart the web server

# Request SSL Certificates (ensure port 80 is open)
sudo certbot certonly --standalone -d web.beshinegroup.com
# After receiving SSL cert, ensure they can be accessed
# Certificates should be renewed automatically
```

Useful links:

- https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-up-node-on-ec2-instance.html
- https://gist.github.com/clodal/f19fc9f57e9c419f523164a145777d69

# Error handling

All client side error should include `status` (`400`, `404`, ...), `code` and `details`.

All server sider error, such as DB and unexpected error, should not expose any sensitive details.

All errors will finally be logged in Express middleware error handler.