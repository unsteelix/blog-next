import styles from 'styles/blocks/imageBlock.module.scss';
import constants from '../../lib/constants';

export default function ImageBlock({data}: any) {

    const parseData = (str: string) => {
        let type: string = 'wide'
        let options: string[] = []
        let images: string[] = []

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

    const { type, options, images } = parseData(data)
    const { picolaUrl, imageMainFormat, imageMainQuality } = constants;

    const WideImg = ({ images, size }: {images: string[], size: {w: number, h: number}}) => {
        const { w } = size
        const src = picolaUrl + 'i/' + images[0] + `?f=${imageMainFormat}&q=${imageMainQuality}&w=${w}`
        return <img className={styles.wideImg} alt={src} src={src} />
    }

    const BackgroundImg = ({ images, size }: {images: string[], size: {w: number, h: number}}) => {
        const { w } = size
        const src = picolaUrl + 'i/' + images[0] + `?f=${imageMainFormat}&q=${imageMainQuality}&w=${w}`
        return <div className={styles.backgroundImg} style={{backgroundImage: `url(${src})`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundAttachment: 'fixed' }} ></div>
    }

    const PaddingImg = ({ images, size, type }: {images: string[], size: {w: number, h: number}, type: string}) => {

        const { w, h } = size
        const padding = parseInt(type.split('_')[1].trim())
        const img = images[0]
        const [,imgW, imgH] = img.split('_')
    
        const viewportAspectRatio = w / h
        const imageAspectRatio = parseInt(imgW.slice(1, imgW.length)) / parseInt(imgH.slice(1, imgH.length))

        let src

        if(imageAspectRatio > viewportAspectRatio){
            let width = Math.round(w - (2 * (w / 100 * padding)))
            src = picolaUrl + 'i/' + img + `?f=${imageMainFormat}&q=${imageMainQuality}&w=${width}`
        } else {
            let height = Math.round(h - (2 * (h / 100 * padding)))
            src = picolaUrl + 'i/' + img + `?f=${imageMainFormat}&q=${imageMainQuality}&h=${height}`
        }

        return <img className={styles.paddingImg} alt={src} src={src} />
    }

    const MultiImg = ({ images, size }: {images: string[], size: {w: number, h: number}}) => {

        const { w, h } = size
        const padding = 10
        const boundingBoxW = w - (2 * (w / 100 * padding));
        const boundingBoxH = h - (2 * (h / 100 * padding))

        const cellW = (boundingBoxW - ((images.length - 1) * (w / 100 * padding))) / images.length
        const cellH = boundingBoxH;

        return <div className={styles.multiImg}>
            {images.map(img => {
                const cellAspectRatio = cellW / cellH;
                const [,imgW, imgH] = img.split('_')
                const imageAspectRatio = parseInt(imgW.slice(1, imgW.length)) / parseInt(imgH.slice(1, imgH.length))

                let src

                if(imageAspectRatio > cellAspectRatio){
                    let width = Math.round(cellW)
                    src = picolaUrl + 'i/' + img + `?f=${imageMainFormat}&q=${imageMainQuality}&w=${width}`
                } else {
                    let height = Math.round(cellH)
                    src = picolaUrl + 'i/' + img + `?f=${imageMainFormat}&q=${imageMainQuality}&h=${height}`
                }

                return <img alt={img} src={src} key={img} />
            })}
        </div>
    }

    const renderImageByType = ({ type, options, images }: {type: string, options: string[], images: string[] }) => {

        const w = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
        const h = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

        // scrollbar width
        const bar = window.innerWidth - document.documentElement.clientWidth

        const size = {w: w - bar, h}

        if(type.includes('padding')){
            return <PaddingImg images={images} size={size} type={type} />
        }

        const map: any = {
            wide:       <WideImg       images={images} size={size} />,
            background: <BackgroundImg images={images} size={size} />,
            multi:      <MultiImg      images={images} size={size} />
        }

        return map[type]
    }

    // background color
    const backgroundOption = options.find(el => el.includes('background='))
    const backgroundColor = backgroundOption?.split('=')[1]

    return (
        <div className={styles.wrap} style={{backgroundColor: backgroundColor && backgroundColor}}>
            {renderImageByType({ type, options, images })}
        </div>
    )
}
