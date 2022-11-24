import Head from 'next/head';
import styles from 'styles/layoutAdmin.module.scss';
import Link from 'next/link';


export default function LayoutAdmin({ children }) {
  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="unsteelix blog"
        />
      </Head>
      <header className={styles.header}>
        <div className={styles.oneLink}>
          <Link href="/">
            Home
          </Link>  
        </div>
        <div className={styles.oneLink}>
          <Link href="/edit/posts">
            Posts edit
          </Link>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}