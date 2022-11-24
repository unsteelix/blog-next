import styles from 'styles/listPost.module.scss';
import type { IPost } from '../types/index'
import Image from 'next/image'
import Link from 'next/link';
import constants from '../lib/constants';

export default function ListPost({posts}: {posts: IPost[]}) {
    const sorted = posts.sort((a,b) => (a.index > b.index) ? 1 : ((b.index > a.index) ? -1 : 0))
    const { picolaUrl } = constants;

    return (
        <div className={styles.wrap}>
            {sorted.map(({id, preview, title, slug, show}: any) => show && <div key={id} className={styles.onePost}>
                    <Link href={`/post/${slug}`}>
                        <Image
                            src={`${picolaUrl}i/${preview}?f=png&w=250&h=250`}
                            alt={title}
                            width={250}
                            height={250}
                            object-fit="cover"
                            quality={100}
                        />
                        <div className={styles.title}>{title}</div>
                    </Link>
                    <div className={styles.border}></div>
                </div>
            )}
        </div>
    )
}
