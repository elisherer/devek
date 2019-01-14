/* eslint-disable */
const path = require('path');
const localConfig = require('./deploy.config.json');
const FtpDeploy = require('ftp-deploy');
const ftpDeploy = new FtpDeploy();

const config = Object.assign({}, localConfig, {
  localRoot: path.join(__dirname, 'dist'),
  include: ['*'],
  deleteRemote: true, // delete existing files at destination before uploading
  forcePasv: true, // Passive mode is forced (EPSV command is not sent)
});

console.log('Deploying...');
ftpDeploy.deploy(config)
  .then(res => {
    console.log('Finished');
    console.log(res);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
  });
