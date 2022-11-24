import styles from 'styles/headerLogo.module.scss';
import Link from 'next/link';


export default function HeaderLogo() {

    return (
        <div className={styles.wrap}>
            <Link href="/">
                <div className={styles.logo}>UN</div>
            </Link>
        </div>  
    )
}