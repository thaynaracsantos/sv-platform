import Link from '@/components/Link'
import { PageSEO } from '@/components/SEO'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import kebabCase from '@/lib/utils/kebabCase'

const ContractKit = require('@celo/contractkit');
const contractAddress = '0xED3F33dD0401831955abFc828E6dBF09F400C54A'; 
const SVForumJSON = require('./contracts/SVForum.json'); 

export async function getStaticProps() {
  const kit = ContractKit.newKit('https://alfajores-forno.celo-testnet.org');
	const contract = new kit.web3.eth.Contract(SVForumJSON.abi, contractAddress);

	const numPosts = await contract.methods.numPosts().call();
	let tags = {}

	for (let i = 0; i < numPosts; i++) {
	  const post = await contract.methods.posts(i).call();	  
    const postTags = post.tags.split("-");

    for (let j = 0; j < postTags.length; j++) {  
      tags[postTags[j]] = 1;
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
