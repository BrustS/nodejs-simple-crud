import * as http from "http";
import * as dotenv from "dotenv";
import process from "process";
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "./controllers/users.controller";

dotenv.config();

const port = parseInt(process.env.PORT || "4000", 10);

const requestListener = function (
  req: http.IncomingMessage,
  res: http.ServerResponse
) {
  const url = new URL(req.url || "", `http://localhost:${port}`);
  const path = url.pathname;
  const method = req.method;

  res.setHeader("Content-Type", "application/json");

  if (path === "/api/users" && method === "GET") {
    res.statusCode = 200;
    res.end(JSON.stringify({ result: getUsers() }));
  } else if (path === "/api/users" && method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      const name = JSON.parse(body);
      const result = createUser(name);
      res.statusCode = result.status;
      result.status === 201
        ? res.end(JSON.stringify(result.data))
        : res.end(JSON.stringify({ error: result.message }));
    });
  } else if (path.startsWith("/api/users/")) {
    const id = path.split("/").pop() || "";
    if (method === "GET") {
      const findUser = getUser(id);
      res.statusCode = findUser.status;
      findUser.status === 200
        ? res.end(JSON.stringify(findUser.data))
        : res.end(JSON.stringify({ error: findUser.message }));
    } else if (method === "DELETE") {
      const deleted = deleteUser(id);
      res.statusCode = deleted.status;
      deleted.message
        ? res.end(JSON.stringify({ message: deleted.message }))
        : res.end();
    } else if (method === "PUT") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        const name = JSON.parse(body);
        const result = updateUser(id, name);
        res.statusCode = result.status;
        result.status === 200
          ? res.end(JSON.stringify(result.data))
          : res.end(JSON.stringify({ error: result.message }));
      });
    }
  }
};

const server = http.createServer(requestListener);

server.listen(port, () => {
  console.log(
    `Server listening on port ${port} with process id ${process.pid}`
  );
});
