import { useEffect, useState } from 'react';
import styles from 'styles/blocks/imageBlock.module.scss';
import constants from '../../lib/constants';
import { getNewId } from '../../lib/utils';

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
    const { picolaUrl, imageMainFormat, imageMainQuality, imagePreviewFormat, imagePreviewQuality, imagePreviewWidth } = constants;

    const WideImg = ({ images, size, isPreview }: {images: string[], size: {w: number, h: number}, isPreview: boolean}) => {
        const { w } = size
        const src = picolaUrl + 'i/' + images[0] + `?f=${imageMainFormat}&q=${imageMainQuality}&w=${w}`;
        const srcPreview = picolaUrl + 'i/' + images[0] + `?f=${imagePreviewFormat}&q=${imagePreviewQuality}&w=${imagePreviewWidth}`;
        return <img className={styles.wideImg} alt={src} src={isPreview ? srcPreview : src} />
    }

    const BackgroundImg = ({ images, size, isPreview }: {images: string[], size: {w: number, h: number}, isPreview: boolean}) => {
        const { w } = size
        const src = picolaUrl + 'i/' + images[0] + `?f=${imageMainFormat}&q=${imageMainQuality}&w=${w}`
        const srcPreview = picolaUrl + 'i/' + images[0] + `?f=${imagePreviewFormat}&q=${imagePreviewQuality}&w=${imagePreviewWidth}`;
        return <div className={styles.backgroundImg} style={{backgroundImage: `url(${isPreview ? srcPreview : src})`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundAttachment: 'fixed' }} ></div>
    }

    const PaddingImg = ({ images, size, type, isPreview }: {images: string[], size: {w: number, h: number}, type: string, isPreview: boolean}) => {

        const { w, h } = size
        const padding = parseInt(type.split('_')[1].trim())
        const img = images[0]
        const [,imgW, imgH] = img.split('_')
    
        const viewportAspectRatio = w / h
        const imageAspectRatio = parseInt(imgW.slice(1, imgW.length)) / parseInt(imgH.slice(1, imgH.length))

        let src
        let srcPreview

        if(imageAspectRatio > viewportAspectRatio){
            let width = Math.round(w - (2 * (w / 100 * padding)))
            src = picolaUrl + 'i/' + img + `?f=${imageMainFormat}&q=${imageMainQuality}&w=${width}`
            srcPreview = picolaUrl + 'i/' + img + `?f=${imagePreviewFormat}&q=${imagePreviewQuality}&w=${width}`;
        } else {
            let height = Math.round(h - (2 * (h / 100 * padding)))
            src = picolaUrl + 'i/' + img + `?f=${imageMainFormat}&q=${imageMainQuality}&h=${height}`
            srcPreview = picolaUrl + 'i/' + img + `?f=${imagePreviewFormat}&q=${imagePreviewQuality}&h=${height}`;
        }

        return <img className={styles.paddingImg} alt={src} src={isPreview ? srcPreview : src} />
    }

    const MultiImg = ({ images, size, isPreview }: {images: string[], size: {w: number, h: number}, isPreview: boolean}) => {

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
                let srcPreview

                if(imageAspectRatio > cellAspectRatio){
                    let width = Math.round(cellW)
                    src = picolaUrl + 'i/' + img + `?f=${imageMainFormat}&q=${imageMainQuality}&w=${width}`
                    srcPreview = picolaUrl + 'i/' + img + `?f=${imagePreviewFormat}&q=${imagePreviewQuality}&w=${width}`
                } else {
                    let height = Math.round(cellH)
                    src = picolaUrl + 'i/' + img + `?f=${imageMainFormat}&q=${imageMainQuality}&h=${height}`
                    srcPreview = picolaUrl + 'i/' + img + `?f=${imagePreviewFormat}&q=${imagePreviewQuality}&h=${height}`
                }

                return <img alt={img} src={isPreview ? srcPreview : src} key={img} />
            })}
        </div>
    }

    const renderImageByType = ({ type, images, isPreview }: {type: string, images: string[], isPreview: boolean }) => {

        const w = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
        const h = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

        // scrollbar width
        const bar = window.innerWidth - document.documentElement.clientWidth

        const size = {w: w - bar, h}

        if(type.includes('padding')){
            return <PaddingImg images={images} size={size} type={type} isPreview={isPreview} />
        }

        const map: any = {
            wide:       <WideImg       images={images} size={size} isPreview={isPreview} />,
            background: <BackgroundImg images={images} size={size} isPreview={isPreview} />,
            multi:      <MultiImg      images={images} size={size} isPreview={isPreview} />
        }

        return map[type]
    }

    // background color
    const backgroundOption = options.find(el => el.includes('background='))
    const backgroundColor = backgroundOption?.split('=')[1]

    const id = getNewId()
    const [isPreview, setIsPreview] = useState(true)
    useEffect(() => {
        // set up observer
        if(document){
            const el = document.getElementById(id)
            if(el){
                const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
                const rootMargin = `${vh * 3}px`; // start predownload on 3 screen height
                
                const observer = new IntersectionObserver(entries => {
                    entries.forEach(entry => {
                        const intersecting = entry.isIntersecting;
                        if(intersecting) {
                            setIsPreview(false)
                        }
                    })
                }, {
                    rootMargin,
                    threshold: 0
                })
                observer.observe(el)
            }
        }

        return () => {};
    }, []);

    return (
        <div id={id} className={styles.wrap} style={{backgroundColor: backgroundColor && backgroundColor}}>
            {renderImageByType({ type, images, isPreview })}
        </div>
    )
}
