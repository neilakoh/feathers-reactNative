/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  Button,
} from 'react-native';
import feathers from 'feathers/client'
import hooks from 'feathers-hooks';
import socketio from 'feathers-socketio/client';
import authentication from 'feathers-authentication-client';
import io from 'socket.io-client';

let socket = io('http://192.168.5.118:3030', { transports: ['websocket'] });
let app = feathers();
app.configure(hooks());
app.configure(socketio(socket, {timeout: 10000}));
app.configure(authentication({ storage: AsyncStorage }));

export default class client extends Component {
  constructor(props) {
    super(props);
    this.test = this.test.bind(this);
  }

  test() {
    app.io.emit('test', { hello: 'world' });
  }

  componentDidMount() {
    app.io.on('connect', () => {
      console.log('connected');
    })
    app.io.on('disconnect', () => {
      console.log('disconnected');
    })

    // SEND DATA TO THE SERVER
    // app.io.emit('test2', { hello: 'world' });

    // RECEIVER DATA FROM SERVER
    app.io.on('test', (res)=>{
      console.log(res.ops);
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Button onPress={this.test} title='Pass'></Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('client', () => client);
