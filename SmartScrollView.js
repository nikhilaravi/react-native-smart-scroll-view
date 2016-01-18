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

import Picker                     from './Picker.js';
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
    this.state = { scrollPosition: 0, pickerOpen: false };
    [
      '_focusNode',
      '_keyboardWillHide',
      '_keyboardWillShow',
      '_updateScrollPosition',
      '_dismissPicker',
      '_openPicker',
      '_dismissKeyboard',
      '_generateSmartContent',
      '_renderPicker',
      '_findHeights'
    ].forEach((method) => this[method] = this[method].bind(this))
  }

  componentDidMount() {
    setTimeout(this._findHeights, 0);
    this._listeners = [
      DeviceEventEmitter.addListener('keyboardWillShow', this._keyboardWillShow),
      DeviceEventEmitter.addListener('keyboardWillHide', this._keyboardWillHide),
    ];
    if (this.props.forceFocusField !== this.state.focusedField){
      this._focusField('input_' + this.props.forceFocusField)
    }
  }

  componentWillUpdate(props, state) {
    if (state.keyboardUp !== this.state.keyboardUp) {
      LayoutAnimation.configureNext(animations.layout.easeInEaseOut)
    }
  }

  componentWillReceiveProps(props) {
    setTimeout(this._findHeights,0);
    if (
      this.props.forceFocusField !== props.forceFocusField &&
      this.props.forceFocusField !== this.state.focusedField
    ) { this._focusField('input_' + props.forceFocusField, true) }
  }

  componentWillUnmount() {
    this._listeners.forEach((listener) => listener.remove());
  }

  _findHeights () {
    this._container.measureLayout(1, (x, y, w, height) => {
      this._findScrollWindowHeight = keyboardHeight => {
        const spaceBelow    = screenHeight - y - height;

        return height - Math.max(keyboardHeight - spaceBelow, 0);
      }
      this.setState({ SVDisplacementFromTop: y, originalHeight: height })
      this._smartScroll.refs.InnerScrollView.measure((x,y,w,height) => {
        this.setState({contentHeight:height});
      });
    })
  }

  _focusField (ref, forced) {
    const node            = this[ref];
    const { type }        = node.props.smartScrollOptions;
    const strippedBackRef = ref.slice('input_'.length);

    this.setState({focusedField: strippedBackRef}, () => {
      switch (type) {
        case 'text':
          if (forced) { return this[ref].focus() }
          else { this._dismissPicker() }
          break;
        case 'picker':
          dismissKeyboard();
          this._openPicker();
          break;
        case 'custom':
          dismissKeyboard();
          this._dismissPicker();
          this.setState({scrollWindowHeight:this.state.originalHeight});
          break;
        this.props.onRefFocus(strippedBackRef);
      }
      setTimeout(this._focusNode, 1)
    })
  }

  _focusNode () {
    const {
      state: { scrollPosition, scrollWindowHeight, contentHeight, focusedField: ref },
      props: { scrollPadding },
      _smartScroll
    }                     = this;
    const num             = React.findNodeHandle(_smartScroll);

    setTimeout(() => {
      this['input_'+ref].measureLayout(num, (X,Y,W,H) => {
        const py = Y - scrollPosition;

        if (py + H > scrollWindowHeight) {
          _smartScroll.scrollTo((Y + H) - scrollWindowHeight + scrollPadding)
        } else if ( py < 0 ) {
           _smartScroll.scrollTo(Y - scrollPadding)
        } else if (scrollPosition > (contentHeight - scrollWindowHeight)) {
          _smartScroll.scrollTo(contentHeight - scrollWindowHeight);
        }
      });
    }, 0);
  }

  _keyboardWillShow(e) {
    const scrollWindowHeight = this._findScrollWindowHeight(e.endCoordinates.height)

    this.setState({ scrollWindowHeight, keyboardUp: true});
  }

  _keyboardWillHide() {
    this._dismissKeyboard();
  }

  _dismissKeyboard () {
    this.setState({keyboardUp: false});
  }

  _dismissPicker () {
    this.setState({pickerOpen: false});
  }

  _openPicker () {
    this.setState({
      pickerOpen:         true,
      scrollWindowHeight: this._findScrollWindowHeight(keyboardHeight),
    });
  }

  _renderPicker () {
    const {
      state: {focusedField, SVDisplacementFromTop},
      _dismissPicker
    } = this;
    const { props: {
      smartScrollOptions: { type, pickerType, pickerProps, pickerTitle },
      onSubmitEditing
    }} = this['input_' + focusedField];

    if (type === 'picker') {
      return (
        <View style = {[styles.picker, {top: screenHeight - SVDisplacementFromTop - keyboardHeight}]}>
          <Picker
            pickerType  = { pickerType }
            pickerProps = { pickerProps }
            pickerTitle = { pickerTitle }
            onDone      = { () => {
              _dismissPicker();
              if ( onSubmitEditing !== undefined ) { onSubmitEditing() }
            }}
          />
        </View>
      );
    }
  }

  _updateScrollPosition (event) {
    this.setState({ scrollPosition: event.nativeEvent.contentOffset.y });
  }

  _generateSmartContent (scrollChildren) {
    let inputIndex   = 0;
    const smartClone = (element, i) => {
      const { smartScrollOptions }                                  = element.props;
      const { type, scrollRef, moveToNext, onSubmitEditing, style } = smartScrollOptions;
      let smartProps                                                = { key: i };

      if (type !== undefined) {
        const ref      = 'input_' + inputIndex;
        smartProps.ref = component => [ref, scrollRef && 'input_' + scrollRef]
          .forEach(ref => this[ref] = component);

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
          smartProps.onPress            = () => this._focusField(ref);
          smartProps.smartScrollOptions = smartScrollOptions;
          smartProps.style              = style;
          inputIndex                   += 1;

          return React.cloneElement(<TouchableOpacity/>, smartProps, element);
        } else if (type === 'custom') {
          smartProps.onPress            = () => this._focusField(ref);
          smartProps.smartScrollOptions = smartScrollOptions;
          smartProps.activeOpacity      = 0.95;
          inputIndex                   += 1;
          smartProps.style              = style;

          return React.cloneElement(<TouchableOpacity/>, smartProps, element.props.children)
        }
        inputIndex += 1
      }
      return React.cloneElement(element, smartProps);
    }

    const recursivelyCheckAndAdd = (children, i) => {
      return React.Children.map(children, (child, j) => {
        if (child && child.props !== undefined) {
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

    return recursivelyCheckAndAdd(scrollChildren, '0');
  }

  render () {
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
      },
      _generateSmartContent,
      _updateScrollPosition,
      _renderPicker
    }             = this;
    const content = _generateSmartContent(scrollChildren);

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
              _updateScrollPosition(event);
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
          { pickerOpen && 'picker' && _renderPicker() }
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
