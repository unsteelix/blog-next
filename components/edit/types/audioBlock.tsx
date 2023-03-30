import { useState } from 'react';
import styles from 'styles/edit/types/audioBlock.module.scss';
import type { IBlocks, IPost } from '../../../types/index'

const picolaUrl = 'http://localhost:2000/'


export default function AudioBlock({data, onChange}: {data: any, onChange: any}) {
    
    const parseInput = (str: string) => {
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

    const [audio, setAudio] = useState(parseInput(data)['audio'])

    const onBtn = (type: string) => {
        const map: any = {
            b1: 'end=true',
            b2: 'controls=true',
            b3: 'loop=true',
            b4: 'autoplay=false',
            b5: 'show=true'
        }
        onChange(data += '\n' + map[type])
    }

    const onInputChange = (val: string) => {
        onChange(val)
        const {options, audio} = parseInput(val)
        setAudio(audio)
    }

    const convertToUrl = (audioId: string) => picolaUrl + 'f/' + audioId

    return (
        <div className={styles.wrap}>
            <div className={styles.btns}>
                <div className={styles.b1} onClick={() => onBtn('b1') }>end</div>
                <div className={styles.b2} onClick={() => onBtn('b2') }>ctrl</div>
                <div className={styles.b3} onClick={() => onBtn('b3') }>loop</div>
                <div className={styles.b4} onClick={() => onBtn('b4') }>noautoplay</div>
                <div className={styles.b5} onClick={() => onBtn('b5') }>show</div>
            </div>
            <textarea onChange={e => onInputChange(e.target.value)} value={data} cols={40} rows={5} />
            <audio controls className={styles.preview}>
                <source src={convertToUrl(audio)} />
            </audio>
        </div>
    )
}
