import React, { useEffect, useState } from "react";
import api from './services/api'

import "./styles.css";

interface Repository {
  id: string,
  title: string,
  url: string,
  techs: string | Array<string>,
  likes: number
}

function App() {
  const [repositories, setRepositories] = useState<Repository[]>([])

  useEffect(() => {
    api.get("/repositories").then(response => setRepositories(response.data))
  }, [])

  async function handleAddRepository() {
    const response = await api.post("/repositories", {
      title: "Projeto com ReactJs",
      url: "github.com",
      techs: ["Node", "Java"]
    })

    setRepositories([...repositories, response.data])
  }

  async function handleRemoveRepository(id: string) {
    await api.delete(`/repositories/${id}`)
    setRepositories(repositories.filter(repository => repository.id !== id))
  }

  return (
    <div>
      <ul data-testid="repository-list">
        {repositories.map(repository => {
          return (
            <li key={repository.id}>
              {repository.title}
              <button onClick={() => handleRemoveRepository(repository.id)}>
                Remover
              </button>
            </li>
          )
        })}
      </ul>

      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;