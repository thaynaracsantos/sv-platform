import Link from '@/components/Link'
import { PageSEO } from '@/components/SEO'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { getAllFilesFrontMatter } from '@/lib/mdx'

import { useState, useEffect } from 'react';

const ContractKit = require('@celo/contractkit');
const contractAddress = '0xED3F33dD0401831955abFc828E6dBF09F400C54A'; 
const SVForumJSON = require('./contracts/SVForum.json'); 

import Web3Modal from 'web3modal';
import Web3 from 'web3';
import { bufferToHex } from 'ethereumjs-util';

export async function getStaticProps() {
  const posts = await getAllFilesFrontMatter('blog')

  return { props: { posts } }
}

export default function Home({ posts }) {

  const [postDataArray, setPostDataArray] = useState([]);

  const getAllPosts = async () => {
    const kit = ContractKit.newKit('https://alfajores-forno.celo-testnet.org');
    const contract = new kit.web3.eth.Contract(SVForumJSON.abi, contractAddress);
  
    const numPosts = await contract.methods.numPosts().call();
    const postDataArray = [];
  
    for (let i = 0; i < numPosts; i++) {
      const post = await contract.methods.posts(i).call();
      const postData = {
        id: post.id,
        title: post.title,
        description: post.description,
        user: post.user,
        numLikes: post.numLikes,
        timestamp: post.timestamp,
        tags: post.tags.split("-")
      };
      postDataArray.push(postData);
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

  const handleLikeClick = async (event) => {
    event.preventDefault();

    const web3Modal = new Web3Modal({
      network: "celo", // Use the Celo Alfajores testnet
      cacheProvider: true,
    });
    
    console.log("web3Modal"); 
    console.log(web3Modal); // Check if the web3Modal object is initialized
    
    const kit = ContractKit.newKit('https://alfajores-forno.celo-testnet.org'); // Use the URL of the Celo Alfajores testnet
    
    web3Modal.connect()
      .then((provider) => {
        console.log("provider"); 
        console.log(provider); // Print the provider object

        kit.web3.eth.setProvider(provider);

        const contract = new kit.web3.eth.Contract(SVForumJSON.abi, contractAddress);        

        const account = provider.selectedAddress;

        console.log(account);
    
        const postId = 0;
        contract.methods.registerLike(postId).send({ from: account, gas: 3000000 });

      })
      .catch((error) => {
        console.error("error");
        console.error(error); // Handle any errors
      }); 
  };

  useEffect(() => {
    getAllPosts();
  })

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
            const { id, timestamp,  title, description, user, numLikes, tags} = postData
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
                            {tags.map((tag) => (
                              <Tag key={tag} text={tag} />
                            ))}
                          </div>
                        </div>
                        <div className="prose max-w-none text-pink-500 dark:text-pink-400">
                          {description}
                        </div>
                      </div>
                      <div>
                        <a href="" onClick={handleLikeClick}>
                          <img src="/static/images/solidariedade.png" alt="Solidariedade" width="25" height="25"/>+{numLikes}
                        </a>   
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
}
