module.exports = {
  apps: [
  {
    name   : "old-kind-root-app",
    script : "./server.js",
    args   : "7170"
  },
  {
    name   : "old-kind-files",
    script : "./files/main.js",
  },
  {
    name   : "old-kind-rooms",
    script : "./events/server.js",
  }
]
}
