import Head from 'next/head'
import Layout from '../components/layout';
import styles from 'styles/auth.module.scss';
import { useState } from 'react';
import { setCookie } from 'cookies-next';

export default function Auth() {

    const [inputValue, setInputValue] = useState('')

    const onChange = async (e: string) => {
        setInputValue(e)
        if(e.length >= 6){
            const res = await fetch(`/api/auth/${e.trim()}`).then(e => e.json())
            const { success, token } = res;
            if(success === true){
                setCookie('pass', token)
                window.location.href = '/edit/posts'
            }
        }
    }

  return (
    <Layout home={false}>
      <Head>
        <title>Auth</title>
      </Head>
      <div className={styles.wrap}>
        <div className={styles.content}>
            <input type="password" onChange={(e) => onChange(e.target.value)} value={inputValue} />
        </div>
      </div>
    </Layout>
  )
}
