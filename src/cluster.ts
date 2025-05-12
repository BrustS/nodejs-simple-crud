import cluster from 'node:cluster';
import * as http from 'http';
import { cpus } from 'os';
import process from 'process';
import * as dotenv from 'dotenv';

dotenv.config();

const numCPUs = cpus().length;
const port = parseInt(process.env.PORT || '4000', 10);

if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);

    for (let i = 0; i < numCPUs - 1; i++) {
        cluster.fork({ PORT: port + i + 1 });
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });

    let currentWorker = 0;
    const workerPorts = Array.from({ length: numCPUs - 1 }, (_, i) => port + i + 1);

    const loadBalancer = http.createServer((req, res) => {
        const workerPort = workerPorts[currentWorker % workerPorts.length];
        console.log(`Proxying to worker on port ${workerPort}`);

        const proxyReq = http.request({
            hostname: 'localhost',
            port: workerPort,
            path: req.url,
            method: req.method,
            headers: req.headers
        }, proxyRes => {
            res.writeHead(proxyRes.statusCode || 500, proxyRes.headers);
            proxyRes.pipe(res);
        });

        req.pipe(proxyReq);

        proxyReq.on('error', (error) => {
            console.error(`Proxy request error: ${error}`);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Proxy error');
        });

        currentWorker++;
    });

    loadBalancer.listen(port, () => {
        console.log(`Load balancer listening on port ${port}`);
    });
} else {
    const workerPort = parseInt(process.env.PORT || '4000', 10);
    import('./server')
        .then(module => {
            console.log(`Worker ${process.pid} started on port ${workerPort}`);
        })
        .catch(err => {
            console.error(`Worker ${process.pid} failed to start: ${err}`);
            process.exit(1);
        });
}

export function fork(arg0: { PORT: number; }) {
    throw new Error('Function not implemented.');
}


export function on(arg0: string, arg1: (worker: any, code: any, signal: any) => void) {
    throw new Error('Function not implemented.');
}
