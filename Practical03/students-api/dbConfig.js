module.exports = {
  user: "booksai_user", // Replace with your SQL Server login username
  password: "ssd", // Replace with your SQL Server login password
  server: "localhost",
  database: "ssd_db",
  trustServerCertificate: true,
  options: {
    port: 1433, // Default SQL Server port
    connectionTimeout: 60000, // Connection timeout in milliseconds
  },
};