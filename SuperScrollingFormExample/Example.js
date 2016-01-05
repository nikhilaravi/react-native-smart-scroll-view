import React, {
  Component,
  View,
  TextInput,
  StyleSheet,
  ScrollView
} from 'react-native';

import SuperScroll from './SuperScroll.js';

class Example extends Component {
  render () {
    return (
      <View style={styles.container}>
        <View style={styles.header}/>
        <SuperScroll
          contentContainerStyle = { styles.contentContainerStyle }
        >
          <TextInput
            superscroll = 'text'
            style       = {styles.textInput}
            moveToNext  = {true}
            autoCorrect = {false}
          />
          <TextInput
            superscroll = 'text'
            style       = {styles.textInput}
            moveToNext  = {true}
            autoCorrect = {false}
          />
          <TextInput
            superscroll = 'text'
            style       = {styles.textInput}
            moveToNext  = {true}
            autoCorrect = {false}
          />
          <TextInput
            superscroll = 'text'
            style       = {styles.textInput}
            moveToNext  = {true}
            autoCorrect = {false}
          />
          <TextInput
            superscroll = 'text'
            style       = {styles.textInput}
            moveToNext  = {true}
            autoCorrect = {false}
          />
          <TextInput
            superscroll='text'
            style     =     {styles.textInput}
            autoCorrect = {false}
          />
        </SuperScroll>
        <View style={styles.footer}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
  },
    contentContainerStyle: {
      height: 700,
      width: 300,
      alignItems: 'center',
      backgroundColor:'pink',
      justifyContent: 'space-around'
    },
      textInput: {
        height:      30,
        width:       200,
        borderWidth: 1,
      },
    footer: {
      height: 200,
      backgroundColor: 'yellow'
    },
    header: {
      height: 70,
      backgroundColor: 'green'
    },

})

export default Example;
