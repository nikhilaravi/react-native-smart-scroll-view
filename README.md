# react-native-smart-scroll-view

[![NPM](https://nodei.co/npm-dl/react-native-smart-scroll-view.png?months=3)](https://nodei.co/npm/react-native-smart-scroll-view/)

![ComplexFormExample](https://raw.githubusercontent.com/jrans/react-native-smart-scroll-view/master/complexFormExample.gif)

A pure JS React Native Component for IOS.

A wrapper around react-native ScrollView to handle keyboard events and auto adjust input fields to be visible above keyboard on focus.

Takes in your components and recursively searches for any component (i.e. TextInput) that is given `smartScrollOptions` as a prop. Further props are added to these components to ensure they are always visible above the keyboard and within the ScrollView when focused.

There is also the option to autofocus the next component with `smartScrollOptions` on TextInput submission, and the ability to autofocus **any** component by setting the `smartScrollOptions`props appropriately and specifying the index of the component (more info below) .

Great for use with forms which have multiple TextInput fields!  

## Getting Started

- [Installation](#installation)
- [Properties](#properties)
- [Example Usage](#example-usage)
- [TODO](#todo)

### Installation

```bash
$ npm i react-native-smart-scroll-view --save
```

### Properties

In wrapping around the ScrollView and using the TextInput to control keyboard we have used their native properties to create our functionality. You can still add most props to TextInputs and we will allow you to pass some props to the ScrollView but do so with care.

#### SmartScrollView Props

| Prop  | Default  | Type | Description |
| :------------ |:---------------:| :---------------:| :-----|
| forceFocusField | `undefined` |`number` or `string` | Force scroll the view to the TextInput field at the specified index (smart children indexed in order from 0) or 'scrollRef' you have given to your smart child (see smartScrollOptions below) |
| scrollContainerStyle | `{flex: 1}` | `number` | Style options for the View that wraps the ScrollView, the ScrollView will take up all available space. |
| scrollPadding | `5` | `number` | Padding between the top of the keyboard/ScrollView and the focused TextInput field |
| contentContainerStyle | `{flex: 1}` | `number` | Set to the ScrollView contentContainerStyle prop |
| zoomScale | `1` | `number` | Set to the ScrollView zoomScale prop |
| showsVerticalScrollIndicator | `true` | `bool` | Set to the ScrollView showsVerticalScrollIndicator prop |
| contentInset | `{top: 0, left: 0, bottom: 0, right: 0}` | `object` | Set to the ScrollView contentInset prop  |
| onScroll | `() => {}` | `func` | Set to the ScrollView onScroll function. It will be called alongside our own |
| onRefFocus | `()=>{}` | `func` | Gives back the 'ref' of the node whenever a smart component is focused |
| bounces | `()=>{}` | `bool` | Controls bouncing of the underlying ScrollView |

#### Smart Component Props

Smart components can be the native 'TextInput' s, other component like 'View' s or your own custom components.

For each component that you would like to use, provide the prop `smartScrollOptions` alongside the normal props. **Beware*** some props of native components like TextInputs may be modified by the Smart Scroll View (see below).

##### smartScrollOptions - An object with the following keys:

| Key  | Type | Description |
| :------------: |:---------------:| :-----:|
| type | enum (`text`,`custom`) | For type 'text' the 'moveToNext' and 'onSubmitEditing' options can be set (see below). For type 'custom' further scrolling must be done by forcing the index |
| moveToNext | `bool` | If `true`, the next TextInput field will be focused when the submit button on the keyboard is pressed. Should be set to false or omitted for the **last input field** on the page. **Warning** this will not work if `keyboardType` for the TextInput is set to 'number-pad', 'decimal-pad', 'phone-pad' or 'numeric' as they do not have a return key|
| onSubmitEditing(next) | `func` | Optional function that takes a callback.  When invoked, the callback will focus the next TextInput field. If no function is specified the next TextInput field is focused. Example: `(next) => { if (condition) { next() } }` |
| scrollRef | `string` | To be used in conjunction with the 'forceFocusField' prop of the 'SmartScrollView'. Use 'scrollRef' to reference a particular component which can then be set to forceFocusField to have control where the focus is |


##### How We Modify TextInput Props

For any component which has 'smartScrollOptions.type = text', it is inferred that it is either a 'TextInput' component or contains a 'TextInput' component. The props of the enclosing 'TextInput' component are modified in the following way.

* We attach our own `onFocus` function and will call yours alongside.
* If `moveToNext` in `smartScrollOptions` is true:
  * The`onSubmitEditing` is replaced with our own. See above.
  * `blurOnSubmit` is set to false

### Example Usage

Code for the above gif is found [here](https://github.com/jrans/react-native-smart-scroll-view/blob/master/complexFormExample.js)

Here is another [example](https://github.com/jrans/react-native-smart-scroll-view/blob/master/SuperScrollingFormExample/Example.js) of the smart-scroll-view in action.

![SmartScrollViewExample](https://raw.githubusercontent.com/jrans/react-native-smart-scroll-view/master/SuperScrollingFormExample/exampleInAction.gif)

To run the code yourself and play around, open and run the Xcode project.

```bash
open SuperScrollingFormExample/ios/SuperScrollingFormExample.xcodeproj
```

### TODO

- Allow for more types other than text input to have smart scroll functionality.
  - i.e. a customisable picker component that can be used to replace keyboard to allow the user to select a value from a picker.
  - Any image, button, slider....
- Allow for header/banner above keyboard.
- Better animations....
- Your issues/suggestions!

##### Feel free to comment, question, create issues, submit PRs... to make this view even smarter
