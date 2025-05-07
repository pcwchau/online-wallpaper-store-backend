module.exports = {
  apps: [
    {
      name: "app1",
      script: "./src/app.js",
      env: {
        NODE_ENV: "production", // development | production
        AWS_REGION: "",
        AWS_ACCESS_KEY_ID: "",
        AWS_SECRET_ACCESS_KEY: "",
        S3_BUCKET_NAME: "",
        WEB_SERVER_PORT: "",
      },
    },
  ],
};
