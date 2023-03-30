import styles from 'styles/edit/blocks.module.scss';
import type { IBlocks, IPost } from '../../types/index'
import Image from 'next/image'
import Link from 'next/link';
import Block from '../block'
import { useState } from 'react';
import { getNewId } from '../../lib/utils';

export default function Blocks({postId, blocksData}: {postId: string, blocksData: IBlocks}) {
    const [blocks, setBlocks] = useState(blocksData);
    const [isLoading, setIsLoading] = useState(false)

    const toArrAndSort = (rawBlocks: IBlocks) => Object.values(rawBlocks).sort((a: { index: number; },b: { index: number; }) => (a.index > b.index) ? 1 : ((b.index > a.index) ? -1 : 0))

    const saveToDB = async () => {
        setIsLoading(true)

        const res = await fetch('/api/blocks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                postId,
                blocks
            })
        })
        let data = await res.json();

        setBlocks(data)
        setIsLoading(false)
    }

    const onChange = async (blockId: string, val: any) => {
        setBlocks((init): any => {
            const updated = {
                ...init,
            }
            updated[blockId].data = val
            return updated
        })
    }

    const onIndexChange = (id: string, val: any, e: any) => {

        if(e.type === 'change'){

            setBlocks((init): any => ({
                ...init,
                [id]: {
                    ...init[id],
                    index: val
                }
            }))

        } else if (e.type === 'blur') {

            setBlocks((init): any => {

                const updated: any = {}
                // меняем индекс
                const list = toArrAndSort({ 
                    ...init,
                    [id]: {
                        ...init[id],
                        index: val
                    }
                })


                // +1 ко всем кто больше
                list.forEach((e, i) => {
                    if(e.id !== id){
                        if(e.index >= val){
                            e.index += 1
                        }
                    }
                })

                // сортировка и чистка пробелов и разрывов
                const dirt: any = {}
                //  наполняю dirt
                list.forEach(e => dirt[e.id] = e)
                
                toArrAndSort({...dirt}).forEach((e, i) => {
                    updated[e.id] = {
                        ...e,
                        index: i
                    }
                })
                
                return updated
            })

        }
    }

    const addBtn = async (type: string) => {
        const newId = getNewId()
        const list = toArrAndSort(blocks)
        
        const newBlock = {
            id: newId,
            index: list.length > 0 ? list[list.length - 1].index + 1 : 1,
            type,
            data: '',
        }

        setBlocks((init): any => {
            const updated = {
                ...init,
                [newId]: newBlock
            }
            return updated
        })
    }

    const delBtn = (blockId: string) => {
        if(confirm('Delete ?')) {
            setBlocks((init): any => {
                const updated = {
                    ...init
                }
                delete updated[blockId]
                return updated
            })
        }
    }

    return (
        <div className={styles.wrap}>
            <div className={styles.blocks}>
                {toArrAndSort(blocks).map(({id, type, data, index}: any) => (
                    <div className={styles.oneRow} key={id}>
                        <div className={styles.left}>
                            <div className={styles.index}>
                                <input type="text" value={index} onChange={(e) => onIndexChange(id, parseInt(e.target.value), e)} onBlur={(e) => onIndexChange(id, parseInt(e.target.value), e)} />
                            </div>
                            <div className={styles.del} onClick={() => delBtn(id)} >del</div>
                        </div>
                        <div className={styles.right}>
                            {isLoading ? 'Loading...' : <Block id={id} type={type} data={data} onChange={(val: any) => onChange(id, val)} />}
                        </div>
                    </div>
                ))}
            </div>
            <div className={styles.btns}>
                <div className={styles.addText} onClick={() => addBtn('textBlock')}>
                    Add text
                </div>
                <div className={styles.addImage} onClick={() => addBtn('imageBlock')}>
                    Add image
                </div>
                <div className={styles.addVideo} onClick={() => addBtn('videoBlock')}>
                    Add video
                </div>
                <div className={styles.addAudio} onClick={() => addBtn('audioBlock')}>
                    Add audio
                </div>
                <div className={styles.save} onClick={saveToDB}>
                    Save
                </div>
            </div>
        </div>
    )
}
