import { useState } from 'react';
import styles from 'styles/editBlocks/imageBlock.module.scss';
import constants from '../../lib/constants';

export default function ImageBlock({data, onChange}: {data: any, onChange: any}) {
    
    const parseInput = (str: string) => {
        let type: string = 'wide'
        let options: any[] = []
        let images: any[] = []

        str.split('\n').forEach(el => {
            if(el.includes('type=')){
                type = el.split('type=')[1]
            } else if(el.includes('background=')) {
                options.push(el)
            } else {
                if(el.trim().length > 0){
                    images.push(el.trim())
                }
            }
        })

        if(images.length > 1){
            type = 'multi'
        }

        return {
            type,
            options,
            images
        }
    }

    const [imgs, setImgs] = useState(parseInput(data)['images'])

    const onBtn = (type: string) => {
        const map: any = {
            b1: 'type=background',
            b2: 'type=padding_15',
            b3: 'background=black'
        }
        onChange(data += '\n' + map[type])
    }

    const onInputChange = (val: string) => {
        onChange(val)
        const { images } = parseInput(val)
        setImgs(images)
    }

    const { picolaUrl, imageMainFormat, imageMainQuality } = constants;
    const convertToUrl = (imgId: string) => `${picolaUrl}i/${imgId}?f=${imageMainFormat}&q=${imageMainQuality}&w=400&h=120`
    const convertToUrlForList = (imgId: string) => picolaUrl + 'i/' + imgId + `?f=${imageMainFormat}&q=${imageMainQuality}&w=${Math.ceil(400/imgs.length - 10)}&h=120&fill=cover`

    return (
        <div className={styles.wrap}>
            <div className={styles.btns}>
                <div className={styles.b1} onClick={() => onBtn('b1') }>fixed</div>
                <div className={styles.b2} onClick={() => onBtn('b2') }>pad</div>
                <div className={styles.b3} onClick={() => onBtn('b3') }>color</div>
            </div>
            <textarea onChange={e => onInputChange(e.target.value)} value={data} cols={40} rows={5} />
            {imgs.length > 1
            ? 
                <div className={styles.listPreview}>
                    {imgs.map((img, i) => <div key={img + i}><img alt={'preview'} src={convertToUrlForList(img)} /></div>)}
                </div>
            :
                <img className={styles.preview} alt={'preview'} src={convertToUrl(imgs[0])} />    
            }
        </div>
    )
}
