const express = require("express");
const cors = require("cors");

 const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs} = request.body;
  const repository ={
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  let { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id )

  if(repositoryIndex < 0){
    return response.status(400).json({
      error: 'Não foi possível encontrar o registro.'
    });
  }
  if(!title){
    title = repositories[repositoryIndex].title;
  }
  if(!techs){
    techs=repositories[repositoryIndex].techs;
  }
  if(!url){
    url=repositories[repositoryIndex].url;
  }
    likes=repositories[repositoryIndex].likes;
  
  //verifica dados se o dado passado for nulo ele adiciona o mesmo que ja esta cadastrado no repository
  //senão usa o do que foi passado pra atualizar
  const repository = {
    id ,
    title ,
    url,
    techs,
    likes,
  };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id )

  if(repositoryIndex < 0){
    return response.status(400).json({
      error: 'Não foi possível encontrar o registro.'
    });
  }

  repositories.splice(repositoryIndex, 1)

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repository = repositories.find(repository => repository.id ===id);

  if(!repository){
    return response.status(400).send();
  }

  repository.likes ++;
  return response.json(repository);

});

module.exports = app;
