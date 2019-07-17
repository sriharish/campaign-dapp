import React, { Component } from 'react';
import AppShell from '../../components/AppShell';
import Campaign from '../../ethereum/campaign';
import web3 from '../../ethereum/web3';
import { Card } from 'semantic-ui-react';

class CampaignShow extends Component {
    static async getInitialProps(props) {
        const campaign = Campaign(props.query.address);
        const summary = await campaign.methods.getSummary().call();
        return {
            minimumContribution: summary[0],
            balance: summary[1],
            requestCount: summary[2],
            approversCount: summary[3],
            manager: summary[4]
        };
    }

    renderMetrics() {
        const {
            balance,
            manager,
            minimumContribution,
            requestCount,
            approversCount
        } = this.props;

        const items = [
            {
                header: manager,
                meta: 'Manager',
                description: 'Creator of this campaign.',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: minimumContribution,
                meta: 'Minimum Contribution (Wei)',
                description: 'You must contribute at least this much wei to be considered an approver.',
            },
            {
                header: requestCount,
                meta: 'Number of Requests',
                description: 'A request tries to withdray money from the contract. Requests must be approved by approvers.',
            },
            {
                header: approversCount,
                meta: 'Number of Approvers',
                description: 'Number of people who have already donated to the campaign.',
            },
            {
                header: web3.utils.fromWei(balance, 'ether'),
                meta: 'Campaign Balance (Ether)',
                description: 'This balance is how much money this campaign has to spend.',
            }
        ]

        return <Card.Group items={items} />;
    }
    
    render() {
        return (
            <AppShell>
                <h3>Campaign Show</h3>
                {this.renderMetrics()}
            </AppShell>
        );
    }
}

export default CampaignShow;