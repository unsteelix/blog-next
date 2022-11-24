import styles from 'styles/blocks/textBlock.module.scss';
import type { IBlocks, IPost } from '../../types/index'


export default function textBlock({data}: {data: any}) {
    return (
        <div className={styles.wrap}>
            <div className={styles.text} dangerouslySetInnerHTML={{ __html: data }} />
        </div>
    )
}
