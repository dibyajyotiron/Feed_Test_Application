const logLocation = (env) => {
    const output = `./logs/${env}/output.log`;
    const error = `./logs/${env}/error.log`;
    return { output, error }
  }
  
  function returnCommonConfig(appName, NODE_ENV, logLocation) {
    return {
      name: appName,
      script: './app.js',
      args: 'one two',
      instances: 1,
      watch: true,
      ignore_watch: ['node_modules', 'logs'],
      env: {
        NODE_ENV,
      },
      log_date_format: "ddd, DD-MMM-YYYY, hh:mm:ss A UTCZ",
      output: logLocation.output,
      error: logLocation.error,
    }
  }
  
  module.exports = {
    apps: [
      { ...returnCommonConfig('feed_prod', 'production', logLocation('production')) },
    //   { ...returnCommonConfig('feed_stage', 'development', logLocation('development')) },
      { ...returnCommonConfig('local', 'localhost', logLocation('local')) }],
  
    // deploy: {
    //   production: {
    //     user: 'node',
    //     host: '212.83.163.1',
    //     ref: 'origin/master',
    //     repo: 'git@github.com:repo.git',
    //     path: '/var/www/production',
    //     'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production'
    //   }
    // }
  };
  