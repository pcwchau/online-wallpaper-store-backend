# Online Wallpaper Store Backend

# Development

```sh
# Initialize the project for the first time
npm install

# Install pm2 if it is not yet installed
npm install -g pm2

# Start the web server (env_development in ecosystem.config.js)
pm2 start ecosystem.config.js --env development

# Restart the web server after update
pm2 restart ecosystem.config.js --env development

# Stop the web server
pm2 stop all

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

# Start the web server (env_production in ecosystem.config.js)
pm2 start ecosystem.config.js --env production

# Get update from Git (access token is cached)
git pull
npm install # if necessary
pm2 restart ecosystem.config.js --env production # restart the web server

# Request SSL Certificates (ensure port 80 is open)
sudo certbot certonly --standalone -d web.beshinegroup.com
# After receiving SSL cert, ensure they can be accessed
# Certificates should be renewed automatically

# Others please refer to development CLI
```

Useful links:

- https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-up-node-on-ec2-instance.html
- https://gist.github.com/clodal/f19fc9f57e9c419f523164a145777d69
