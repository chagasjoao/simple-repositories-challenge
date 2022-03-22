import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom"
import MockAdapter from "axios-mock-adapter";
import api from "../services/api";

import App from "../App";

const apiMock = new MockAdapter(api);

describe("App component", () => {
  it("should be able to add new repository", async () => {
    apiMock.onGet("repositories").reply(200, []);

    render(<App />);

    apiMock.onPost("repositories").reply(200, {
      id: "123",
      url: "https://github.com/josepholiveira",
      title: "Desafio ReactJS",
      techs: ["React", "Node.js"],
    });

    fireEvent.click(screen.getByText("Adicionar"));

    await screen.findByTestId('repository-list')

    expect(screen.getByTestId("repository-list")).toContainElement(screen.getByText("Desafio ReactJS"))
  });

  it("should be able to remove repository", async () => {
    apiMock.onGet("repositories").reply(200, [
      {
        id: "123",
        url: "https://github.com/josepholiveira",
        title: "Desafio ReactJS",
        techs: ["React", "Node.js"],
      },
    ]);

    render(<App />);

    await waitFor(() => {
      apiMock.onDelete("repositories/123").reply(204);
    })

    fireEvent.click(screen.getByText("Remover"));

    await waitFor(() => {
      expect(screen.getByTestId("repository-list")).toBeEmptyDOMElement()
    })
  });
});