import React, {
  Component,
  PropTypes,
} from 'react';

import ReactNative, {
  View,
  ScrollView,
  Keyboard,
  Dimensions,
  LayoutAnimation,
  Platform
} from 'react-native';

const { height: screenHeight } = Dimensions.get('window');
const animations               = {
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

class SmartScrollView extends Component {

  constructor(){
    super();
    this.state = {
      scrollPosition : 0,
    }
    this._refCreator           = this._refCreator.bind(this);
    this._focusNode            = this._focusNode.bind(this);
    this._keyboardWillHide     = this._keyboardWillHide.bind(this);
    this._keyboardWillShow     = this._keyboardWillShow.bind(this);
    this._updateScrollPosition = this._updateScrollPosition.bind(this);
  }

  componentDidMount() {
    if (this.props.forceFocusField !== this.state.focusedField){
      this._focusField('input_' + this.props.forceFocusField)
    }

    this._listeners = [
      Keyboard.addListener(Platform.OS == 'IOS' ? 'keyboardWillShow' : 'keyboardDidShow', this._keyboardWillShow),
      Keyboard.addListener(Platform.OS == 'IOS' ? 'keyboardWillHide' : 'keyboardDidHide', this._keyboardWillHide),
    ];
  }

  componentWillUpdate(props, state) {
    if (state.keyboardUp !== this.state.keyboardUp) {
      LayoutAnimation.configureNext(animations.layout.easeInEaseOut)
    }
  }

  componentWillReceiveProps(props) {
    if (props.forceFocusField !== undefined && props.forceFocusField !== this.state.focusedField){
      this._focusField('input_' + props.forceFocusField)
    }
  }

  componentWillUnmount() {
    this._listeners.forEach((listener) => listener.remove());
  }

  _findScrollWindowHeight(keyboardHeight){
    const {x, y, width, height} = this._layout
    const spaceBelow    = screenHeight - y - height;
    return height - Math.max(keyboardHeight - spaceBelow, 0);
  }

  _keyboardWillShow(e) {
    const scrollWindowHeight = this._findScrollWindowHeight(e.endCoordinates.height)

    this.setState({
      scrollWindowHeight,
      keyBoardUp: true
    })
  }

  _keyboardWillHide() {
    this.setState({
      keyBoardUp: false
    });
    this._smartScroll && this._smartScroll.scrollTo({y: 0});
  }

  _refCreator () {
    const refs = arguments;
    return component => Object.keys(refs).forEach(i => this[refs[i]] = component);
  }

  _focusField (ref) {
    const node = this[ref];
    const {type} = node.props.smartScrollOptions;

    switch(type) {
      case 'text':
        this[ref].focus();
        break;
      case 'custom':
        this._focusNode(ref);
    }
  }

  _focusNode (ref) {
    const {
      scrollPosition,
      scrollWindowHeight,
    }                       = this.state;
    const {
      scrollPadding,
      onRefFocus
    }                       = this.props;
    const num               = ReactNative.findNodeHandle(this._smartScroll);
    const strippedBackRef   = ref.slice('input_'.length);

    this[ref] && setTimeout(() => {
      onRefFocus(strippedBackRef);
      this.setState({focusedField: strippedBackRef})
      this[ref].measureLayout(num, (X,Y,W,H) => {
        const py = Y - scrollPosition;

        if (!scrollWindowHeight) {
          setTimeout(() => {
            this._focusNode(ref);
          }, 100);
        } else if ( py + H > scrollWindowHeight ){
          const nextScrollPosition = (Y + H) - scrollWindowHeight + scrollPadding;

          this._smartScroll.scrollTo({y: nextScrollPosition});
          this.setState({scrollPosition: nextScrollPosition })
        } else if ( py < 0 ) {
          const nextScrollPosition = Y - scrollPadding;

          this._smartScroll.scrollTo({y: nextScrollPosition})
          this.setState({ scrollPosition: nextScrollPosition})
        }
      });
    }, 0);
  }

  _updateScrollPosition (event) {
    this.setState({ scrollPosition: event.nativeEvent.contentOffset.y });
  }

  render () {

    const {
      children: scrollChildren,
      contentContainerStyle,
      scrollContainerStyle,
      zoomScale,
      showsVerticalScrollIndicator,
      contentInset,
      onScroll,
      keyboardDismissMode,
      keyboardShouldPersistTaps
      bounces,
    }                = this.props;
    let inputIndex   = 0;
    const smartClone = (element, i) => {
      const { smartScrollOptions } = element.props;
      let smartProps               = { key: i };

      if (smartScrollOptions.type !== undefined) {
        const ref          = 'input_' + inputIndex;

        smartProps.ref = this._refCreator(ref, smartScrollOptions.scrollRef && 'input_' + smartScrollOptions.scrollRef);

        if (smartScrollOptions.type === 'text') {
          smartProps.onFocus = () => {
            smartProps.onFocus = element.props.onFocus && element.props.onFocus();
            this._focusNode(ref)
          };

          if (smartScrollOptions.moveToNext === true) {
            const nextRef              = 'input_' + (inputIndex+1);
            const focusNextField       = () => this._focusField(nextRef)

            if(typeof(element.props.returnKeyType) === 'undefined'){
              smartProps.returnKeyType  = 'next'
            }

            smartProps.blurOnSubmit    = false;
            smartProps.onSubmitEditing = smartScrollOptions.onSubmitEditing ?
              () => smartScrollOptions.onSubmitEditing(focusNextField) :
              focusNextField
          }
        }

        inputIndex += 1
      }

      return React.cloneElement(element, smartProps)
    }

    function recursivelyCheckAndAdd(children, i) {
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
          return child
        }
      })
    }

    const content = recursivelyCheckAndAdd(scrollChildren, '0');
    return (
      <View
        ref   = { component => this._container=component }
        style = {scrollContainerStyle}
        onLayout={(e) => this._layout = e.nativeEvent.layout}
      >
        <View>
          <ScrollView
            ref                              = { component => this._smartScroll=component }
            automaticallyAdjustContentInsets = { false }
            scrollsToTop                     = { false }
            style     = {this.state.keyBoardUp ? { height: this.state.scrollWindowHeight } : {}}
            onScroll                         = { (event) => {
              this._updateScrollPosition(event)
              onScroll(event)
            }}
            scrollEventThrottle              = { 16 }
            contentContainerStyle            = { contentContainerStyle }
            contentInset                     = { contentInset }
            zoomScale                        = { zoomScale }
            showsVerticalScrollIndicator     = { showsVerticalScrollIndicator }
            keyboardShouldPersistTaps        = {keyboardShouldPersistTaps}
            keyboardDismissMode              = {keyboardDismissMode}
            bounces                          = { bounces }
          >
            {content}
          </ScrollView>
        </View>
      </View>
    );
  }
}

SmartScrollView.propTypes = {
  forceFocusField:              PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  scrollContainerStyle:         View.propTypes.style,
  contentContainerStyle:        View.propTypes.style,
  zoomScale:                    PropTypes.number,
  showsVerticalScrollIndicator: PropTypes.bool,
  contentInset:                 PropTypes.object,
  onScroll:                     PropTypes.func,
  onRefFocus:                   PropTypes.func,
  keyboardDismissMode:          PropTypes.string,
  keyboardShouldPersistTaps:          PropTypes.string,
  bounces:                      PropTypes.bool,
};

SmartScrollView.defaultProps = {
  scrollContainerStyle:         {},
  scrollPadding:                5,
  zoomScale:                    1,
  showsVerticalScrollIndicator: true,
  contentInset:                 {top: 0, left: 0, bottom: 0, right: 0},
  onScroll:                     () => {},
  onRefFocus:                   () => {},
  keyboardDismissMode:          'none',
  keyboardShouldPersistTaps:          'always'
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
/**
 * Created by Meysam on 5/7/17.
 */
