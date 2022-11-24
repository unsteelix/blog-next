import { useEffect, useRef } from 'react';
import styles from 'styles/blocks/videoBlock.module.scss';
import constants from '../../lib/constants';

export default function VideoBlock({data}: {data: any}) {

    const parseData = (str: string) => {
        let options: any[] = []
        let video: string = ''

        str.split('\n').forEach(el => {
            if(el.includes('controls=true')) {
                options.push(el)
            } else if(el.includes('loop=false')) {
                options.push(el)
            } else if(el.includes('mute=false')) {
                options.push(el)
            } else if(el.includes('padding=')) {
                options.push(el)
            } else {
                if(el.trim().length > 0){
                    video = el.trim()
                }
            }
        })

        return {
            options,
            video
        }
    }

    const { video, options } = parseData(data)
    const videoRef: any = useRef(null);

    const command = (command: string) => {
        if(videoRef){
            if(command === 'play'){
                videoRef.current.play();
                console.log(`video-${video} play`)
            } else if (command === 'pause'){
                videoRef.current.pause();
                console.log(`video-${video} pause`)
            }
        }
    }

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                const intersecting = entry.isIntersecting;
                if(intersecting) {
                    command('play')
                } else {
                    command('pause')
                }
            })
        })

        if(document){
            const el = document.getElementById(`video-${video}`)
            if(el){
                observer.observe(el)
            }
        }

        return () => {};
    }, []);
    
    const { picolaUrl } = constants;
    const convertToUrl = (videoId: string) => picolaUrl + 'f/' + videoId

    let isMuted = true;
    const muteOption = options.find(o => o.includes('mute='));
    if(muteOption){
        const muteValue = muteOption.split('mute=')[1];
        if(muteValue && muteValue === 'false'){
            isMuted = false
        }
    }

    return (
        <div className={styles.wrap} id={`video-${video}`}>
            <video loop tabIndex={0} ref={videoRef} muted={isMuted} >
                <source src={convertToUrl(video)} itemType={'video/mp4'} />
            </video>
        </div>
    )
}
