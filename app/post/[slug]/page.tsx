import { Suspense } from 'react'

import Head from 'next/head'
import Layout from "../../../components/layout";
import db from "../../../lib/db";
import type { IPost, IPosts, IBlock } from '../../../types/index';
import styles from 'styles/post.module.scss';
import Image from 'next/image'

import constants from '../../../lib/constants';
import { useContext } from "react";
import { AppContext } from "../../../context";
import { headers } from 'next/headers';
import Blocks from '../../../components/blocks';

const { picolaUrl, imageMainFormat, imageMainQuality } = constants;

export const revalidate = 5;

export async function generateStaticParams() {
    

    const posts: IPosts = db.posts

    //const res = await fetch(`http://127.0.0.1:3000/api/posts`);
    //const posts: IPosts = await res.json();
  
    return Object.values(posts).map((post) => ({
      slug: post.slug,
    }));
}



async function getData(slug: string) {

    const posts: IPosts = db.posts
    //const res = await fetch(`http://127.0.0.1:3000/api/posts`);
    //const posts: IPosts = await res.json();

    const postData: IPost | undefined = Object.values(posts).find((p: IPost) => p.slug === slug)
    return postData
  }




export default async function Post({ params }: { params: { slug: string } }) {

    const { slug } = params;
    const postData: IPost | undefined = await getData(slug);

    if(!postData){
        return 'Post not found'
    }

    const { title, subTitle, cover, blocks } = postData;

    const listBlocks: IBlock[] = Object.values(blocks)
    const sorted = listBlocks.sort((a,b) => (a.index > b.index) ? 1 : ((b.index > a.index) ? -1 : 0))


    //const convertToUrl = (imgId: string) => `${picolaUrl}i/${imgId}?f=${imageMainFormat}&q=${imageMainQuality}&w=${dimensions.w}&h=${dimensions.h}`;
    const convertToUrl = (imgId: string) => `${picolaUrl}i/${imgId}?f=${imageMainFormat}&w=${1920}&h=${1080}`;



    return (
        <Layout home={false}>
            <Head>
                <title>{postData.title}</title>
            </Head>
            <div className={styles.wrap}>
                <div className={styles.cover}>
                    {/* <img src={convertToUrl(cover)} alt={cover} /> */}
                    <Image
                        src={convertToUrl(cover)}
                        alt={title}
                        width={1920}
                        height={1080}
                        object-fit="cover"
                        quality={100}
                    />
                    <div className={styles.title}>{title}</div>
                    <div className={styles.subTitle}>{subTitle}</div>
                </div>

                {/* Blocks */}
                <Suspense fallback={<div>LOADING..........</div>}>
                    <Blocks data={sorted} />
                </Suspense>

            </div>
        </Layout>
    );
}