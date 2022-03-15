import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import { v4 } from "uuid"

const app = express()

app.use(express.json())
app.use(cors())

interface Repositories {
  id: string,
  title: string,
  url: string,
  techs: string | Array<string>,
  likes: number,
}

const hasId = function (request: Request, response: Response, next: NextFunction) {
  const { id } = request.params

  if (id === null) {
    return response.status(400).json({ error: "Repositorie not found." })
  }

  next()
}

const repositories: Repositories[] = []

// List repo's
app.get('/repositories', (request, response) => {
  response.json(repositories)
})

// Create repo
app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body

  const repositorie = {
    id: v4(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repositorie)

  response.json(repositorie)
})

// Update repo
app.put("/repositories/:id", hasId, (request, response) => {
  const { id } = request.params

  const { title, url, techs } = request.body

  const repositorieToUpdate = repositories.findIndex(repositorie => repositorie.id === id)

  if (repositorieToUpdate < 0) {
    return response.status(400).json({ error: "Repositorie not found." })
  }

  // Get the likes
  const { likes } = repositories[repositorieToUpdate]

  const repositorie = {
    id,
    title,
    url,
    techs,
    likes
  }

  repositories[repositorieToUpdate] = repositorie

  return response.json(repositorie)
})

// Delete repo
app.delete('/repositories/:id', hasId, (request, response) => {
  const { id } = request.params

  const repositorieToDelete = repositories.findIndex(repositorie => repositorie.id === id)

  if (repositorieToDelete < 0) {
    return response.status(400).json({ error: "Repositorie not found." })
  }

  repositories.splice(repositorieToDelete, 1)

  return response.status(204).json({})
})

// Update like
app.post("/repositories/:id/like", hasId, (request, response) => {
  const { id } = request.params

  const repositorieToLike = repositories.findIndex(repositorie => repositorie.id === id)

  if (repositorieToLike < 0) {
    return response.status(400).json({ error: "Repositorie not found." })
  }

  repositories[repositorieToLike].likes += 1

  return response.status(200).json(repositories[repositorieToLike])
})

export default app