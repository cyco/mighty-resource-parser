const Path = require('path');

module.exports = {
  devServer: {
    before(app, server) {
     app.use((req, res, next) => {
        if (req.path.endsWith("@rsrc-fork")) {
            const path = req.path.substring(0, req.path.length - 10);
            const fullPath = Path.resolve(Path.join(Path.resolve("./src"), path));
            const allowedPath = Path.resolve("./src");
            if(fullPath.indexOf(allowedPath) === 0) {
                res.sendFile(fullPath + "/..namedfork/rsrc");
                return;
            }
        }
        next();
     })
    }
  }
};
