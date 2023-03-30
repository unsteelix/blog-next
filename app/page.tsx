import Layout from '../components/layout';
import ListPost from '../components/listPost';
import type { IPosts } from '../types/index'
import { headers } from 'next/headers';

async function getData() {

  const headersList = headers();
  const host = headersList.get('host');
  const http = host?.includes('localhost') ? 'http' : 'https';
  const domain = host?.includes('localhost') ? '127.0.0.1:3000' : 'localhost';

  const res = await fetch(`${http}://${domain}/api/posts`, { next: { revalidate: 5 } });
  //const res = await fetch(`http://127.0.0.1:3000/api/posts`, { cache: 'no-store' });
  const posts = await res.json();

  return posts
}

export default async function Page() {
  const posts: IPosts = await getData()

  const list = Object.entries(posts).map((el: any) => ({
    id: el[0],
    ...el[1]
  }))

  return (
    <Layout home>
      <ListPost posts={list} />
    </Layout>  
  )
}
