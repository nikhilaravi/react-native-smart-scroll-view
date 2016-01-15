import React, {
  Component,
  View,
  StyleSheet,
  ScrollView,
  DeviceEventEmitter,
  Dimensions,
  LayoutAnimation,
  PropTypes,
  TouchableOpacity
} from 'react-native';

import dismissKeyboard from 'react-native/Libraries/Utilities/dismissKeyboard';

import Picker      from './Picker.js';
export { default as PickerInput } from './PickerInput.js';

const animations = {
  layout: {
    easeInEaseOut: {
      duration: 250,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.scaleXY
      },
      update: {
        delay: 0,
        type: LayoutAnimation.Types.easeInEaseOut
      }
    }
  }
};

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');
let keyboardHeight;

switch (screenHeight) {
  case 736:
    keyboardHeight = 226;
    break;
  case 1024:
    keyboardHeight = 264;
    break;
  default:
    keyboardHeight = 216;
};


class SmartScrollView extends Component {

  constructor(){
    super();
    this.state = {
      scrollPosition : 0,
      pickerOpen     : false
    };
    [
      '_refCreator',
      '_focusNode',
      '_keyboardWillHide',
      '_keyboardWillShow',
      '_updateScrollPosition',
      '_dismissPicker',
      '_openPicker',
      '_dismissKeyboard'
    ].forEach((method) => this[method] = this[method].bind(this))
  }

  componentDidMount() {
    if (this.props.forceFocusField !== this.state.focusedField){
      this._focusField('input_' + this.props.forceFocusField)
    }
    this._listeners = [
      DeviceEventEmitter.addListener('keyboardWillShow', this._keyboardWillShow),
      DeviceEventEmitter.addListener('keyboardWillHide', this._keyboardWillHide),
    ];
  }

  componentWillUpdate(props, state) {
    if (state.keyboardUp !== this.state.keyboardUp) {
      LayoutAnimation.configureNext(animations.layout.easeInEaseOut)
    }
  }

  componentWillReceiveProps(props) {
    // if (props.forceFocusField !== this.state.focusedField){
    //   this._focusField('input_' + props.forceFocusField, true)
    // }
  }

  componentWillUnmount() {
    this._listeners.forEach((listener) => listener.remove());
  }

  _keyboardWillShow(e) {
    console.log('_keyboatdwillshow called with', 'state', this.state, 'props', this.props)
    const scrollWindowHeight = this._findScrollWindowHeight(e.endCoordinates.height)

    this.setState({
      scrollWindowHeight,
      keyboardUp: true
    })
  }

  _keyboardWillHide() {
    console.log('_fkeyboardWillHide called' ,this.state, this.props)
    this._dismissKeyboard();
  }

  _refCreator () {
    const refs = arguments;

    return component => Object.keys(refs).forEach(i => this[refs[i]] = component);
  }

  _focusField (ref, forced) {
    console.log('_focusField called with', ref, forced, 'state', this.state, 'props', this.props)
    const node            = this[ref];
    const { type }        = node.props.smartScrollOptions;

    const strippedBackRef = ref.slice('input_'.length);

    this.setState({focusedField: strippedBackRef}, () => {
      switch (type) {
        case 'text':
          if (forced) {
            return this[ref].focus();
          } else {
            this._dismissPicker()
          }
          break;
        case 'picker':
          dismissKeyboard();
          this._openPicker();
          break;
        case 'custom':
          // dismissKeyboard();
          // this._dismissPicker();
          break;
      }
      this.props.onRefFocus(strippedBackRef);
      setTimeout(this._focusNode, 250)
    })
  }



  _focusNode () {
    console.log('_focusNode called with', 'state', this.state, 'props', this.props);
    const ref = this.state.focusedField;
    const {
      state: { scrollPosition, scrollWindowHeight },
      props: { scrollPadding }
    }                     = this;
    const num             = React.findNodeHandle(this._smartScroll);

    setTimeout(() => {
      this['input_'+ref].measureLayout(num, (X,Y,W,H) => {
        const py = Y - scrollPosition;

        if ( py + H > scrollWindowHeight ){
          const nextScrollPosition = (Y + H) - scrollWindowHeight + scrollPadding;

          this._smartScroll.scrollTo(nextScrollPosition);
          this.setState({scrollPosition:nextScrollPosition })
        } else if ( py < 0 ) {
          const nextScrollPosition = Y - scrollPadding;

          this._smartScroll.scrollTo(nextScrollPosition)
          this.setState({ scrollPosition: nextScrollPosition })
        }
      });
    }, 0);
  }

  _updateScrollPosition (event) {
    this.setState({ scrollPosition: event.nativeEvent.contentOffset.y });
  }

  _dismissKeyboard () {
    console.log('_dismissKeyboard called with', 'state', this.state, 'props', this.props)
    this.setState({keyboardUp: false})
  }

  _dismissPicker () {
    console.log('_dismissPicker called with', 'state', this.state, 'props', this.props)
    this.setState({pickerOpen: false})
  }

  _openPicker () {
    console.log('_openPicker called with', 'state', this.state, 'props', this.props)
    this.setState({
      pickerOpen:         true,
      scrollWindowHeight: this._findScrollWindowHeight(keyboardHeight),
    });
  }

  _renderPicker () {
    console.log('_renderPicker called with', 'state', this.state, 'props', this.props)
    const {
      props: {
        smartScrollOptions: {
          type,
          pickerType,
          pickerProps,
          pickerTitle,
        },
        onSubmitEditing
      }
    } = this['input_' + this.state.focusedField];

    if (type === 'picker') {
      return (
        <View style = {[styles.picker, {top: screenHeight - this._y - keyboardHeight}]}>
          <Picker
            pickerType  = { pickerType }
            pickerProps = { pickerProps }
            pickerTitle = { pickerTitle }
            onDone      = { () => {
              this._dismissPicker();
              if ( onSubmitEditing !== undefined ) {
                onSubmitEditing();
              }
            }}
          />
        </View>
      );
    }
  }

  render () {

    setTimeout(()=> this._container.measureLayout(1, (x,y,width,height) => {
      this._findScrollWindowHeight = keyboardHeight => {
        const spaceBelow    = screenHeight - y - height;

        return height - Math.max(keyboardHeight - spaceBelow, 0);
      }
      this._y = y;
    }),0);

    const {
      props: {
        children: scrollChildren,
        contentContainerStyle,
        scrollContainerStyle,
        zoomScale,
        showsVerticalScrollIndicator,
        contentInset,
        onScroll
      },
      state: {
        pickerOpen,
        scrollWindowHeight,
        keyboardUp
      }
    }                = this;
    let inputIndex   = 0;
    const smartClone = (element, i) => {
      const { smartScrollOptions } = element.props;
      const {
        type,
        scrollRef,
        moveToNext,
        onSubmitEditing,
        style
      }                            = smartScrollOptions;
      let smartProps               = { key: i };

      if (type !== undefined) {
        const ref = 'input_' + inputIndex;

        smartProps.ref = this._refCreator(ref, scrollRef && 'input_' + scrollRef);

        if (moveToNext === true) {
          const nextRef              = 'input_' + (inputIndex+1);
          const focusNextField       = () => this._focusField(nextRef, true)
          smartProps.blurOnSubmit    = false;
          smartProps.onSubmitEditing = onSubmitEditing ?
            () => onSubmitEditing(focusNextField) :
            focusNextField
        }
        if (type === 'text') {
          smartProps.onFocus = () => {
            element.props.onFocus && element.props.onFocus();
            this._focusField(ref)
          };
        } else if (type === 'picker') {
          smartProps.onPress = () => {
            this._focusField(ref)
          };
          smartProps.smartScrollOptions = smartScrollOptions;
          smartProps.style              = style;
          inputIndex                   += 1;

          return React.cloneElement(<TouchableOpacity/>, smartProps, element)
        }

        inputIndex += 1
      }

      return React.cloneElement(element, smartProps)
    }

    function recursivelyCheckAndAdd(children, i) {
      return React.Children.map(children, (child, j) => {
        if (child.props !== undefined) {
          if (child.props.smartScrollOptions !== undefined) {
            return smartClone(child, ''+i+j);
          } else if (child.props.children !== undefined) {
            return React.cloneElement(child, {key: i}, recursivelyCheckAndAdd(child.props.children, ''+i+j));
          } else {
            return React.cloneElement(child, {key: i});
          }
        } else {
          return child;
        }
      })
    }

    const content = recursivelyCheckAndAdd(scrollChildren, '0');

    return (
      <View
        ref   = { component => this._container=component }
        style = {scrollContainerStyle}
      >
        <View style = {(keyboardUp || pickerOpen) ? { height: scrollWindowHeight } : styles.flex1} >
          <ScrollView
            ref                              = { component => this._smartScroll=component }
            automaticallyAdjustContentInsets = { false }
            scrollsToTop                     = { false }
            style                            = { styles.flex1 }
            onScroll                         = { (event) => {
              this._updateScrollPosition(event);
              onScroll(event);
            }}
            scrollEventThrottle              = { 16 }
            contentContainerStyle            = { contentContainerStyle }
            contentInset                     = { contentInset }
            zoomScale                        = { zoomScale }
            showsVerticalScrollIndicator     = { showsVerticalScrollIndicator }
            keyboardShouldPersistTaps        = { true }
            bounces                          = { false }
          >
            {content}
          </ScrollView>
          { pickerOpen && 'picker' && this._renderPicker() }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  flex1: {
    flex: 1
  },
  picker: {
    height:     keyboardHeight,
    position:   'absolute',
    width:      screenWidth,
    alignItems: 'stretch'
  }
});

SmartScrollView.propTypes = {
  forceFocusField:              PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  scrollContainerStyle:         PropTypes.number,
  contentContainerStyle:        PropTypes.number,
  zoomScale:                    PropTypes.number,
  showsVerticalScrollIndicator: PropTypes.bool,
  contentInset:                 PropTypes.object,
  onScroll:                     PropTypes.func,
  onRefFocus:                   PropTypes.func,
};

SmartScrollView.defaultProps = {
  scrollContainerStyle:         styles.flex1,
  scrollPadding:                5,
  zoomScale:                    1,
  showsVerticalScrollIndicator: true,
  contentInset:                 {top: 0, left: 0, bottom: 0, right: 0},
  onScroll:                     () => {},
  onRefFocus:                   () => {}
};

export default SmartScrollView;

// import dismissKeyboard from 'dismissKeyboard';
// this._scrollTap            = this._scrollTap.bind(this);
// lastTap:         0
// _scrollTap () {
//   const {lastTap}  = this.state;
//   const currentTap = new Date().getTime();
//   console.log("tap")
//
//   if (currentTap - lastTap < 500) {
//     dismissKeyboard()
//   }
//
//   this.setState({
//     lastTap: currentTap
//   })
// }
