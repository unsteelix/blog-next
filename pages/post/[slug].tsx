import Head from 'next/head'
import Layout from "../../components/layout";
import db from "../../lib/db";
import type { IPost, IPosts, IBlock } from '../../types/index';
import styles from 'styles/post.module.scss';
import TextBLock from '../../components/blocks/textBlock';
import dynamic from 'next/dynamic';
import AudioBLock from '../../components/blocks/audioBlock';
import VideoBLock from '../../components/blocks/videoBlock';
import { useEffect, useState } from 'react';
import constants from '../../lib/constants';
import { useContext } from "react";
import { AppContext } from "../../context";

const ImageBLock = dynamic(() => import('../../components/blocks/imageBlock'), {
  ssr: false,
})

const { picolaUrl, imageMainFormat, imageMainQuality } = constants;

// export async function getStaticPaths() {
//     const posts: IPosts = db.posts
//     const paths = Object.values(posts).map((post: IPost) => ({
//             params: {
//                 ...post
//             }
//     }))

//   return {
//     paths,
//     fallback: false,
//   };
// }

export async function getServerSideProps({ params, res }: any) {
    res.setHeader(
        'Cache-Control',
        'no-cache, no-store, max-age=0, must-revalidate'
    )
    
    const { slug } = params;
    const posts: IPosts = db.posts
    let postData: IPost | undefined = Object.values(posts).find((p: IPost) => p.slug === slug)

    return {
        props: {
            postData
        }
    };
}

export default function Post({ postData }: any) {
    const { state, setState }: any = useContext(AppContext);
    const { wasFirstInteraction } = state;
        
    const { title, subTitle, cover, blocks } = postData

    const listBlocks: IBlock[] = Object.values(blocks)
    const sorted = listBlocks.sort((a,b) => (a.index > b.index) ? 1 : ((b.index > a.index) ? -1 : 0))

    const RenderBlock = ({ id, type, data }: {id: string, type: string, data: any}) => {

        const map: any = {
            textBlock:  <TextBLock  key={'block-' + id} data={data} />,
            imageBlock: <ImageBLock key={'block-' + id} data={data} />,
            audioBlock: <AudioBLock key={'block-' + id} data={data} onAudioHandle={onAudioHandle} />,
            videoBlock: <VideoBLock key={'block-' + id} data={data} />
        }

        const [isShow, setIsShow] = useState(false)
        useEffect(() => {
            // set up observer
            if(document){
                const el = document.getElementById(`block-${id}`)
                if(el){                
                    const observer = new IntersectionObserver(entries => {
                        entries.forEach(entry => {
                            const intersecting = entry.isIntersecting;
                            if(intersecting) {
                                setIsShow(true)
                            }
                        })
                    })
                    observer.observe(el)
                }
            }

            return () => {};
        }, []);

        return <div id={`block-${id}`} className={`${styles.blockWrap} ${isShow ? styles.show : ''}`}>
            {map[type]}    
        </div>
    }

    const audio: any = {}

    /**
     * obj with all audio elements on this page
     * 
     */
    const renderAudio = () => {
        listBlocks.forEach(bl => {
            if(bl.type === 'audioBlock'){
                const audioId = bl.data.split('\n')[0].trim()
                const audioEl = new Audio(picolaUrl + 'f/' + audioId)
                audio[audioId] = audioEl
            }
        })
    }
    let popupIsRendered = false
    const renderAudioPopup = () => {
        popupIsRendered = true
    }

    const destroyAllAudio = () => {
        Object.values(audio).forEach((el: any) => el.pause())
    }
    
    const [dimensions, setDimensions] = useState({w: 0, h: 0})
    //const [isLoadingPage, setIsLoadingPage] = useState(true)

    useEffect(() => {
        if(document){
            const w = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
            const h = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

            // scrollbar width
            const bar = window.innerWidth - document.documentElement.clientWidth

            setDimensions({
                w: w - bar, h
            })

            //setIsLoadingPage(false)
        }
        checkForAudioContent()
        if(!popupIsRendered){
            renderAudioPopup()
        }
        renderAudio()        
        return () => {
            destroyAllAudio()
        };
    }, []);

    const onAudioHandle = (audioId: string, command: string) => {
        audio[audioId][command]()
        console.log('audio-' + audioId, command)
    }

    const convertToUrl = (imgId: string) => `${picolaUrl}i/${imgId}?f=${imageMainFormat}&q=${imageMainQuality}&w=${dimensions.w}&h=${dimensions.h}`;
    
    // render popup with audio content explanation
    const [haveAudio, setHaveAudio] = useState(false)
    const checkForAudioContent = () => {
        let haveAudio = false;

        sorted.forEach(({ type, data }) => {
            if(type === 'audioBlock'){
                haveAudio = true
            } else if(type === 'videoBlock') {
                if(data.includes('mute=false')){
                    haveAudio = true
                }
            }
        })

        if(haveAudio) {
            setHaveAudio(true)
        }  
    }

    return (
        <Layout home={false}>
            <Head>
                <title>{postData.title}</title>
            </Head>
            <div className={styles.wrap}>
                <div className={styles.cover}>
                    <img src={convertToUrl(cover)} alt={cover} />
                    <div className={styles.title}>{title}</div>
                    <div className={styles.subTitle}>{subTitle}</div>
                </div>
                <div className={styles.blocks}>
                    {sorted.map(({ id, type, data }) => RenderBlock({ id, type, data }))}
                </div>
                {(haveAudio && !wasFirstInteraction) && (
                    <div className={styles.popup}>
                        <div className={styles.popupText}>
                            В этом посте будет звук
                        </div>
                        <div className={styles.popupBtn} onClick={() => setState((state: any) => ({...state, wasFirstInteraction: true}))}>
                            Понятненько
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}