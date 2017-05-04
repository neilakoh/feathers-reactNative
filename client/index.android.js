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
    this.state = {
      docId: '',
      data: [],
    }
    this.insert = this.insert.bind(this);
    this.remove = this.remove.bind(this);
    this.update = this.update.bind(this);
  }

  insert() {
    app.io.emit('insert', { name: 'jun' });
    app.io.emit('subscribe', { collection: 'messages' });
  }

  remove(docId) {
    app.io.emit('remove', { _id:  docId});
    app.io.emit('subscribe', { collection: 'messages' });
  }

  update() {
    const {docId} = this.state;
    const newName = 'neil';
    app.io.emit('update', { _id:  docId, newVal: newName});
    app.io.emit('subscribe', { collection: 'messages' });
  }

  componentDidMount() {
    const {docId} = this.state;
    app.io.on('connect', () => {
      console.log('connected');
    })
    app.io.on('disconnect', () => {
      console.log('disconnected');
    })

    // SUBSCRIBING TO DATA
    app.io.emit('subscribe', { collection: 'messages' });
    app.io.on('subscribe', (res)=>{
      this.setState({data: res})
    })

    // CRUD
    app.io.on('insert', (res)=>{
      this.setState({docId: res.ops[0]._id})
    })

    app.io.on('remove', (res)=>{
      if(res.n === 1 && res.ok === 1) {
        alert('Record successfully deleted.')
      } else {
        alert('Failed to remove record')
      }
    })

    app.io.on('update', (res)=>{
      if(res.n === 1 && res.ok === 1 && res.nModified === 1) {
        alert('Record successfully updated.')
      } else {
        alert('Failed to update record')
      }
    })

  }

  render() {
    const {data} = this.state;
    console.log(data);
    return (
      <View style={styles.container}>
        {
          data.length > 0 ? data.map((d, i) => (
            <View key={i}>
              <Text>{d.name}</Text>
              <Button title='Remove' onPress={()=>{this.remove(d._id)}}></Button>
            </View>
          )) : null
        }
        <View style={{height: 5}} />
        <View style={{height: 5}} />
        <View style={{height: 5}} />
        <View style={{height: 5}} />
        <Button onPress={this.insert} title='Insert'></Button>
        <View style={{height: 5}} />
        {/* <Button onPress={this.update} title='Update'></Button> */}
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
