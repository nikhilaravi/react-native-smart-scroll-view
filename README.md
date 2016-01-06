# react-native-smart-scroll-view

Wrapper around React Native ScrollView.

Handles keyboard events and autoscrolls the view so that the focussed text input field is positioned above the keyboard.

Use around components with TextInput fields positioned low in the view.

## Getting Started

- [Installation](#installation)
- [Properties](#properties)
  - [Smart View Props](#smart-view-props)
- [Example Usage](#example-usage)
- [Future Features](#future-features)


### Installation

```bash
$ npm i react-native-smart-scroll-view --save
```

### Properties

#### SmartScrollView Props

| Prop  | Default  | Type | Description |
| :------------ |:---------------:| :---------------:| :-----|
| forceFocusFieldIndex | null | `number` | Force scroll the view to the TextInput field at the specified index (TextInput components indexed in order from 0) |
| scrollContainerStyle | {flex: 1} | `number` | Style options for the ScrollView container View |
| scrollPadding | 5 | `number` | Padding between the top of the keyboard and the focussed TextInput field |
| contentContainerStyle | {flex: 1} | `number` | Set to the ScrollView `contentContainerStyle` prop |
| zoomScale | 1 | `number` | Set to the ScrollView `zoomScale` prop |
| showsVerticalScrollIndicator | true | `bool` | Set to the ScrollView `showsVerticalScrollIndicator` prop |
| contentInset | {top: 0, left: 0, bottom: 0, right: 0} | `object` | Set to the ScrollView `contentInset` prop  |
| onScroll | () => {} | `func` | Function will be called in the function set to ScrollView `onScroll` prop |

#### TextInput Props

##### SmartScrollOptions

An object with the following optional keys:

| Key  | Default  | Type | Description |
| :------------ |:---------------:| :---------------:| :-----|
| onSubmitEditing |  | `func` | Optional function that takes a callback.  When invoked, the callback will focus the next TextInput field. If no function is specified the next TextInput field is focussed. |
| moveToNext | null | `bool` | If 'true', the next TextInput field will be focussed when the submit button on the keyboard is pressed. Should be set to 'false' or omitted for the last input field on the page |
| type | 'text' | enum (`text`) | 'text' option uses native iOS keyboard. May add option to use picker keyboard |


#### Native TextInput Props

| Key  | Default  | Type | Description |
| :------------ |:---------------:| :---------------:| :-----|
| onFocus | null | `func` | Function called inside SmartScrollView component when the TextInput node is focussed |

### Example Usage

```js
import React, {
  Component,
  View,
  TextInput,
  StyleSheet,
  ScrollView
} from 'react-native';

import SmartScrollView from 'react-native-smart-scroll-view';

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
        <SmartScrollView
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
        </SmartScrollView>
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

### Future Features

* PickerIOS instead of native keyboard
* Custom TextInput component instead of native TextInput.
