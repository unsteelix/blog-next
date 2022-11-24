import { useEffect } from 'react';
import styles from 'styles/blocks/audioBlock.module.scss';

export default function AudioBlock({data, onAudioHandle}: {data: any, onAudioHandle: any}) {

    const parseData = (str: string) => {
        let options: any[] = []
        let audio: string = ''

        str.split('\n').forEach(el => {
            if(el.includes('end=true')) {
                options.push(el)
            } else if(el.includes('controls=true')) {
                options.push(el)
            } else if(el.includes('loop=true')) {
                options.push(el)
            } else if(el.includes('autoplay=false')) {
                options.push(el)
            } else if(el.includes('show=true')) {
                options.push(el)
            } else {
                if(el.trim().length > 0){
                    audio = el.trim()
                }
            }
        })

        return {
            options,
            audio
        }
    }

    const { audio, options } = parseData(data)
    let isStart = true;

    if(options.find(opt => opt.includes('end=true'))){
        isStart = false
    }

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                const intersecting = entry.isIntersecting;
                if(intersecting) {
                    if(isStart){
                        // turn on
                        onAudioHandle(audio, 'play')
                    } else {
                        // turn off
                        onAudioHandle(audio, 'pause')
                    }
                }
            })
        })

        if(document){
            const el = document.getElementById(`audio-${audio}-${isStart ? 'isStart' : 'isEND'}`)
            if(el){
                observer.observe(el)
            }
        }

        return () => {};
    }, []);
    
    const isShow = options.find(e => e.includes('show=true')) ? true : false

    return (
        <div className={styles.wrap} style={{visibility: isShow ? 'visible' : 'hidden'}} id={`audio-${audio}-${isStart ? 'isStart' : 'isEND'}`}>
            {isStart ? '[Audio]' : '[End audio]'}
        </div>
    )
}
