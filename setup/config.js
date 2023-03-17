const config = {};

config.project = {
  name: "kendo-react-nodejs-express"
};

// Admin privileges for MarkLogic setup
config.auth = {
  user: "admin",
  pass: "admin",
  sendImmediately: false
};

config.host = "localhost";

config.databases = {
  content: {
    name: config.project.name + "-content"
  },
  modules: {
    name: config.project.name + "-modules"
  },
};

config.rest = {
  "rest-api": {
    name: config.project.name + "-rest",
    database: config.databases.content.name,
    "modules-database": config.databases.modules.name,
    port: 8077,
    "error-format": "json"
  },
  security: {
    authentication: "basic"
  },
  // security: {
  //   authentication: "application-level", 
  //   "default-user": config.project.name + "-user"
  // },
  options: {
    name: "search-options",
    file: "search-options.xml"
  }
};

// NOTE XDBC server if needed
config.xdbc = {
  "server-name": config.project.name + "-xdbc",
  "server-type": "xdbc",
  "group-name": "Default",
  "content-database": config.databases.content.name,
  root: "/",
  port: 8006
};

config.user = {
  "user-name": config.project.name + "-user", 
  "password": "password",
  "role": [ "rest-admin", "rest-writer" ] 
}

config.content = [
  {
    collection: "product",
    path: "/data/products"
  }
];

config.modules = {
    path: "/data/modules"
};

config.pause = 10000; // ms to pause after server delete

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = config;
}