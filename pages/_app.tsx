import React from 'react';
import Head from 'next/head';
import { AppProvider } from '@shopify/polaris';
import { Provider } from '@shopify/app-bridge-react';
import '@shopify/polaris/dist/styles.css';
import translation from '@shopify/polaris/locales/en.json';
import Cookie from 'js-cookie';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-common';
import ClientRouter from '../components/ClientRouter';

const App = (props) => {
    const { Component, pageProps } = props;

    const config = { apiKey: process.env.API_KEY, shopOrigin: Cookie.get('shopOrigin'), forceRedirect: true };

    const client = new ApolloClient({
        fetchOptions: {
            credentials: 'include'
        },
    });

    return (
        <React.Fragment>
            <Head>
                <title>Skeleton App</title>
                <meta charSet="utf-8" />
            </Head>
            <Provider config={config}>
                <ClientRouter />
                <AppProvider i18n={translation}>
                    <ApolloProvider client={client}>
                        <Component {...pageProps} />
                    </ApolloProvider>
                </AppProvider>
            </Provider>
        </React.Fragment>
    )
};

export default App;
