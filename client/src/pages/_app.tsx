import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import Script from 'next/script';
import Head from 'next/head';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import Layout from '@/components/Layout';
import { theme } from '@/constants/theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import NProgress from 'nprogress'; //nprogress module
import Router from 'next/router';
import { useGlobalStore } from '@/store/global';
import 'nprogress/nprogress.css';
import '@/styles/reset.scss';

//Binding events.
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      cacheTime: 0
    }
  }
});

function App({ Component, pageProps }: AppProps) {
  const {
    loadInitData,
    initData: { googleVerKey, baiduTongji }
  } = useGlobalStore();

  useEffect(() => {
    loadInitData();
  }, []);

  return (
    <>
      <Head>
        <title>GPT</title>
        <meta name="description" content="Generated by GPT" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0,user-scalable=no, viewport-fit=cover"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Script src="/js/particles.js"></Script>
      <Script src="/js/qrcode.min.js" strategy="afterInteractive"></Script>
      <Script src="/js/pdf.js" strategy="afterInteractive"></Script>
      <Script src="/js/html2pdf.bundle.min.js" strategy="afterInteractive"></Script>
      {baiduTongji && <Script src="/js/baidutongji.js" strategy="afterInteractive"></Script>}
      {googleVerKey && (
        <>
          <Script
            src={`https://www.recaptcha.net/recaptcha/api.js?render=${googleVerKey}`}
            strategy="afterInteractive"
          ></Script>
        </>
      )}
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          {/* @ts-ignore */}
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ChakraProvider>
      </QueryClientProvider>
    </>
  );
}

// @ts-ignore
export default App;
