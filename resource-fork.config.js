const Path = require('path');
const FS = require('fs');

module.exports = {
  devServer: {
    setupMiddlewares(middlewares, devServer) {
      middlewares.push({
        name: 'Serve resource fork',
        middleware: (req, res, next) => {
          if (req.path.endsWith('@rsrc-fork')) {
            const path = req.path.substring(0, req.path.length - 10);
            const fullPath = Path.resolve(Path.join(Path.resolve('./src'), path));
            const allowedPath = Path.resolve('./src');

            // Make sure the requested path is within the project directory
            if (fullPath.indexOf(allowedPath) !== 0) {
              return;
            }

            // Try to access resource fork via macOS naming convention
            let resourcePath = fullPath + '/..namedfork/rsrc';
            if (FS.existsSync(resourcePath)) {
              res.sendFile(resourcePath);
              return;
            }

            const components = fullPath.split('/');
            if (components.length <= 2) {
              return;
            }

            // Try accessing resource fork by prepending `._` to the filename
            const directory = components.slice(0, components.length - 2).join('/');
            const filename = components[components.length - 1];
            resourcePath = directory + '/._' + filename;
            if (FS.existsSync(resourcePath)) {
              res.sendFile(resourcePath);
              return;
            }
          }
          next();
        }
      });
      return middlewares;
    }
  }
};
