'use strict';

import React, {
  Component,
  PropTypes,
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch
} from 'react-native';

import SmartScrollView from 'react-native-smart-scroll-view';

import Button from './helpers/_button.js';

const textFields = [
  { ref: 'title', keyboardType: 'default', placeholder: 'TITLE', secureTextEntry: false, autoCapitalise: true },
  { ref: 'firstName', keyboardType: 'default', placeholder: 'FIRST NAME', secureTextEntry: false, autoCapitalise: true },
  { ref: 'lastName', keyboardType: 'default', placeholder: 'LAST NAME', secureTextEntry: false, autoCapitalise: true },
  { ref: 'email', keyboardType: 'email-address', placeholder: 'EMAIL ADDRESS', secureTextEntry: false, autoCapitalise: false },
  { ref: 'mobile', keyboardType: 'phone-pad', placeholder: 'PHONE NUMBER', secureTextEntry: false, autoCapitalise: false },
  { ref: 'password1', keyboardType: 'default', placeholder: 'PASSWORD (6-9 LETTERS & AT LEAST 1 NO.)', secureTextEntry: true, autoCapitalise: false },
  { ref: 'password2', keyboardType: 'default', placeholder: 'CONFIRM PASSWORD', secureTextEntry: true, autoCapitalise: false }
];

class RegistrationPage extends Component {

  constructor () {
    super();

    this.state = {
      forceFocusField: undefined
    };
  }

  render () {
    const {
      fields,
      changeInput,
      validateInput,
      buttonText,
      showTerms,
      changeTandC,
      submitContactInfo,
      toggleTandCModal
    }                  = this.props;
    const smartTexts  = textFields.map( (field, i) => {
      const { ref, ...extraTextOptions } = field;
      const { value, validated }         = fields[ref];

      return (
        <View style = {styles.inputContainer} key = {i} >
          <TextInput
            value                         = { value }
            onChangeText                  = { text => changeInput(ref, text) }
            smartScrollOptions            = {{
              moveToNext:      true,
              onSubmitEditing: (next) => {
                validateInput(ref);
                next();
              },
              type:            'text'
            }}
            onEndEditing                  = { () => validateInput(ref) }
            style                         = {[
              styles.textInput,
              validated === false && { borderColor: 'red' }
            ]}
            enablesReturnKeyAutomatically = { true }
            autoCorrect                   = { false }
            {...extraTextOptions}
          />
        <View style = { [styles.tick, validated===true && {backgroundColor: '#4CD964'}] } />
        </View>
      )
    })

    return (
      <View style = {styles.container}>
        <SmartScrollView
          contentContainerStyle = { styles.contentContainerStyle }
          onRefFocus            = { forceFocusField => this.setState({forceFocusField}) }
          forceFocusField       = { this.state.forceFocusField }
        >
          {smartTexts}
          <View
            style              = {styles.ts_and_cs_container}
            smartScrollOptions = {{ type: 'custom' }}
          >
            <View style = {styles.ts_and_cs}>
              <Text style = {styles.ts_and_cs_text}>Agree to</Text>
              <TouchableOpacity onPress = { toggleTandCModal }>
                <Text style = {[styles.ts_and_cs_text, {textDecorationLine:'underline'}]}> Terms and Conditions</Text>
              </TouchableOpacity>
            </View>
            <Switch
              onValueChange = {(value) => {
                changeTandC(value);
                value && this.setState({forceFocusField: 'submitButton'})
              }}
              onTintColor    = 'white'
              thumbTintColor = '#4CD964'
              tintColor      = 'white'
              value          = {fields.ts_and_cs.value}
            />
          </View>
          <View smartScrollOptions = {{ type: 'custom', scrollRef: 'submitButton' }}>
            <Button
              onPress            = { submitContactInfo }
              text               = { 'Continue' }
            />
          </View>
        </SmartScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:            1,
    alignItems:      'stretch',
    backgroundColor: 'lightBlue',
  },
    contentContainerStyle: {
      alignItems:       'stretch',
      justifyContent:   'space-around',
      paddingHorizontal: 15,
      paddingVertical:   10,
      height:            650
    },
      inputContainer: {
        paddingVertical: 10,
        flexDirection:   'row',
        alignItems:      'center',
      },
      textInput: {
        height:          45,
        width:           210,
        paddingLeft:     10,
        borderWidth:     3,
        borderRadius:    5,
        backgroundColor: 'white',
        fontSize:        12,
        flex:            1,
        paddingLeft:     10,
        marginRight:     10
      },
      tick: {
        height:          30,
        width:           30,
        borderRadius:    15,
        backgroundColor: 'white',
        borderColor:     'white',
        borderWidth:     2
      },
    ts_and_cs_container: {
      paddingVertical: 10,
      flexDirection:   'row',
      justifyContent: 'space-between'
    },
      ts_and_cs: {
        flexDirection:   'row',
        alignItems:      'center',
      },
        ts_and_cs_text: {
          fontSize: 15
        },
    button: {
      backgroundColor:  'darkBlue',
      height:            50,
      width:             280,
      alignSelf:         'center',
      alignItems:        'center',
      justifyContent:    'center',
      paddingHorizontal: 20,
      borderRadius:      10,
      marginVertical:    20
    },
      buttonText: {
        fontSize:  15,
        color:     '#FFFFFF',
        textAlign: 'center'
      }
});

RegistrationPage.propTypes = {
  fields:            PropTypes.object,
  showTerms:         PropTypes.bool,
  validateInput:     PropTypes.func,
  changeInput:       PropTypes.func,
  submitContactInfo: PropTypes.func,
  changeTandC:       PropTypes.func,
  toggleTandCModal:  PropTypes.func
};

export default RegistrationPage;
