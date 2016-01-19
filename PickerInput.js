import React, {
  Text,
  Component,
  PropTypes,
  View
} from 'react-native'

class PickerInput extends Component {

  render () {
    const {
      pickerProps: { value, date },
      textStyle,
      placeholder
    } = this.props.smartScrollOptions;

    return (
      <Text style = {[ textStyle, !(value || date) && { color: '#C7C7CD' } ]} >
        { value || (date && date.toDateString()) || placeholder || 'PLACE HOLDER' }
      </Text>
    );
  }
}

PickerInput.propTypes = {
  smartScrollOptions: PropTypes.object
};

export default PickerInput;
