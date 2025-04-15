export const apps = [
  {
    name: "app1",
    script: "./app.js",
    env_production: {
      NODE_ENV: "production",
      AWS_REGION: "us-east-1",
      AWS_ACCESS_KEY_ID: "AKIA2TGJPDSD6HDMOM4T",
      AWS_SECRET_ACCESS_KEY: "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",
      S3_BUCKET_NAME: "beshine",
      WEB_SERVER_PORT: "3001",
    },
    env_development: {
      NODE_ENV: "development",
      AWS_REGION: "us-east-1",
      AWS_ACCESS_KEY_ID: "AKIA2TGJPDSD6HDMOM4T",
      AWS_SECRET_ACCESS_KEY: "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",
      S3_BUCKET_NAME: "beshine",
      WEB_SERVER_PORT: "3001",
    },
  },
];
