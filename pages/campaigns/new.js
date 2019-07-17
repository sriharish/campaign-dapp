import React, { Component } from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import AppShell from '../../components/AppShell';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Link, Router } from '../../routes';

class CampaignNew extends Component {

    state = {
        minimumContribution: '',
        errorMessage: '',
        submitting: false
    };

    onSubmit = async (event) => {
        event.preventDefault();
        this.setState({ submitting: true, errorMessage: '' });
        try {
            const accounts = await web3.eth.getAccounts();
            await factory.methods
                .createCampaign(this.state.minimumContribution)
                .send({
                    from: accounts[0]
                });
                Router.pushRoute('/');
        } catch (err) {
            this.setState({ errorMessage: err.message });
        }
        this.setState({ submitting: false });
    }

    render() {
        return (
            <AppShell>
                <h3>Create a Campaign</h3>
                <Form error={!!this.state.errorMessage} onSubmit={this.onSubmit}>
                    <Form.Field>
                        <label>Minimum Contribution</label>
                        <Input 
                            type="number"
                            label="Wei"
                            labelPosition="right"
                            value={this.state.minimumContribution}
                            onChange={event => this.setState({minimumContribution: event.target.value})}
                            />
                    </Form.Field>
                    <Message
                        error
                        header="Oops!"
                        content={this.state.errorMessage}
                        />
                    <Button primary loading={this.state.submitting}>Create</Button>
                </Form>
            </AppShell>
        );
    }
}

export default CampaignNew;