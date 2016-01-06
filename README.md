# react-native-smart-scroll-view

Wrapper around React Native ScrollView.

Handles keyboard events and autoscrolls the view so that the focussed text input field is positioned above the keyboard.

Use around components with TextInput fields positioned low in the view.

## Getting Started

- [Example](#example)
- [Installation](#installation)
- [Properties](#properties)
- [Example Usage](#example-usage)
- [TODO](#todo)

### Example

Here is the smart-scroll-view in action. To run the code yourself open and run the Xcode project.

```bash
open SuperScrollingFormExample/ios/SuperScrollingFormExample.xcodeproj
```

![SmartScrollViewExample](https://github.com/jrans/react-native-smart-scroll-view/blob/master/SuperScrollingFormExample/exampleInAction.gif)


### Installation

```bash
$ npm i react-native-smart-scroll-view --save
```

### Properties

In wrapping around the ScrollView and using the TextInput to control keyboard we have used their native properties to create our functionality. You can still add most props to TextInputs and we will allow you to pass some props to the ScrollView but do so with care.

#### SmartScrollView Props

| Prop  | Default  | Type | Description |
| :------------ |:---------------:| :---------------:| :-----|
| forceFocusFieldIndex | `undefined` |`number` | Force scroll the view to the TextInput field at the specified index (Chosen TextInputs components indexed in order from 0) |
| scrollContainerStyle | `{flex: 1}` | `number` | Style options for the View that wraps the ScrollView, the ScrollView will take up all available space. |
| scrollPadding | `5` | `number` | Padding between the top of the keyboard/ScrollView and the focused TextInput field |
| contentContainerStyle | `{flex: 1}` | `number` | Set to the ScrollView contentContainerStyle prop |
| zoomScale | `1` | `number` | Set to the ScrollView zoomScale prop |
| showsVerticalScrollIndicator | `true` | `bool` | Set to the ScrollView showsVerticalScrollIndicator prop |
| contentInset | `{top: 0, left: 0, bottom: 0, right: 0}` | `object` | Set to the ScrollView contentInset prop  |
| onScroll | `() => {}` | `func` | Set to the ScrollView onScroll function. It will be called alongside our own |

#### TextInput Props

For each native TextInput component that you would like to use please provide the prop `smartScrollOptions` alongside the normal props. Beware some props modified, see below.

##### smartScrollOptions - An object with the following keys:

| Key  | Type | Description |
| :------------ |:---------------:| :-----|
| type | enum (`text`) | 'text' option only for now |
| moveToNext | `bool` | If `true`, the next TextInput field will be focused when the submit button on the keyboard is pressed. Should be set to false or omitted for the **last input field** on the page |
| onSubmitEditing(next) | `func` | Optional function that takes a callback.  When invoked, the callback will focus the next TextInput field. If no function is specified the next TextInput field is focused. Example: `(next) => { if (condition) { next() } }` |


##### How We Modify TextInput Props

We attach our own `onFocus` function and will call yours alongside.

If `moveToNext` in `smartScrollOptions` is true and `type = 'text'`:
* We replace `onSubmitEditing` with our own. See above.
* `blurOnSubmit` is set to false

### Example Usage

This a simple example of the SmartScrollView in use. To see a more exciting example visit this  [example](https://github.com/jrans/react-native-smart-scroll-view/blob/master/SuperScrollingFormExample/Example.js).

```js

import SmartScrollView from 'react-native-smart-scroll-view';

class Example extends Component {

  render () {
    return (
      <View style={styles.container}>
        <View style={styles.header}/>
        <SmartScrollView
          contentContainerStyle = { styles.contentContainerStyle }
        >
          <TextInput
            superScrollOptions = {{
              moveToNext: true,
              type:       'text'
            }}
            style              = {styles.textInput}
            autoCorrect        = {false}
          />
          <View>
            <TextInput
              superScrollOptions = {{
                type: 'text'
              }}
              style              = {styles.textInput}
              autoCorrect        = {false}
            />
          </View>  
        </SmartScrollView>
      </View>
    )
  }
}


```

### TODO

- Allow for more types other than text input to be super scrollable.
  - I.e. a customisable picker component that can be used to replace keyboard and select value from picker.
  - Any image, button, slider....
- Allow for header above keyboard.
- Better animations.
- Your issues/suggestions!




##### Feel free to comment, question, create issues, submit PRs... to make this view even smarter x
