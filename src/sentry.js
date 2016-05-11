import nconf from 'nconf';
import raven from 'raven';


let client = {
  captureError: (err, options) => {
    if (options.tags && options.tags.source && !err.source) err.source = options.tags.source;
    console.error(err.stack || err);
  }
};

if (nconf.get('NODE_ENV') === 'production' && nconf.get('SENTRY_DSN')) {
  console.log('Sentry Enabled');
  client = new raven.Client(nconf.get('SENTRY_DSN'));

  client.on('error', err => console.log(`Error: ${err.message}`));
  process.on('uncaughtException', err => {
    const exit = function() { process.exit(1); };
    const options = {
      level: 'fatal',
      source: 'main_process'
    };
    client.once('logged', exit);
    client.once('error', exit);
    client.captureError(err, options);
  });
}

export default function captureError(err, source) {
  const options = {
    tags: {source}
  };

  if (err.level) options.level = err.level;
  if (err.level && err.level === 'warning') return;

  client.captureError(err, options);
}
