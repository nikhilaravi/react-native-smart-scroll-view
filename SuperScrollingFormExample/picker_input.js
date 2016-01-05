'use strict';

import React, {
  Component,
  StyleSheet,
  TouchableOpacity,
  PropTypes,
  Text,
  PickerIOS,
  View
}  from 'react-native';

import iPhone         from '../feature/iphone.js';
import CustomKeyboard from '../feature/customKeyboard.js';

const { width: screenWidth } = iPhone;

const PickerItemIOS = PickerIOS.item;

class PickerInput extends Component {
  render () {

    const {
      props: {
        value,
        possibleValues,
        onValueChange,
        pickerVisible,
        togglePicker
      },
    } = this;


    const selections = possibleValues.map(value => (
      <PickerItemIOS
        key   = { value }
        value = { value }
        label = { value }
      />
    ));

    return (
      <View style = {{flex: 1}} >
        <CustomKeyboard visible = { pickerVisible } close = { togglePicker } >
          <View>
            <PickerIOS
              style         = { { width: screenWidth } }
              selectedValue = { value }
              onValueChange = { onValueChange }
            >
            { selections }
            </PickerIOS>
          </View>
        </CustomKeyboard>
      </View>
    )
  }
}

PickerInput.propTypes = {
  onValueChange:   PropTypes.func,
  value:           PropTypes.string,
  possibleValues:  PropTypes.array,
  pickerVisible:   PropTypes.bool,
  togglePicker:    PropTypes.func
};

PickerInput.defaultProps = {
  onValueChange:   () => {console.log('picker input changed')},
  value:           undefined,
  possibleValues:  ['give me values', 'please'],
  pickerVisible:   false,
  togglePicker:    () => {console.log('add toggle picker function')}  
};

export default PickerInput;
