module.exports = {
  apps: [
    {
      name: "app1",
      script: "./server.js",
      env: {
        NODE_ENV: "production", // development | production
        AWS_REGION: "",
        AWS_ACCESS_KEY_ID: "",
        AWS_SECRET_ACCESS_KEY: "",
        S3_BUCKET_NAME: "",
        WEB_SERVER_PORT: "",
        MYSQL_HOST: "",
        MYSQL_PORT: "",
        MYSQL_USER: "",
        MYSQL_PW: "",
        MYSQL_DB_NAME: "",
      },
    },
  ],
};
