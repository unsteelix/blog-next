import Link from 'next/link';
import styles from 'styles/footer.module.scss';


export default function Footer({ home }: { home: any }) {

    return (
        <div className={styles.wrap}>
            {!home && <Link href="/">
                <div className={styles.home}>Home</div>
            </Link>}
            <Link href="/about">
                <div className={styles.about}>About</div>
            </Link>
            <Link href="/edit/posts">
                Edit
            </Link>
        </div>  
    )
}