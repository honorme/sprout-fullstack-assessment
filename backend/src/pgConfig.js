function pgPoolOptions() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return { connectionString };
  }
  const local = /localhost|127\.0\.0\.1/.test(connectionString);
  const ssl = local ? undefined : { rejectUnauthorized: false };
  return { connectionString, ssl };
}

module.exports = { pgPoolOptions };
