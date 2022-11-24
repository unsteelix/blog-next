import Head from 'next/head'
import Layout from '../components/layout';
import ListPost from '../components/listPost';
import db from '../lib/db';
import type { IPosts } from '../types/index'

export function getStaticProps() {
  
  const posts: IPosts = db.posts

  return {
    props: {
      posts
    },
    revalidate: 60
  }
}

export default function Home(props: { posts: IPosts }) {
  const { posts } = props

  const list = Object.entries(posts).map((el: any) => ({
    id: el[0],
    ...el[1]
  }))

  return (
    <Layout home>
      <Head>
        <title>Unsteelix Blog</title>
      </Head>
      <ListPost posts={list} />
    </Layout>
  )
}
