import Link from '@/components/Link'
import { PageSEO } from '@/components/SEO'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import kebabCase from '@/lib/utils/kebabCase'

const contractAddress = '0x44E7477B4D6ff1CC8ee18677021FE11591399dAD'; 
const url = 'https://polygon-mumbai.g.alchemy.com/v2/9nTsL13BqFT3QTlnN8SlTQMt2PvQQnYv';
const SVForumJSON = require('./contracts/SVForum.json'); 
const Web3 = require('web3');
const web3 = new Web3(url);

export async function getStaticProps() {
  var contract = new web3.eth.Contract(SVForumJSON.abi, contractAddress);

	const numPosts = await contract.methods.numPosts().call();
	let tags = {}

	for (let i = 0; i < numPosts; i++) {
	  const post = await contract.methods.posts(i).call();	  
    if(post.tags in tags){
      tags[post.tags] += 1;
    }
    else {
      tags[post.tags] = 1;
    }
    
	}

  return { props: { tags } }
}

export default function Tags({ tags }) {
  const sortedTags = Object.keys(tags).sort((a, b) => tags[b] - tags[a])
  return (
    <>
      <PageSEO title={`Tags - ${siteMetadata.author}`} description="Things I blog about" />
      <div className="flex flex-col items-start justify-start divide-y divide-gray-200 dark:divide-gray-700 md:mt-24 md:flex-row md:items-center md:justify-center md:space-x-6 md:divide-y-0">
        <div className="space-x-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-pink-900 dark:text-pink-100 sm:text-4xl sm:leading-10 md:border-r-2 md:px-6 md:text-6xl md:leading-14">
            Tags
          </h1>
        </div>
        <div className="flex max-w-lg flex-wrap">
          {Object.keys(tags).length === 0 && 'No tags found.'}
          {sortedTags.map((t) => {
            return (
              <div key={t} className="mt-2 mb-2 mr-5">
                <Tag text={t} />
                <Link
                  href={`/tags/${kebabCase(t)}`}
                  className="-ml-2 text-sm font-semibold uppercase text-pink-600 dark:text-pink-300"
                >
                  {` (${tags[t]})`}
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
