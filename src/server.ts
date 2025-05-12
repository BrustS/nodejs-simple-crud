import * as http from 'http';
import * as dotenv from 'dotenv';
import process from 'process';

dotenv.config();

const port = parseInt(process.env.PORT || '4000', 10);

const requestListener = function (req: http.IncomingMessage, res: http.ServerResponse) {
    const url = new URL(req.url || '', `http://localhost:${port}`);
    const path = url.pathname;
    const method = req.method;

    res.setHeader('Content-Type', 'application/json');
};

const server = http.createServer(requestListener);

server.listen(port, () => {
    console.log(`Server listening on port ${port} with process id ${process.pid}`);
});