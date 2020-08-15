const env = {
  AWS_REGION: 'local',
  AWS_ACCESS_KEY: 'fake_key',
  RSS_FEED_URL: 'https://hnrss.org/newest?points=100',
};

process.env = {
  ...process.env,
  ...env,
};
