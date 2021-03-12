const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.find((user) => user.username === username);

  if (!user) {
    return response.status(400).json({
      error: "User not found!",
    });
  }

  request.user = user;

  return next();
}

app.post("/users", (request, response) => {
  const { name, username } = request.body;

  const userAlreadyExists = users.some((user) => user.username == username);

  if (userAlreadyExists) {
    return response.status(400).json({
      error: "User already exists!",
    });
  }

  const userInformation = {
    id: uuidv4(),
    name,
    username,
    todos: [],
  };

  users.push(userInformation);

  return response.status(201).json({
    message: "Successfully Inserted!",
  });
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  const { user } = request;

  return response.json(user.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;

  const newToDo = {
    id: uuidv4(),
    title,
    deadline: new Date(deadline),
    created_at: new Date(),
  };

  user.todos.push(newToDo);

  return response.status(201).json({
    message: "Successfully insert ToDo!",
  });
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;
  const { title, deadline } = request.body;

  const todosUser = user.todos;

  const checkExistisTodo = todosUser.find((todo) => todo.id === id);

  todosUser.find((todo) => {
    if (todo.id === id) {
      todo.title = title;
      todo.deadline = new Date(deadline);
    }
  });

  console.log(checkExistisTodo);
  if (!checkExistisTodo) {
    return response.status(400).json({
      error: "ToDo not exists!",
    });
  }

  return response.status(201).json({
    message: "Successfully update ToDo!",
  });
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;
