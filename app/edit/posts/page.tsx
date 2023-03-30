'use client';

import styles from 'styles/editPosts.module.scss'
import db from "../../../lib/db";
import type { IPost, IPosts, IBlock, IBlocks } from '../../../types/index'
import LayoutAdmin from "../../../components/layoutAdmin";
import { useEffect, useState } from 'react';
import { getNewId } from '../../../lib/utils';
import Link from 'next/link';


export default function Posts() {

    const [posts, setPosts] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        (async () => {
            const data = await fetch('/api/posts').then(val => val.json())
            setPosts(data)
        })()
    }, []);


        
    const toArrAndSort = (rawPosts: IPosts) => Object.values(rawPosts).sort((a: { index: number; },b: { index: number; }) => (a.index > b.index) ? 1 : ((b.index > a.index) ? -1 : 0))

    const changeValue = (id: string, fieldName: string | number, newVal: any) => {
        setPosts((init: IPosts): IPosts => {
            const res: IPosts = {
                ...init,
            }
            console.log('---', res, id, res[id])
            res[id][fieldName] = newVal
            
            // change index on elements which index is bigger
            if(fieldName === 'index'){
                //increaseIndexes(res, id, newVal)
            }

            return res
        })
    }

    // const increaseIndexes = (posts: IPosts, id: string, index: number) => {
    //     Object.values(posts).map(post => {
    //         if(post.id !== id && post['index'] >= index){
    //             console.log(post.id !== id, post.id, id)
    //             post['index'] = parseInt(post['index']) + 1
    //         }
    //     })
    // }

    const getMaxPostIndex = () => {
        const sorted = toArrAndSort(posts)
        if(sorted.length === 0){
            return 1
        }
        return Math.ceil(sorted[sorted.length - 1]['index'])
    }

    const addPostBtn = () => {
        const newId = getNewId()
        const newPost: IPost = {
            id: newId,
            slug: 'slug',
            preview: 'preview',
            cover: 'cover',
            title: 'title',
            subTitle: 'subTitle',
            index: getMaxPostIndex() + 1,
            show: false,
            blocks: {}
        }
        setPosts((init: any) => ({
            ...init,
            [newId]: newPost
        }))
    }

    const onDelBtn = (id: string) => {
        if(confirm('delete?')){
            setPosts((init: any) => {
                const res = {...init}
                delete res[id]
                return {...res}
            })
        }
    }

    const saveBtn = async () => {
        setIsLoading(true)
        const res = await fetch('/api/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(posts)
        })
        let data = await res.json();

        setPosts(data)
        setIsLoading(false)
    }

    return (
        <LayoutAdmin>
            <div className={styles.wrap}>
                {isLoading ? 'Loading...' : <>
                    <div className={styles.posts}>
                        {toArrAndSort(posts).map(({ id, slug, preview, cover, title, subTitle, index, show }) => <div key={id} className={styles.oneCell}>
                            <Link className={styles.edit} href={`/edit/post/${id}`}>Edit</Link>
                            <input className={styles.show} type="checkbox" defaultChecked={show} onChange={e => changeValue(id, 'show', e.target.checked)} />
                            <input className={styles.index} placeholder='Index' type="text" value={index} onChange={e => changeValue(id, 'index', parseInt(e.target.value))} />
                            <input className={styles.slug} placeholder='Slug' type="text" value={slug} onChange={e => changeValue(id, 'slug', e.target.value)} />
                            <input className={styles.preview} placeholder='Preview' type="text" value={preview} onChange={e => changeValue(id, 'preview', e.target.value)} />
                            <input className={styles.cover} placeholder='Cover' type="text" value={cover} onChange={e => changeValue(id, 'cover', e.target.value)} />
                            <input className={styles.title} placeholder='Title' type="text" value={title} onChange={e => changeValue(id, 'title', e.target.value)} />
                            <input className={styles.subTitle} placeholder='SubTitle' type="text" value={subTitle} onChange={e => changeValue(id, 'subTitle', e.target.value)} />
                            <div className={styles.del} onClick={() => onDelBtn(id)}>del</div>
                        </div>)}
                    </div>
                    <div className={styles.btns}>
                        <div className={styles.add} onClick={addPostBtn}>Add post</div>
                        <div className={styles.save} onClick={saveBtn}>Save</div>
                    </div>
                </>}
            </div>
        </LayoutAdmin>
    );
}