import React from 'react';
import { Container } from 'semantic-ui-react';
import TopNav from './TopNav';
import Head from 'next/head';


const AppShell = (props) => {
    return (
        <div>
            <Head>
                <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css" />
            </Head>
            <TopNav />
                <Container>
                    {props.children}
                </Container>
            <h1>Footer</h1>
        </div>
    );
};

export default AppShell;