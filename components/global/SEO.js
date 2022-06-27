import Head from 'next/head'
import React from 'react'

export default function SEO({
  title = 'Log In',
  description = '',
  image = '',
  url = '',
}) {
  const attrs = [
    {
      name: 'title',
      content: title,
    },
    {
      name: 'description',
      content: description,
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      property: 'og:title',
      content: title,
    },
    {
      property: 'og:url',
      content: url,
    },
    {
      property: 'og:description',
      content: description,
    },
    {
      property: 'og:image',
      content: image,
    },
    {
      property: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      property: 'twitter:title',
      content: title,
    },
    {
      property: 'twitter:url',
      content: url,
    },
    {
      property: 'twitter:description',
      content: description,
    },
    {
      property: 'twitter:image',
      content: image,
    },
  ]

  console.log({ title })

  return (
    <Head>
      <title key="title">{title}</title>
      {attrs
        .filter((attr) => attr.content)
        .map((attr, idx) => (
          <meta key={idx} {...attr} />
        ))}
    </Head>
  )
}
