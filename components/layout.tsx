import Head from 'next/head';
import styles from 'styles/layout.module.scss';
import HeaderLogo from './headerLogo';
import Footer from './footer';

export default function Layout({ children, home }: { children: any, home: any }) {
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
        {!home && <HeaderLogo />}
      </header>
      <main>{children}</main>
      <Footer home={home} />
    </div>
  );
}