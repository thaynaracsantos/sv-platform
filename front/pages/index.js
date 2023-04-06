import HeadLineHome from '@/components/HeadLineHome'
import Link from '@/components/Link'
import Loading from '@/components/Loading'
import { PageSEO } from '@/components/SEO'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { getAllFilesFrontMatter } from '@/lib/mdx'

import { useState, useEffect } from 'react';

const ContractKit = require('@celo/contractkit');
const contractAddress = '0xE4Be9782DB96A9EE92114Ec5D0a3fE72AabDF949'; 
const SVForumJSON = require('./contracts/SVForum.json'); 

import Web3Modal from 'web3modal';

export async function getServerSideProps() {
  const posts = await getAllFilesFrontMatter('blog')
  return { props: { posts } }
}

export default function Home({ posts }) {
  const [postDataArray, setPostDataArray] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isCommentOpen, setIsCommentOpen] = useState({});


  const getAllPosts = async () => {
    const kit = ContractKit.newKit('https://alfajores-forno.celo-testnet.org');
    const contract = new kit.web3.eth.Contract(SVForumJSON.abi, contractAddress);
  
    const numPosts = await contract.methods.numPosts().call();
    const postDataArray = [];
  
    for (let i = 0; i < numPosts; i++) {
      const post = await contract.methods.posts(i).call();
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
    // console.log(postDataArray);
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

    // console.log(id);
    // const web3Modal = new Web3Modal({
    //   network: "celo", // Use the Celo Alfajores testnet
    //   cacheProvider: true,
    // });
    
    // console.log("web3Modal"); 
    // console.log(web3Modal); // Check if the web3Modal object is initialized
    
    const kit = ContractKit.newKit('https://alfajores-forno.celo-testnet.org'); // Use the URL of the Celo Alfajores testnet
    
    web3Modal.connect()
      .then((provider) => {
        // console.log("provider"); 
        // console.log(provider); // Print the provider object

        kit.web3.eth.setProvider(provider);

        const contract = new kit.web3.eth.Contract(SVForumJSON.abi, contractAddress);        

        const account = provider.selectedAddress;

        // console.log(account);    
        
        const postId = id;
        // console.log(postId);
        contract.methods.registerLike(postId).send({ from: account, gas: 3000000 });

      })
      .catch((error) => {
        // console.error("error");
        // console.error(error); // Handle any errors
    }); 
  };  

  const handleNewComment = async (event, postId) => {
    event.preventDefault();
    const comment = event.target.querySelector('#comment').value;
    await createComment(postId, comment);
  };

  const createComment = async (postId, comment) => {
    const web3Modal = new Web3Modal({
      network: "celo", // Use the Celo Alfajores testnet
      cacheProvider: true,
    });

    const kit = ContractKit.newKit('https://alfajores-forno.celo-testnet.org'); // Use the URL of the Celo Alfajores testnet

    web3Modal.connect()
        .then((provider) => {
            kit.web3.eth.setProvider(provider);

            const contract = new kit.web3.eth.Contract(SVForumJSON.abi, contractAddress);

            const account = provider.selectedAddress;

            // console.log('createComment');
            // console.log(postId);
            // console.log(comment);
            contract.methods.registerComment(postId, comment).send({ from: account, gas: 3000000 });        
        });
  }

  useEffect(() => {
    getAllPosts();
  })

  const toggleCollapse = (id) => {
    setIsCommentOpen((prevState) => ({ ...prevState, [id]: !prevState[id] }));
  };
  

  return (
    <>
      <PageSEO title={siteMetadata.title} description={siteMetadata.description} />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <HeadLineHome />
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {!postDataArray.length && (<Loading />)}
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
                            onClick={() => toggleCollapse(id)}
                          >
                            Ver comentários
                          </button>
                          {isCommentOpen[id] && (
                          <div className="border-2 border-t-0 rounded-b p-4">
                            <form onSubmit={(event) => {handleNewComment(event, id);}}>
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
