'use client';

import dynamic from 'next/dynamic'

import { useContext, useEffect, useState } from "react";
import styles from 'styles/blocks.module.scss';
import TextBLock from '../components/types/textBlock';
import AudioBLock from '../components/types/audioBlock';
import VideoBLock from '../components/types/videoBlock';
//import ImageBLock from '../components/types/imageBlock';
const ImageBLock = dynamic(() => import('../components/types/imageBlock'), { ssr: false })
import { picolaUrl } from "../lib/constants";
import { AppContext } from "../context";

export default function Blocks({ data } : { data: any[] }) {

    //const { state, setState }: any = useContext(AppContext);
    //const { wasFirstInteraction } = state;

    const [wasFirstInteraction, setWasFirstInteraction] = useState(false)

    // render popup with audio content explanation
    const [haveAudio, setHaveAudio] = useState(false)
    const checkForAudioContent = () => {
        let haveAudio = false;

        data.forEach(({ type, data }) => {
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
        data.forEach(bl => {
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

    return (<>
        <div className={styles.blocks}>
            {data.map(({ id, type, data }) => RenderBlock({ id, type, data }))}
        </div>
        {(haveAudio && !wasFirstInteraction) && (
            <div className={styles.popup}>
                <div className={styles.popupText}>
                    В этом посте будет звук
                </div>
                <div className={styles.popupBtn} onClick={() => setWasFirstInteraction(true)}>
                    Понятненько
                </div>
            </div>
        )}
    </>    
    )
}
