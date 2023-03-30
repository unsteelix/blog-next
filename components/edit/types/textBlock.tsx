import styles from 'styles/edit/types/textBlock.module.scss';
import type { IBlocks, IPost } from '../../../types/index'
import React, { useRef } from 'react';
import Tiptap from '../../tiptap';


export default function textBlock({data, onChange}: {data: any, onChange: any}) {
    return (
        <div className={styles.wrap}>
            <Tiptap initData={data} onChange={(html: string) => onChange(html)} />
        </div>
    )
}
