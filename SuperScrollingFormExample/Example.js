import React, {
  Component,
  View,
  TextInput,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity
} from 'react-native';

import dismissKeyboard from 'dismissKeyboard';

import SmartScrollView from '../SmartScrollView.js';

export default class Example extends Component {

  constructor() {
    super();
    this.state = {}
  }

  render () {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style = { styles.headerText } >
            Super Scrolling Form
          </Text>
        </View>
        <SmartScrollView
          contentContainerStyle = { styles.contentContainerStyle }
          forceFocusFieldIndex  = { this.state.focusFieldIndex }
          scrollPadding         = { 10 }
        >
          <TouchableOpacity
            style   = {styles.button}
            onPress = {dismissKeyboard}
          >
            <Text style = {styles.buttonText}>
              Example to remove keyboard
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style   = {styles.button}
            onPress = {() => {this.setState({focusFieldIndex: 10})}}
          >
            <Text style = {styles.buttonText}>
              Example to force move to index 10
            </Text>
          </TouchableOpacity>
          <View style = {styles.inputContainer} >
            <Text style = {styles.fieldName}>default</Text>
            <TextInput
              smartScrollOptions = {{
                moveToNext: true,
                type:       'text'
              }}
              style              = {styles.textInput}
              autoCorrect        = {false}
              keyboardType       = 'default'
            />
          </View>
          <View style = {styles.inputContainer} >
            <Text style = {styles.fieldName}>numeric</Text>
            <TextInput
              smartScrollOptions = {{
                moveToNext: true,
                type:       'text'
              }}
              style              = {styles.textInput}
              autoCorrect        = {false}
              keyboardType       = 'numeric'
            />
          </View>
          <View style = {styles.inputContainer} >
            <Text style = {styles.fieldName}>email</Text>
            <TextInput
              smartScrollOptions = {{
                moveToNext: true,
                type:       'text'
              }}
              style              = {styles.textInput}
              autoCorrect        = {false}
              keyboardType       = 'email-address'
            />
          </View>
          <View style = {styles.inputContainer} >
            <Text style = {styles.fieldName}>ascii-capable</Text>
            <TextInput
              smartScrollOptions = {{
                moveToNext: true,
                type:       'text'
              }}
              style              = {styles.textInput}
              autoCorrect        = {false}
              keyboardType       = 'ascii-capable'
            />
          </View>
          <View style = {styles.inputContainer} >
            <Text style = {styles.fieldName}>numb-&-punc</Text>
            <TextInput
              smartScrollOptions = {{
                moveToNext: true,
                type:       'text'
              }}
              style              = {styles.textInput}
              autoCorrect        = {false}
              keyboardType       = 'numbers-and-punctuation'
            />
          </View>
          <View style = {styles.inputContainer} >
            <Text style = {styles.fieldName}>url</Text>
            <TextInput
              smartScrollOptions = {{
                moveToNext: true,
                type:       'text'
              }}
              style              = {styles.textInput}
              autoCorrect        = {false}
              keyboardType       = 'url'
            />
          </View>
          <View style = {styles.inputContainer} >
            <Text style = {styles.fieldName}>number-pad</Text>
            <TextInput
              smartScrollOptions = {{
                moveToNext: true,
                type:       'text'
              }}
              style              = {styles.textInput}
              autoCorrect        = {false}
              keyboardType       = 'number-pad'
            />
          </View>
          <View style = {styles.inputContainer} >
            <Text style = {styles.fieldName}>phone-pad</Text>
            <TextInput
              smartScrollOptions = {{
                moveToNext: true,
                type:       'text'
              }}
              style              = {styles.textInput}
              autoCorrect        = {false}
              keyboardType       = 'phone-pad'
            />
          </View>
          <View style = {styles.inputContainer} >
            <Text style = {styles.fieldName}>name-phone</Text>
            <TextInput
              smartScrollOptions = {{
                moveToNext: true,
                type:       'text'
              }}
              style              = {styles.textInput}
              autoCorrect        = {false}
              keyboardType       = 'name-phone-pad'
            />
          </View>
          <View style = {styles.inputContainer} >
            <Text style = {styles.fieldName}>decimal-pad</Text>
            <TextInput
              smartScrollOptions = {{
                moveToNext: true,
                type:       'text'
              }}
              style              = {styles.textInput}
              autoCorrect        = {false}
              keyboardType       = 'decimal-pad'
            />
          </View>
          <View style = {styles.inputContainer} >
            <Text style = {styles.fieldName}>twitter</Text>
            <TextInput
              smartScrollOptions = {{
                moveToNext:      true,
                type:            'text'
              }}
              style              = {styles.textInput}
              autoCorrect        = {false}
              keyboardType       = 'twitter'
              clearButtonMode    = 'while-editing'
            />
          </View>
          <View style = {styles.inputContainer} >
            <Text style = {styles.fieldName}>web-search</Text>
            <TextInput
              smartScrollOptions = {{
                type:       'text'
              }}
              style              = {styles.textInput}
              autoCorrect        = {false}
              keyboardType       = 'web-search'
            />
          </View>
        </SmartScrollView>
        <View style={styles.footer}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
  },
    header: {
      height: 60,
      backgroundColor: '#4682B4',
      alignItems:      'center',
      justifyContent:  'center'
    },
      headerText: {
        fontSize:  30,
        color:     '#FFFFFF',
      },
    contentContainerStyle: {
      height:            700,
      alignItems:        'stretch',
      backgroundColor:   '#F0F8FF',
      justifyContent:    'space-around',
      paddingHorizontal: 15
    },
      button: {
        backgroundColor: '#1E90FF',
        height:            40,
        alignItems:        'center',
        justifyContent:    'center',
        paddingHorizontal: 20,
        borderRadius:      10
      },
        buttonText: {
          fontSize:  15,
          color:     '#FFFFFF',
          textAlign: 'center'
        },
      inputContainer: {
        flexDirection:  'row',
        justifyContent: 'space-between',
        alignItems:     'center'
      },
        fieldName: {
          fontSize: 10,
          color:    '#42647F'
        },
        textInput: {
          height:          30,
          width:           220,
          paddingLeft:     10,
          borderWidth:     1,
          borderRadius:    5,
          backgroundColor: 'white',
          fontSize:        12,
        },
    footer: {
      height: 40,
      backgroundColor: '#42647F'
    }
});
