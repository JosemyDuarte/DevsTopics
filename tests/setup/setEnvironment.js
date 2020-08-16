const env = {
  AWS_REGION: 'local',
  AWS_ACCESS_KEY: 'fake_key',
  RSS_FEED_URL: 'http://feeds.dzone.com/home',
};

process.env = {
  ...process.env,
  ...env,
};
