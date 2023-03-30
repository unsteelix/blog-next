import { useState } from 'react';
import styles from 'styles/edit/types/videoBlock.module.scss';
import constants from '../../../lib/constants';



export default function VideoBlock({data, onChange}: {data: any, onChange: any}) {
    
    const parseInput = (str: string) => {
        let options: any[] = []
        let videos: any[] = []

        str.split('\n').forEach(el => {
            if(el.includes('controls=')) {
                options.push(el)
            } else if(el.includes('loop=')) {
                options.push(el)
            } else if(el.includes('mute=')) {
                options.push(el)
            } else if(el.includes('padding=')) {
                options.push(el)
            } else {
                if(el.trim().length > 0){
                    videos.push(el.trim())
                }
            }
        })

        return {
            options,
            videos
        }
    }

    const [videos, setVideos] = useState(parseInput(data)['videos'])

    const onBtn = (type: string) => {
        const map: any = {
            b1: 'controls=true',
            b2: 'loop=false',
            b3: 'mute=false',
            b4: 'padding=15'
        }
        onChange(data += '\n' + map[type])
    }

    const onInputChange = (val: string) => {
        onChange(val)
        const {options, videos} = parseInput(val)
        setVideos(videos)
    }

    const { picolaUrl } = constants
    const convertToUrl = (videoId: string) => picolaUrl + 'f/' + videoId

    return (
        <div className={styles.wrap}>
            <div className={styles.btns}>
                <div className={styles.b1} onClick={() => onBtn('b1') }>ctrl</div>
                <div className={styles.b2} onClick={() => onBtn('b2') }>unloop</div>
                <div className={styles.b3} onClick={() => onBtn('b3') }>unmute</div>
                <div className={styles.b4} onClick={() => onBtn('b4') }>pad</div>
            </div>
            <textarea onChange={e => onInputChange(e.target.value)} value={data} cols={40} rows={5} />
            {videos.length > 1
            ? 
                <div className={styles.listPreview}>
                    {videos.map(video => <div key={video}><video autoPlay loop src={convertToUrl(video)} itemType={'video/mp4'} /></div>)}
                </div>
            :
                <video autoPlay loop controls tabIndex={0} className={styles.preview}>
                    <source src={convertToUrl(videos[0])} itemType={'video/mp4'} />
                </video>
            }
        </div>
    )
}
