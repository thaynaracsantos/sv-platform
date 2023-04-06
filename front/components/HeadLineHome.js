import React from 'react'
import siteMetadata from '@/data/siteMetadata'

function HeadLineHome() {
  return (
    <div className="space-y-2 pt-6 pb-8 md:space-y-5">
      <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-pink-900 dark:text-pink-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
        Desabafos
      </h1>
      <p className="text-lg leading-7 text-pink-500 dark:text-pink-400">
        {siteMetadata.description}
      </p>
    </div>
  )
}

export default HeadLineHome