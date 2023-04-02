import React, { useState } from 'react';
import ContainerCollapse from './ContainerCollapse';

function ViewComments({ onSubmitComment, onClick, comments }) {
  const [commentText, setCommentText] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const newComment = {
      id: comments.length + 1,
      text: commentText,
    };
    onSubmitComment(newComment);
    setCommentText('');
  };

  return (
    <>
      <ContainerCollapse title={'Ver comentários'}>
        <form onSubmit={handleSubmit}>
          <label htmlFor="comment" className="sr-only">
            Comentário
          </label>
          <textarea
            id="comment"
            name="comment"
            rows="3"
            className="w-full px-3 py-2 text-gray-700 border rounded focus:outline-none"
            placeholder="Escreva seu comentário"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            required
          ></textarea>
          <button
            type="submit"
            className="mb-4 px-4 py-2 mt-2 font-semibold text-white bg-pink-500 rounded hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all ease-in-out duration-300"
          >
            Enviar comentário
          </button>
        </form>

        <ul className="flex flex-col gap-2">
          {comments.map((comment) => (
            <li key={comment.id}>
              <div className="border rounded px-1 py-2">{comment.text}</div>
            </li>
          ))}
        </ul>
      </ContainerCollapse>
    </>
  );
}

export default ViewComments;
