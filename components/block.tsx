import ImageBlock from './editBlocks/imageBlock';
import VideoBlock from './editBlocks/videoBlock';
import AudioBlock from './editBlocks/audioBlock';
import dynamic from 'next/dynamic'

const TextBlock = dynamic(() => import('./editBlocks/textBlock'), {
  ssr: false,
})

export default function Block({id, type, data, onChange}: {id: string, type: string, data: any, onChange: any}) {

    const getBlockByType = (type: string, data: any) => {

        const blockMap: any = {
            textBlock:  <TextBlock  data={data} onChange={onChange} />,
            imageBlock: <ImageBlock data={data} onChange={onChange} />,
            videoBlock: <VideoBlock data={data} onChange={onChange} />,
            audioBlock: <AudioBlock data={data} onChange={onChange} />
        }
        
        return blockMap[type]
    }
    
    return (
        <div>
            {getBlockByType(type, data)}
        </div>
    )
}
