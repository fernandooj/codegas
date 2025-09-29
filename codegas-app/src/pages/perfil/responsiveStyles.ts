import { Dimensions, Platform } from 'react-native';

// Screen dimensions
export const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Device detection
export const isIPhone = Platform.OS === 'ios';
export const isIPhoneX = isIPhone && (screenHeight >= 812 || screenWidth >= 812);
export const isIPhoneMax = isIPhone && screenHeight >= 896;
export const isIPhone12ProMax = isIPhone && screenHeight >= 926;

// Responsive values
export const getResponsiveValue = (small: number, medium: number, large: number): number => {
    if (screenWidth >= 428) return large; // iPhone 12 Pro Max and larger
    if (screenWidth >= 414) return medium; // iPhone 12 Pro and similar
    return small; // Default and smaller devices
};

export const getResponsivePadding = (): number => {
    return getResponsiveValue(20, 30, 35);
};

export const getResponsiveMargin = (): number => {
    return getResponsiveValue(6, 8, 10);
};

export const getResponsiveFontSize = (baseSize: number): number => {
    const multiplier = screenWidth >= 428 ? 1.2 : screenWidth >= 414 ? 1.1 : 1;
    return Math.round(baseSize * multiplier);
};

export const getResponsiveAvatarSize = (): number => {
    return getResponsiveValue(60, 70, 75);
};

export const getResponsiveBottomMargin = (): number => {
    if (isIPhone12ProMax) return 110;
    if (isIPhoneMax) return 100;
    return 80;
};

// Safe area helpers
export const getSafeAreaInsets = () => {
    return {
        top: isIPhoneX ? 44 : 20,
        bottom: isIPhoneX ? 34 : 0,
    };
};

// Screen size categories
export const screenSize = {
    isSmall: screenWidth < 414,
    isMedium: screenWidth >= 414 && screenWidth < 428,
    isLarge: screenWidth >= 428,
};

// Responsive style helpers
export const responsiveStyles = {
    container: {
        paddingHorizontal: getResponsivePadding(),
    },
    avatar: {
        size: getResponsiveAvatarSize(),
        borderRadius: getResponsiveAvatarSize() / 2,
    },
    text: {
        fontSize: (baseSize: number) => getResponsiveFontSize(baseSize),
    },
    spacing: {
        margin: getResponsiveMargin(),
        padding: getResponsivePadding(),
    },
};
