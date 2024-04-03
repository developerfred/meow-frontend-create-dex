import type { NextPage } from 'next';
import Head from 'next/head';
import NavBar from '../layout/navbar';
import dynamic from 'next/dynamic';
import styles from '../styles/Home.module.css';
import { Heading, Text } from '@radix-ui/themes';
import Footer from '@/components/Footer';

const TokenCreateNoSSR = dynamic(() => import('@/components/TokenFactoryComponent'), {
  ssr: false,
});

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Token Genesis | Meow Create</title>
        <meta name="description" content="Craft your digital asset in moments with Meow Create." />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <NavBar />

      <main className={`${styles.main} backdrop-blur-sm bg-opacity-10`}>
        <h1 className="text-5xl text-white font-bold my-5">Forge Your Digital Destiny</h1>
        <p className="text-xl text-white my-10 mx-auto leading-relaxed max-w-2xl">
          Begin the journey of token creation. Simply fill out the form below to mint your own cryptocurrency, and launch your vision into the blockchain universe.
        </p>
        <TokenCreateNoSSR />
      </main>



      <Footer />
    </div>
  );
};

export default Home;
