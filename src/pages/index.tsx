import Head from 'next/head'
import {handleSave} from "../lib/client";
import { useEffect } from 'react';

export default function Home() {

  useEffect(() => {
    handleSave();
  }, []);

  return (
    <>
      <Head>
        <title>transcript app</title>
        <meta name="description" content="ow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        ow
      </main>
    </>
  )
}
