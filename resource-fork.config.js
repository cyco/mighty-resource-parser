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

            if (fullPath.indexOf(allowedPath) !== 0) {
              return;
            }

            let resourcePath = fullPath + '/..namedfork/rsrc';
            if (FS.existsSync(resourcePath)) {
              res.sendFile(resourcePath);
              return;
            }

            const basename = '';
            const filename = '';
            resourcePath = basename + '/._' + filename;
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
