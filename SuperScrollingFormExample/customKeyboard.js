'use strict';

/**
* CUSTOM KEYBOAD COMPONENT
*
* - can be used with e.g. DatePickerIOS, PickerIOS
* - uses a React Native modal with animation and transparent background
* - takes a 'close' function for the button and a 'visible' prop for the modal
*
* Example Implementation:
*
*  <CustomKeyboard visible = { this.showCustomKeyboard } close = { this.toggleCustomKeyboard } >
*     <View>
*        <DatePickerIOS
*          date         = { this.state.date }
*          mode         = "date"
*          onDateChange = { this.handleDateChange() }
*        />
*     </View>
*  </CustomKeyboard>
*
**/

import React, { Component, StyleSheet, Modal, PropTypes, View, TouchableOpacity } from 'react-native';

import iPhone from './iphone.js';

import Button from './button2.js';

class CustomKeyboard extends Component {

  render(){

    const { props: { visible, close, children } } = this;

    return (
      <Modal
        animated    = { true }
        transparent = { true}
        visible     = { visible }
      >
        <View style = { styles.modalContentContainer } >
          <TouchableOpacity onPress = {close} style = {{flex:1}} />
          <View style = {styles.content} >
            <View style = { styles.pickerWrapper }>
              { children }
            </View>
            <Button
              touchableOptions = { { onPress: close } }
              buttonPreset     = 'grey'
              text             = 'CLOSE'
            />
          </View>
        </View>
      </Modal>
    )
  }

}

CustomKeyboard.propTypes = {
  visible:  PropTypes.bool,
  close:   PropTypes.func,
  children: PropTypes.element

}

const styles = StyleSheet.create({
  modalContentContainer: {
    flex:           1,
    flexDirection:  'column',
    alignItems:     'stretch',
  },
    content: {
      paddingTop:      5,
      height:          iPhone.keyboardHeight,
      flexDirection:   'column',
      paddingBottom:   15,
      backgroundColor: 'white',
    },
      pickerWrapper: {
        flex:            1,
        flexDirection:   'column',
        alignItems:      'center',
        justifyContent:  'center',
        overflow:        'hidden',
        marginBottom:   10
      }
})

export default CustomKeyboard;
