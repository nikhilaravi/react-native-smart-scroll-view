/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  Component
} = React;

import Example from './Example.js';

class SuperScrollingFormExample extends Component {
  render () {
    return <Example/>
  }
};

AppRegistry.registerComponent('SuperScrollingFormExample', () => SuperScrollingFormExample);
