import { useNavigate } from "react-router";
import { useField, useAnecdotes } from "../hooks";

const CreateNew = () => {
  const navigate = useNavigate();
  const { addAnecdote } = useAnecdotes();

  const content = useField();
  const author = useField();
  const info = useField();

  const resetFields = () => {
    content.reset();
    author.reset();
    info.reset();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addAnecdote({
      content: content.props.value,
      author: author.props.value,
      info: info.props.value,
      votes: 0,
    });
    navigate("/");
  };

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...content.props} />
        </div>
        <div>
          author
          <input {...author.props} />
        </div>
        <div>
          url for more info
          <input {...info.props} />
        </div>
        <button type="submit">create</button>
        <button type="reset" onClick={resetFields}>
          reset
        </button>
      </form>
    </div>
  );
};

export default CreateNew;
