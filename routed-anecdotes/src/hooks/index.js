import { useState, useEffect } from "react";
import anecdotesService from "../services/anecdotes";

export const useField = (type = "text") => {
  const [value, setValue] = useState("");

  const onChange = (event) => {
    setValue(event.target.value);
  };

  const reset = () => {
    setValue("");
  };

  const props = {
    type,
    value,
    onChange,
  };

  return {
    props,
    reset,
  };
};

export const useAnecdotes = () => {
  const [anecdotes, setAnecdotes] = useState([]);

  const fetchAnecdotes = async () => {
    const data = await anecdotesService.getAll();
    setAnecdotes(data);
  };

  useEffect(() => {
    const fetchAnecdotes = async () => {
      const data = await anecdotesService.getAll();
      setAnecdotes(data);
    };

    fetchAnecdotes();
  }, []);

  const addAnecdote = async (anecdote) => {
    const createdAnecdote = await anecdotesService.createNew(anecdote);

    setAnecdotes((currentAnecdotes) =>
      currentAnecdotes.concat(createdAnecdote),
    );
  };

  const deleteAnecdote = async (id) => {
    await anecdotesService.deleteAnecdote(id);

    setAnecdotes((currentAnecdotes) =>
      currentAnecdotes.filter((anecdote) => anecdote.id !== id),
    );
  };

  return {
    anecdotes,
    fetchAnecdotes,
    addAnecdote,
    deleteAnecdote,
  };
};
