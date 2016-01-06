import React, {
  Component,
  View,
  StyleSheet,
  ScrollView,
  DeviceEventEmitter,
  Dimensions,
  LayoutAnimation,
  PropTypes
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

export default class SmartScrollView extends Component {

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
    if (this.props.forceFocusFieldIndex !== undefined){
      this._focusField('input_' + this.props.forceFocusFieldIndex)
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
    if (props.forceFocusFieldIndex !== undefined){
      this._focusField('input_' + props.forceFocusFieldIndex)
    }
  }

  componentWillUnmount() {
    this._listeners.forEach((listener) => listener.remove());
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
    this._smartScroll && this._smartScroll.scrollTo(0);
  }

  _refCreator (ref) {
    return component => this[ref] = component
  }

  _focusField (ref) {
    this[ref].focus()
  }

  _focusNode (focusedNode) {
    setTimeout(() => {
      const {
        scrollPosition,
        scrollWindowHeight,
      }                       = this.state;
      const { scrollPadding } = this.props;
      const num               = React.findNodeHandle(this._smartScroll);

        this[focusedNode].measureLayout(num, (X,Y,W,H) => {
          const py = Y - scrollPosition;

          if ( py + H > scrollWindowHeight ){
            const nextScrollPosition = (Y + H) - scrollWindowHeight + scrollPadding;

            this._smartScroll.scrollTo(nextScrollPosition);
            this.setState({scrollPosition:nextScrollPosition })
          } else if ( py < 0 ) {
            const nextScrollPosition = Y - scrollPadding;

            this._smartScroll.scrollTo(nextScrollPosition)
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
      onScroll
    }                = this.props;
    let inputIndex   = 0;
    const smartClone = (element, i) => {
      const { smartScrollOptions } = element.props;
      let smartProps               = { key: i };

      if (smartScrollOptions.type === 'text') {
        const ref          = 'input_' + inputIndex;

        smartProps.onFocus = () => {
          smartProps.onFocus = element.props.onFocus && element.props.onFocus();
          this._focusNode(ref,'text')
        };
        smartProps.ref     = this._refCreator(ref);

        if (smartScrollOptions.moveToNext === true) {
          const nextRef              = 'input_' + (inputIndex+1);
          const focusNextField       = () => this._focusField(nextRef)
          smartProps.blurOnSubmit    = false;
          smartProps.onSubmitEditing = smartScrollOptions.onSubmitEditing ?
            smartScrollOptions.onSubmitEditing(focusNextField) :
            focusNextField
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
          return child
        }
      })
    }

    const content = recursivelyCheckAndAdd(scrollChildren, '0');

    return (
      <View
        style = {scrollContainerStyle}
        onLayout = {x => {
          const { y, height } = x.nativeEvent.layout;
          const spaceBelow    = screenHeight - y - height;

          this._findScrollWindowHeight = (keyboardHeight) => {
            return height - Math.max(keyboardHeight - spaceBelow, 0);
          }
        }}
      >
        <View
          style     = {this.state.keyBoardUp ? { height: this.state.scrollWindowHeight } : styles.flex1}
        >
          <ScrollView
            ref                              = { component => this._smartScroll=component }
            automaticallyAdjustContentInsets = { false }
            scrollsToTop                     = { false }
            style                            = { styles.flex1 }
            onScroll                         = { (event) => {
              this._updateScrollPosition(event)
              onScroll(event)
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
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  flex1: {
    flex: 1
  }
});

SmartScrollView.propTypes = {
  forceFocusFieldIndex:         PropTypes.number,
  scrollContainerStyle:         PropTypes.number,
  contentContainerStyle:        PropTypes.number,
  zoomScale:                    PropTypes.number,
  showsVerticalScrollIndicator: PropTypes.bool,
  contentInset:                 PropTypes.object,
  onScroll:                     PropTypes.func
};

SmartScrollView.defaultProps = {
  scrollContainerStyle:         styles.flex1,
  scrollPadding:                5,
  zoomScale:                    1,
  showsVerticalScrollIndicator: true,
  contentInset:                 {top: 0, left: 0, bottom: 0, right: 0},
  onScroll:                     () => {}
};

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
