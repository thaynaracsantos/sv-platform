import React from 'react';
import ContainerCollapse from './ContainerCollapse';

const comments = [
  { id: 1, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sodales laoreet ligula, vel fermentum magna pharetra a. Cras tristique neque in mi fringilla, a feugiat urna consequat.' },
  { id: 2, text: 'Força!' },
  { id: 3, text: 'Justiça!' },
];

function ViewComments() {
  return (
    <>
      <ContainerCollapse title={'Ver comentários'}>
        <ul className='flex flex-col gap-2'>
          {comments.map((comment) => (
            <li key={comment.id}>
              <div className='border rounded px-1 py-2'>
                <p>
                  {comment.text}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </ContainerCollapse>
    </>
  );
}

export default ViewComments;
