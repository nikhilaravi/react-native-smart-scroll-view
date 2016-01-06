# React-native-super-scrolling-form

Wrapper around React Native ScrollView which handles keyboard events and autoscrolls to the text input so it is not hidden behind the keyboard.

Use as a wrapper around components with TextInput fields positioned low in the view.

e.g.
```js

```


## Super Scroll View Props

- `forceFocusFieldIndex`: specify the index of a TextInput field in the form to force scroll the view to this field
- `scrollContainerStyle`: style options for the ScrollView container
- `contentContainerStyle`: style to be set to the ScrollView `contentContainerStyle` prop

## TextInput Props

**SuperScrollOptions**
An object with the following optional keys
- `onSubmitEditing`: function that takes a callback (could be used for input validation). The callback will be the function to move to the next field in the form.
- `moveToNext`: set to 'true' if the next input field should be focussed when the submit button is pressed.
- `type`: enum ('text') - might offer option later for custom keyboard (e.g. picker)

**Native TextInput props**
- `onFocus`: function to be called when text input is focussed - this is called inside SuperScroll along with the function to focus the node
