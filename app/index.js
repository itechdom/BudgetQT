import { AppRegistry } from 'react-native';
import React, { Component } from 'react';

import App from './App';


export default function index() {
    class Root extends Component {
        render() {
            return (
                    <App />
                   );
        }
    }

    AppRegistry.registerComponent('BudgetQT', () => Root);
}
