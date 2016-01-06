# React-native-super-scrolling-form

Wrapper around React Native ScrollView which handles keyboard events and autoscrolls the text input field so it is positioned above the keyboard.

Use around components with TextInput fields positioned low in the view.

## Getting Started

- [Installation](#installation)
- [Properties](#properties)
  + [Super Scroll View Props](#super-scroll-view-props)
- [Example Usage](#example-usage)


### Installation

```bash
$ npm i react-native-super-scrolling-form --save
```

### Properties

#### Super Scroll View Props

| Prop  | Default  | Type | Description |
| :------------ |:---------------:| :---------------:| :-----|
| forceFocusFieldIndex | null | `number` | index of a TextInput field in the form to force scroll the view to this field |
| scrollContainerStyle | {flex: 1} | `number` | style options for the ScrollView container |
| contentContainerStyle | {flex: 1} | `number` | style to be set to the ScrollView `contentContainerStyle` prop |
| scrollPadding | 5 | `number` | Padding between the top of the keyboard and the focussed text input field |

#### TextInput Props

##### SuperScrollOptions

An object with the following optional keys:

| Key  | Default  | Type | Description |
| :------------ |:---------------:| :---------------:| :-----|
| onSubmitEditing | null | `function` | function that takes a callback (could be used for input validation). The callback will be the function to move to the next field in the form.|
| moveToNext | null | `bool` | if 'true', the next input field will be focussed when the submit button on the keyboard is pressed |
| type | 'text' | enum (`text`) | 'text' option uses native iOS keyboard. May add option to use picker keyboard|


#### Native TextInput Props

| Key  | Default  | Type | Description |
| :------------ |:---------------:| :---------------:| :-----|
| onFocus | null | `function` | this is called inside SuperScrollView component when the TextInput node is focussed |

### Example Usage

```js
import React, {
  Component,
  View,
  TextInput,
  StyleSheet,
  ScrollView
} from 'react-native';

import SuperScroll from 'react-native-super-scrolling-form';

class Example extends Component {

  constructor() {
    super();
    this.state = {
      focusFieldIndex: 1
    }
  }

  render () {
    return (
      <View style={styles.container}>
        <View style={styles.header}/>
        <SuperScroll
          contentContainerStyle = { styles.contentContainerStyle }
          forceFocusFieldIndex  = { this.state.focusFieldIndex }
        >
          <TextInput
            superScrollOptions = {{
              moveToNext: true,
              type:       'text'
            }}
            style              = {styles.textInput}
            autoCorrect        = {false}
          />
          <TextInput
            superScrollOptions = {{
              moveToNext: true,
              type:       'text'
            }}
            style              = {styles.textInput}
            autoCorrect        = {false}
          />
        </SuperScroll>
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
})

```
