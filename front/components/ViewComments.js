import React, { useState } from 'react';
import ContainerCollapse from './ContainerCollapse';

function ViewComments({ onSubmitComment, onClick, comments }) {
  const [commentText, setCommentText] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newComment = {
      id: comments.length + 1,
      text: commentText,
    };
    try {
      await onSubmitComment(newComment);
      setCommentText('');
      setFeedbackMessage({ type: 'success', text: 'Comentário enviado com sucesso!' });
  
      // Remove feedback message after 2 seconds
      setTimeout(() => {
        setFeedbackMessage(null);
      }, 2000);
    } catch (error) {
      console.error(error);
      setFeedbackMessage({ type: 'error', text: 'Houve um erro ao enviar o comentário.' });
    }
  };
  

  const [feedbackMessage, setFeedbackMessage] = useState(null);

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

        {feedbackMessage && (
          <div
            className={`p-2 text-white ${
              feedbackMessage.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            } transition-opacity duration-300 ${
              feedbackMessage ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {feedbackMessage && feedbackMessage.text}
          </div>
        )}
      </ContainerCollapse>
    </>
  );
}

export default ViewComments;
