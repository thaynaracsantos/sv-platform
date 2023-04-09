import Link from '@/components/Link'
import { PageSEO } from '@/components/SEO'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { getAllFilesFrontMatter } from '@/lib/mdx'

import { useState, useEffect } from 'react';

import Web3Modal from 'web3modal';

const contractAddress = '0x44E7477B4D6ff1CC8ee18677021FE11591399dAD'; 
const url = 'https://polygon-mumbai.g.alchemy.com/v2/9nTsL13BqFT3QTlnN8SlTQMt2PvQQnYv';
const SVForumJSON = require('./contracts/SVForum.json'); 
const Web3 = require('web3');
const web3 = new Web3(url);

export async function getStaticProps() {
  const posts = await getAllFilesFrontMatter('blog')

return { props: { posts } }
}

export default function Home({ posts }) {
  const [postDataArray, setPostDataArray] = useState([]); // state control
  const [isOpen, setIsOpen] = useState(false);

  const getAllPosts = async () => {
    const contract = new web3.eth.Contract(SVForumJSON.abi, contractAddress);
  
    const page = 1;
    const perPage = 5;
    const posts = await contract.methods.getAllPosts(page, perPage).call();

    const numPosts = posts.length;
    const postDataArray = [];

    for (let i = 0; i < numPosts; i++) {
      const post = posts[i];
      if(!post.title.includes('teste')){
        const comments = await contract.methods.getPostComments(post.id).call();
        const postData = {
          id: post.id,
          title: post.title,
          description: post.description,
          user: post.user,
          numLikes: post.numLikes,
          timestamp: post.timestamp,
          tags: post.tags,
          comments: comments
        };
        postDataArray.push(postData);
      }
    }
  
    setPostDataArray(postDataArray);
    console.log(postDataArray);
  }

  function formatTime(timestamp) {
    const date = new Date(timestamp * 1000);
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      timeZone: 'America/Sao_Paulo' 
    };
    const formattedTime = date.toLocaleDateString('pt-BR', options);
    return formattedTime;
  }

  const handleLikeClick = async (id) => {
    event.preventDefault();

    const web3Modal = new Web3Modal({
      network: "mumbai",
      cacheProvider: true,
    });
    
    web3Modal.connect()
      .then((provider) => {
        web3.eth.setProvider(provider);

        const contract = new web3.eth.Contract(SVForumJSON.abi, contractAddress);     

        const account = provider.selectedAddress;        
        const postId = id;

        contract.methods.registerLike(postId).send({ from: account, gas: 3000000 })
        .then((receipt) => {
          console.log(receipt)
        })
        .catch((error) => {
          console.log(error)
          alert('Você já deu o seu apoio.');
        });
      })
      .catch((error) => {
        console.log("error");
        console.log(error); // Handle any errors
    });
  };  

  const handleNewComment = async (postId) => {
    event.preventDefault();

    const comment = event.target.querySelector('#comment').value;

    await createComment(postId, comment);
  }

  const createComment = async (postId, comment) => {
    const web3Modal = new Web3Modal({
      network: "mumbai",
      cacheProvider: true,
    });

    web3Modal.connect()
        .then((provider) => {
            web3.eth.setProvider(provider);

            const contract = new web3.eth.Contract(SVForumJSON.abi, contractAddress);  

            const account = provider.selectedAddress;

            contract.methods.registerComment(postId, comment).send({ from: account, gas: 3000000 });        
        });
  }

  useEffect(() => {
    getAllPosts();
  })

  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };
  

  return (
    <>
      <PageSEO title={siteMetadata.title} description={siteMetadata.description} />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-pink-900 dark:text-pink-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Desabafos
          </h1>
          <p className="text-lg leading-7 text-pink-500 dark:text-pink-400">
            {siteMetadata.description}
          </p>
        </div>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {!postDataArray.length && 'Nenhum post encontrado.'}
          {postDataArray.map((postData) => {
            const { id, timestamp,  title, description, user, numLikes, tags, comments} = postData
            return (
              <li key={id} className="py-12">
                <article>
                  <div className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
                    <dl>
                      <dt className="sr-only">Publicado Em</dt>
                      <dd className="text-base font-medium leading-6 text-pink-500 dark:text-pink-400">
                        <time dateTime={timestamp}>{formatTime(timestamp)}</time>
                      </dd>
                    </dl>
                    <div className="space-y-5 xl:col-span-3">
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-2xl font-bold leading-8 tracking-tight">
                            <Link
                              href={`/blog/1`}
                              className="text-pink-900 dark:text-pink-100"
                            >
                              {title}
                            </Link>
                          </h2>
                          <div className="flex flex-wrap text-purple-600">
                            <Tag key={tags} text={tags} />
                          </div>
                        </div>
                        <div className="prose max-w-none text-pink-500 dark:text-pink-400">
                          {description}
                        </div>
                      </div>
                      <div>
                        <a href="" onClick={() => {handleLikeClick(id);}}>
                          <img src="/static/images/solidariedade.png" alt="Solidariedade" width="25" height="25"/>+{numLikes}
                        </a>   
                      </div>   

                      <div className="w-full">

                        <div className="w-full">
                          <button
                            className="w-full text-black text-left py-2 px-4 bg-pink-200 hover:bg-pink-300 rounded-t focus:outline-none"
                            onClick={toggleCollapse}
                          >
                            Ver comentários
                          </button>
                          {isOpen && (
                          <div className="border-2 border-t-0 rounded-b p-4">
                            <form onSubmit={() => {handleNewComment(id);}}>
                              <label htmlFor="comment" className="sr-only">
                                Comentário
                              </label>
                              <textarea
                                id="comment"
                                name="comment"
                                rows="3"
                                className="w-full px-3 py-2 text-gray-700 border rounded focus:outline-none"
                                placeholder="Escreva seu comentário"
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
                              {
                              comments.map((comment) => (
                                <li key={comment.id}>
                                  <div className="border rounded px-1 py-2">{comment.text}</div>
                                </li>
                              ))}
                            </ul>
                          </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
};
