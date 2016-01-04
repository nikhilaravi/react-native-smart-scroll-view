import React, { Component, View, TextInput, StyleSheet } from 'react-native';

class SuperScroll extends Component {
  render () {
    console.log("yo",this.props.children);
    return <View/>
  }
}

class Example extends Component {
  render () {
    return (
      <SuperScroll>
        <TextInput
          superscroll='text'
          style=
        />
        <TextInput
          superscroll='text'
        />
        <TextInput
          superscroll='text'
        />
        <TextInput
          superscroll='text'
        />
        <TextInput
          superscroll='text'
        />
        <TextInput
          superscroll='text'
        />
      </SuperScroll>
    )
  }
}

const styles = StyleSheet.create({
  textInput: {
    height:30,
    width: 200,
    backgroundColor: 'yellow'
  }
})


export default Example;
