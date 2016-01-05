import React, {
  Component,
  View,
  TextInput,
  StyleSheet,
  ScrollView,
  DeviceEventEmitter,
  Dimensions,
  LayoutAnimation
} from 'react-native';

const {
  height: screenHeight,
  width: screenWidth
} = Dimensions.get('window');

const animations = {
    layout: {
        spring: {
            duration: 250,
            create: {
                duration: 250,
                type: LayoutAnimation.Types.easeInEaseOut,
                property: LayoutAnimation.Properties.opacity
            },
            update: {
                type: LayoutAnimation.Types.spring,
                springDamping: 200
            }
        },
        easeInEaseOut: {
            duration: 50,
            create: {
                type: LayoutAnimation.Types.easeInEaseOut,
                property: LayoutAnimation.Properties.scaleXY
            },
            update: {
                delay: 500,
                type: LayoutAnimation.Types.easeInEaseOut
            }
        }
    }
};

export default class SuperScroll extends Component {

  constructor(){
    super();
    this.state = {
      scrollPosition : 0
    }
    this._refCreator           = this._refCreator.bind(this);
    this._focusNode            = this._focusNode.bind(this);
    this._keyboardWillHide     = this._keyboardWillHide.bind(this);
    this._updateScrollPosition = this._updateScrollPosition.bind(this);
  }

  componentDidMount() {
    this._listeners = [
      DeviceEventEmitter.addListener('keyboardWillShow', this._keyboardWillShow),
      DeviceEventEmitter.addListener('keyboardWillHide', this._keyboardWillHide)
    ];
  }

  componentWillUpdate(props, state) {
    if (state.keyboardUp !== this.state.keyboardUp) {
      LayoutAnimation.configureNext(animations.layout.spring)
    }
  }

  componentWillUnmount() {
    this._listeners.forEach((listener) => listener.remove());
  }

  _keyboardWillShow(e) {
    console.log(e);
  }

  _keyboardWillHide() {
    this.setState({
      keyBoardUp: false
    });
    this._superScroll && this._superScroll.scrollTo(0);
  }

  _refCreator (ref) {
    return component => this[ref] = component
  }

  _focusField (ref) {
    this[ref].focus()
  }

  _focusNode (focusedNode, type) {
    let keyboardHeight;
    switch (type) {
      case 'password':
        keyboardHeight = 230;
        break;
      case 'number':
        keyboardHeight = 230;
        break;
      default:
        keyboardHeight = 226;
    }

    const scrollWindowHeight = this._findScrollWindowHeight(keyboardHeight)

    this.setState({
      scrollWindowHeight,
      keyBoardUp: true
    }, () => {
      const num = React.findNodeHandle(this._superScroll);

      this[focusedNode].measureLayout(num ,(X,Y,W,H)=>{
        const py = Y - this.state.scrollPosition;

        if ( py + H > scrollWindowHeight ){
          const nextScrollPosition = (Y + H) - scrollWindowHeight;

          this._superScroll.scrollTo(nextScrollPosition);
          this.setState({scrollPosition:nextScrollPosition})
        } else if ( py < 0 ) {
          this._superScroll.scrollTo(Y)
          this.setState({ scrollPosition: Y })
        }
      });
    })
  }

  _updateScrollPosition(event){
    this.setState({ scrollPosition: event.nativeEvent.contentOffset.y });
  }

  render () {

    let inputIndex = 0;

    const content = this.props.children.map((element, i) => {
      let superProps = { key: i };

      if (element.props.superscroll === 'text') {
        const ref          = 'input_' + inputIndex
        superProps.onFocus = () => this._focusNode(ref,'text'),
        superProps.ref     = this._refCreator(ref)

        if (element.props.moveToNext === true) {
          const nextRef              = 'input_' + (inputIndex+1)
          superProps.blurOnSubmit    = false
          superProps.onSubmitEditing = () => this._focusField(nextRef)
          superProps.returnKeyType   = 'next'
        }

        inputIndex += 1
      }

      return React.cloneElement(element, superProps)
    })

    return (
      <View
        style = {{ flex: 1}}
        onLayout = {x => {
          const {y, height}  = x.nativeEvent.layout;
          const spaceBelow   = screenHeight - y - height;

          this._findScrollWindowHeight = (keyboardHeight) => {
            return height - Math.max(keyboardHeight - spaceBelow, 0);
          }
        }}
      >
        <View
          style = {this.state.keyBoardUp ? { height: this.state.scrollWindowHeight } : { flex: 1}}
        >
          <ScrollView
            ref                              = { component => this._superScroll=component}
            automaticallyAdjustContentInsets = {false}
            scrollsToTop                     = {false}
            scrollEnabled                    = {this.state.keyBoardUp || this.props.alwaysScrollable}
            style                            = {{ flex: 1}}
            onScroll                         = {this._updateScrollPosition}
            scrollEventThrottle              = {16}
            contentContainerStyle            = {this.props.contentContainerStyle}
            centerContent                    = {true}
            keyboardShouldPersistTaps        = {true}
          >
            {content}
          </ScrollView>
        </View>
      </View>
    );
  }
}
