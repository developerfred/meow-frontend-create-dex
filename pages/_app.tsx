import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import '@radix-ui/themes/styles.css';
import type { AppProps } from 'next/app';
import { Theme } from '@radix-ui/themes';
import '../styles/main.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import {
  mainnet,
  sepolia,
} from 'wagmi/chains';
import { getDefaultConfig, RainbowKitProvider, darkTheme} from '@rainbow-me/rainbowkit';


const config = getDefaultConfig({
  appName: 'Meow Create',
  projectId: '9deef814c67d0f25fae3554f724ff8b6',
  chains: [
    mainnet,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [sepolia] : []),
  ],
  ssr: true,
});

const client = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Theme appearance="dark">
      <WagmiProvider config={config}>
        <QueryClientProvider client={client}>
          <RainbowKitProvider theme={darkTheme()} showRecentTransactions={true}>
            <Component {...pageProps} />
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </Theme>
  );
}

export default MyApp;
