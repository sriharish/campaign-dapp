import React, { Component } from 'react';
import factoryInstance from '../ethereum/factory';
import { Button, Card, Loader } from 'semantic-ui-react';
import AppShell from '../components/AppShell';
import { Link } from '../routes';

class App extends Component {

    static async getInitialProps() {
        const campaigns = await factoryInstance.methods.getDeployedCampaigns().call();
        return { 
            campaigns: campaigns,
            isLoading: false
        };
    }

    renderCampaigns() {
        const items = this.props.campaigns.map(address => {
            return {
                header: address,
                description: (
                    <Link route={`/campaigns/${address}`}>
                        <a>View Campaign</a>
                    </Link>
                ),
                fluid: true
            }
        });

        return <Card.Group items={items} />;
    }

    render() {
        return (
            <AppShell>
                <div>
                    <h3>Open Campaigns</h3>
                    <Link route="/campaigns/new">
                        <a>
                            <Button
                                content="Create Campaign"
                                icon="add circle"
                                primary
                                floated="right"
                            />
                        </a>
                    </Link>
                    {this.renderCampaigns()}
                </div>
            </AppShell>
        );
    }
}

export default App;