var http = require('http'),
    path = require('path'),
    url = require('url'),
    fs = require('fs'),
    restarted = true;

http.createServer(function(req, res){

    if(req.url == "/auto-update") {
        
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive'
        });
        if(restarted) res.write('data: hi\nretry:0\n\n');
        restarted = false;
        return;
    }

    var pathname = url.parse(req.url).pathname,
        filename = path.join(process.cwd(), pathname);

    fs.exists(filename, function(exists) {
        var type;

        if(!exists || fs.lstatSync(filename).isDirectory()) {
            filename = path.join(process.cwd(), 'index.html');
        }

        switch(path.extname(filename)) {
            case '.css': type = 'text/css'; break;
            case '.html': type = 'text/html'; break;
            case '.htm': type = 'text/html'; break;
            case '.png': type = 'image/png'; break;
            case '.pdf': type = 'application/pdf'; break;
            case '.rar': type = 'application/x-rar-compressed'; break;
            case '.zip': type = 'application/zip'; break;
            case '.jpg': type = 'image/jpeg'; break;
            case '.ico': type = 'image/x-icon'; break;
            case '.js': type = 'application/javascript'; break;
            default: type = 'text/html'; break;
        }

        fs.readFile(filename, 'binary', function(err, file) {
            if(err) {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.write(err + '\n');
                res.end();
                return;
            }

            res.writeHead(200, {'Content-Type': type});
            res.write(file, 'binary');
            res.end();
        });
    });

}).listen(8000);