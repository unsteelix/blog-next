import styles from 'styles/blocks/textBlock.module.scss';

export default function textBlock({data}: {data: string}) {
    return (
        <div className={styles.wrap}>
            <div className={styles.text} dangerouslySetInnerHTML={{ __html: data }} />
        </div>
    )
}
