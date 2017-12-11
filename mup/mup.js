module.exports = {
  servers: {
    snow3: {
      host: '52.65.76.144',
      "username": "ubuntu",
      "pem": "./awskeys.pem",
    }
  },

  meteor: {
    name: 'tpp',
    path: '../app',
    docker: {
      // image: 'abernix/meteord:node-8.4.0-base' ,
      image: 'meteord-xvfb',
      args: [
        '--link=mongodb:mongodb'
      ],
    },
    servers: {
      snow3: {}
    },
    buildOptions: {
      serverOnly: true,
    },
    env: {
      ROOT_URL: "https://tpp.ogecko.com",
      MONGO_URL: "mongodb://mongodb:27017/auto"
    },
    deployCheckWaitTime: 60,
    enableUploadProgressBar: true,
  },

  proxy: {
    domains: 'winedelta.com,www.ogecko.com,tpp.ogecko.com',
    ssl: {
      forceSSL: true,
      letsEncryptEmail: 'admin@ogecko.com'                // Enable let's encrypt to create free certificates
      },
    shared: {
      envLetsEncrypt: {
        clientUploadLimit: '10M',                         // Set proxy wide upload limit. Setting 0 will disable the limit.
        DEBUG: true
      }
    }
  },
};