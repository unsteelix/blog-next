import Head from 'next/head'
import Layout from '../components/layout';
import styles from 'styles/about.module.scss';

export default function About() {
  return (
    <Layout home={false}>
      <Head>
        <title>About</title>
      </Head>
      <div className={styles.wrap}>
        <div className={styles.content}>
            <div className={styles.text}>
                Документирую повседневность
            </div>
            <div className={styles.text}>
                Путешествую
            </div>
            <div className={styles.text}>
                Иногда программирую
            </div>
        </div>
      </div>
    </Layout>
  )
}
