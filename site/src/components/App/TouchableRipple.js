import React, { PureComponent } from "react";
import { View, Animated, Easing, Platform, TouchableWithoutFeedback } from "react-native";

import { styles, radius } from "@/styles/rippleStyles";
import tw from "twrnc";

export class Ripple extends PureComponent {
    static defaultProps = {
        ...TouchableWithoutFeedback.defaultProps,

        rippleColor: "rgb(0, 0, 0)",
        rippleOpacity: 0.3,
        rippleDuration: 500,
        rippleSize: 0,
        rippleCentered: false,
        rippleContainerBorderRadius: 0,
        rippleCentered: false,
        rippleSequential: false,
        rippleFades: true,
        disabled: false,

        onRippleAnimation: (animation, callback) => animation.start(callback),
    };

    constructor(props) {
        super(props);

        this.onLayout = this.onLayout.bind(this);
        this.onPress = this.onPress.bind(this);
        this.onPressIn = this.onPressIn.bind(this);
        this.onPressOut = this.onPressOut.bind(this);
        this.onLongPress = this.onLongPress.bind(this);
        this.onAnimationEnd = this.onAnimationEnd.bind(this);

        this.renderRipple = this.renderRipple.bind(this);

        this.unique = 0;
        this.mounted = false;

        this.state = {
            width: 0,
            height: 0,
            ripples: [],
        };
    }

    componentDidMount = () => (this.mounted = true);
    componentWillUnmount = () => (this.mounted = false);

    onLayout = (event) => {
        if (typeof this.props.onLayout === "function") this.props.onLayout(event);
        this.setState({
            width: event.nativeEvent.layout.width,
            height: event.nativeEvent.layout.height,
        });
    };

    onPress(event) {
        let { ripples } = this.state;
        let { onPress, rippleSequential } = this.props;

        if (!rippleSequential || !ripples.length) {
            if ("function" === typeof onPress) {
                requestAnimationFrame(() => onPress(event));
            }

            this.startRipple(event);
        }
    }

    onLongPress(event) {
        if (typeof this.props.onLongPress === "function")
            requestAnimationFrame(() => this.props.onLongPress(event));

        this.startRipple(event);
    }

    onPressIn = (event) =>
        typeof this.props.onPressIn === "function" && this.props.onPressIn(event);

    onPressOut = (event) =>
        typeof this.props.onPressOut === "function" && this.props.onPressOut(event);

    onAnimationEnd = () =>
        this.mounted && this.setState(({ ripples }) => ({ ripples: ripples.slice(1) }));

    startRipple(event) {
        let { width, height } = this.state;
        let { rippleDuration, rippleCentered, rippleSize, onRippleAnimation } =
            this.props;

        let w2 = 0.5 * width;
        let h2 = 0.5 * height;

        let { layerX, layerY } = rippleCentered
            ? { layerX: w2, layerY: h2 }
            : event.nativeEvent;

        let offsetX = Math.abs(w2 - layerX);
        let offsetY = Math.abs(h2 - layerY);

        let R =
            rippleSize > 0
                ? 0.5 * rippleSize
                : Math.sqrt(Math.pow(w2 + offsetX, 2) + Math.pow(h2 + offsetY, 2));

        let ripple = {
            unique: this.unique++,
            progress: new Animated.Value(0),
            layerX,
            layerY,
            R,
        };

        let animation = Animated.timing(ripple.progress, {
            toValue: 1,
            easing: Easing.out(Easing.ease),
            duration: rippleDuration,
            useNativeDriver: true,
        });

        onRippleAnimation(animation, this.onAnimationEnd);

        this.setState(({ ripples }) => ({ ripples: ripples.concat(ripple) }));
    }

    renderRipple({ unique, progress, layerX, layerY, R }) {
        let { rippleColor, rippleOpacity, rippleFades } = this.props;

        let rippleStyle = {
            top: layerY - radius,
            left: layerX - radius,
            backgroundColor: rippleColor,

            transform: [
                {
                    scale: progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.5 / radius, R / radius],
                    }),
                },
            ],

            opacity: rippleFades
                ? progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [rippleOpacity, 0],
                  })
                : rippleOpacity,
        };
        return <Animated.View style={[styles.ripple, rippleStyle]} key={unique} />;
    }

    render() {
        let { ripples } = this.state;
        let {
            delayLongPress,
            delayPressIn,
            delayPressOut,
            disabled,
            hitSlop,
            pressRetentionOffset,
            children,
            rippleContainerBorderRadius,
            testID,
            nativeID,
            accessible,
            accessibilityHint,
            accessibilityLabel,
            onPress,
            onLongPress,
            onLayout,
            onRippleAnimation,
            rippleColor,
            rippleOpacity,
            rippleDuration,
            rippleSize,
            rippleCentered,
            rippleSequential,
            rippleFades,
            ...props
        } = this.props;

        let touchableProps = {
            delayLongPress,
            delayPressIn,
            delayPressOut,
            disabled,
            hitSlop,
            pressRetentionOffset,
            testID,
            accessible,
            accessibilityHint,
            accessibilityLabel,
            onLayout: this.onLayout,
            onPress: this.onPress,
            onPressIn: this.onPressIn,
            onPressOut: this.onPressOut,
            onLongPress: onLongPress ? this.onLongPress : undefined,

            ...("web" !== Platform.OS ? { nativeID } : null),
        };

        let containerStyle = {
            borderRadius: rippleContainerBorderRadius,
        };

        return (
            <TouchableWithoutFeedback {...touchableProps}>
                <Animated.View {...props} pointerEvents="box-only">
                    {children}
                    <View style={[styles.container, containerStyle]}>
                        {ripples.map(this.renderRipple)}
                    </View>
                </Animated.View>
            </TouchableWithoutFeedback>
        );
    }
}

// export const TouchableRipple = ({ title, ...props }) => (
//     <View >
//         <Ripple {...props} />
//     </View>
// );
