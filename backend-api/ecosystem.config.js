module.exports = {
  apps: [
    {
      name: "Litup",
      instances: 4,
      exec_mode: "cluster",
      script: "server.js",
      autorestart: true,
      watch: ".",
      watch_delay: 1000,
      ignore_watch: ["node_modules", ".git", "seeds", "*.md"],
    },
  ],
};
