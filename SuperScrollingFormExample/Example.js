import React, { Component, View, TextInput, StyleSheet } from 'react-native';

class SuperScroll extends Component {

  constructor(){
    super();
    this.refCreator   = this.refCreator.bind(this);
    this.inputOnFocus = this.inputOnFocus.bind(this);
  }

  refCreator (ref) {
    return component => this[ref] = component
  }

  inputOnFocus (ref,type) {
    return () => console.log(ref,type); //add function to handle keyboard events
  }

  render () {

    const content = this.props.children.map((element, i) => {

      if (element.props.superscroll === 'text') {
        const ref = 'input_' + i

        return React.cloneElement(element,
          {
            onFocus : this.inputOnFocus(ref, 'text'),
            ref     : this.refCreator(ref)
          })
      } else {
        return element;
      }
    })

    return (
      <View style={{backgroundColor: 'yellow', flex:1}}>
        {content}
      </View>
    );
  }
}

class Example extends Component {
  render () {
    return (
      <SuperScroll>
        <TextInput
          superscroll='text'
          style={styles.textInput}
        />
        <TextInput
          superscroll='text'
          style={styles.textInput}
        />
        <TextInput
          superscroll='text'
          style={styles.textInput}
        />
        <TextInput
          superscroll='text'
          style={styles.textInput}
        />
        <TextInput
          superscroll='text'
          style={styles.textInput}
        />
        <TextInput
          superscroll='text'
          style={styles.textInput}
        />
      </SuperScroll>
    )
  }
}

const styles = StyleSheet.create({
  textInput: {
    height:30,
    width: 200,
    borderWidth: 1
  }
})

export default Example;
