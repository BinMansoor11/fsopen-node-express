const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();

// ============= Middleware ===============

// const requestLogger = (request, response, next) => {
//   console.log("Method:", request.method);
//   console.log("Path:", request.path);
//   console.log("body:", request.body);
//   console.log("-------------------");
//   next();
// };

const unknownEndpoint = (request, response, next) => {
  response.status(404).send({ error: "unknown endpoint" });
  next();
};

// ========================================

app.use(cors());
app.use(express.json());
// app.use(requestLogger);
app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      JSON.stringify(req.body, 2, null),
    ].join(" ");
  }),
);

app.use(express.static("dist"));

const generateId = () => {
  const maxId =
    notes.length > 0 ? Math.max(...notes.map((n) => Number(n.id))) : 0;

  return String(maxId + 1);
};

let notes = [
  {
    id: "1",
    content: "HTML is easy!!!",
    important: true,
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

app.get("/", (_request, response) => {
  response.send("<h1>Hello World</h1>");
});

app.get("/api/notes", (_request, response) => {
  response.json(notes);
});

app.get("/api/notes/:id", (request, response) => {
  const id = request.params.id;
  const note = notes.find((n) => n.id == id);
  if (note) {
    response.json(note);
  } else {
    response.statusMessage = "This note does not exist";
    response.status(404).end();
  }
});

app.delete("/api/notes/:id", (request, response) => {
  const id = request.params.id;
  notes = notes.filter((n) => n.id !== id);

  response.status(204).end();
});

app.post("/api/notes", (request, response) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({ error: "content missing" });
  }

  const note = {
    content: body.content,
    important: body.important || false,
    id: generateId(),
  };

  notes = notes.concat(note);

  response.json(note);
});

app.get("/api/info", (_request, response) => {
  response.send(
    `<div>
        <p>We have ${notes.length > 0 ? notes.length : 0} available</p>
        <p>${Date()}</p>
    </div>`,
  );
});

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
