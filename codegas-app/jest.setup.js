// Jest setup file for React Native Testing Library
// Note: @testing-library/react-native v13+ includes matchers by default

// Mock para react-native-vector-icons
jest.mock('@react-native-vector-icons/fontawesome', () => ({
    FontAwesome: 'FontAwesome',
}));

// Mock para AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock para Firebase
jest.mock('@react-native-firebase/app', () => ({
    initializeApp: jest.fn(),
    getApps: jest.fn(() => []),
    getApp: jest.fn(),
}));

jest.mock('@react-native-firebase/messaging', () => ({
    getToken: jest.fn(() => Promise.resolve('mock-token')),
    onMessage: jest.fn(),
    setBackgroundMessageHandler: jest.fn(),
}));

// Mock para react-native-image-picker
jest.mock('react-native-image-picker', () => ({
    launchCamera: jest.fn(),
    launchImageLibrary: jest.fn(),
}));

// Mock para Navigation
jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        navigate: jest.fn(),
        goBack: jest.fn(),
    }),
    useFocusEffect: jest.fn(),
}));

// Silence the warning: Animated: `useNativeDriver` was not specified
// jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock para Toast
jest.mock('react-native-toast-message', () => ({
    show: jest.fn(),
    hide: jest.fn(),
}));

// Mock específico para Dimensions
const mockDimensions = {
    get: jest.fn(() => ({ width: 375, height: 812 })),
};

jest.doMock('react-native/Libraries/Utilities/Dimensions', () => mockDimensions);

global.__DEV__ = true;
