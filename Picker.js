import React, {
  DatePickerIOS,
  PickerIOS,
  View,
  Text,
  TouchableOpacity,
  Component,
  StyleSheet,
  PropTypes,
  Dimensions
} from 'react-native'

const { width: screenWidth } = Dimensions.get('window');

class Picker extends Component {

  render () {
    const {
      pickerType: type,
      pickerProps,
      pickerTitle,
      onDone
    } = this.props;

    const {
      value,
      date,
      initialValue,
      initialDate
    } = pickerProps;

    const modifiedPickerProps = {
      ...pickerProps,
      value: value === undefined ? initialValue : value,
      date:  date === undefined  ? initialDate : date
    };

    let Picker;

    if (type === 'date') {
      Picker = DatePickerIOS;
    } else if (type === 'custom') {
      Picker = PickerIOS;
    }

    return (
      <View style = {styles.container} >
        <View style = {styles.pickerHeader} >
          <View style = {styles.done} />
          <Text style = {styles.pickerTitle} >{pickerTitle}</Text>
          <TouchableOpacity style = {styles.done} onPress = {onDone} >
            <Text>Done</Text>
          </TouchableOpacity>
        </View>
        <View style = { styles.pickerWrapper }>
          <Picker
            style = {styles.picker}
            {...modifiedPickerProps}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:            1,
    flexDirection:   'column',
    alignItems:      'stretch',
    backgroundColor: 'white'
  },
    pickerHeader: {
      height:            45,
      flexDirection:     'row',
      justifyContent:    'space-between',
      alignItems:        'center',
      paddingHorizontal: 10,
      borderWidth:       1,
      backgroundColor:   '#E3E3E3'
    },
      pickerTitle: {
        fontSize: 20
      },
      done: {
        width: 40
      },
    pickerWrapper: {
      flex:            1,
      flexDirection:   'column',
      justifyContent:  'center',
      overflow:        'hidden',
      backgroundColor: '#F2F2F2',
      paddingBottom:   10
    },
      picker: {
        alignSelf: 'center'
      }
});

Picker.propTypes = {
  pickerType:  PropTypes.string.isRequired,
  pickerProps: PropTypes.object.isRequired,
  onDone:      PropTypes.func.isRequired,
  pickerTitle: PropTypes.string
};

export default Picker;
