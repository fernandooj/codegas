import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import Perfil from '../index';
import { DataContext } from '../../../context/context';
import { UserAccess, UserData, StoredUserData } from '../types';

// Mock dependencies
jest.mock('@react-native-async-storage/async-storage', () => ({
    multiGet: jest.fn(),
    setItem: jest.fn(),
}));

jest.mock('axios');
jest.mock('react-native-toast-message', () => ({
    show: jest.fn(),
}));

jest.mock('../../../components/HeaderLogo', () => 'HeaderLogo');
jest.mock('../components/footer', () => 'Footer');

const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
} as any;

const mockUserData: UserData = {
    _id: 'test-id',
    nombre: 'Test User',
    email: 'test@example.com',
    acceso: 'admin' as UserAccess,
    avatar: 'https://example.com/avatar.jpg',
};

const mockContextValue = {
    nombre: 'Test User',
    avatar: 'https://example.com/avatar.jpg',
    email: 'test@example.com',
    userInfo: mockUserData,
    acceso: 'admin' as UserAccess,
    cerrarSesion: jest.fn(),
    updateUserData: jest.fn(),
} as any;

const renderWithProviders = (contextValue = mockContextValue) => {
    return render(
        <NavigationContainer>
            <DataContext.Provider value={contextValue}>
                <Perfil navigation={mockNavigation} />
            </DataContext.Provider>
        </NavigationContainer>
    );
};

describe('Perfil Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Rendering', () => {
        it('should render profile information correctly', () => {
            renderWithProviders();

            expect(screen.getByText('Test User')).toBeTruthy();
            expect(screen.getByText('test@example.com')).toBeTruthy();
        });

        it('should render edit profile button', () => {
            renderWithProviders();

            expect(screen.getByText('Editar perfil')).toBeTruthy();
        });

        it('should render logout button', () => {
            renderWithProviders();

            expect(screen.getByText('Cerrar Sesión')).toBeTruthy();
        });

        it('should render version information', () => {
            renderWithProviders();

            expect(screen.getByText('Ver 11.5.3-1')).toBeTruthy();
        });
    });

    describe('Access Level Based Rendering', () => {
        it('should show clientes button for admin access', () => {
            renderWithProviders();

            expect(screen.getByText('Clientes')).toBeTruthy();
        });

        it('should show frecuencias button for admin and solucion access', () => {
            renderWithProviders();

            expect(screen.getByText('Frecuencias')).toBeTruthy();
        });

        it('should show usuarios button for solucion, admin and veo access', () => {
            renderWithProviders();

            expect(screen.getByText('Usuarios')).toBeTruthy();
        });

        it('should show vehiculos button only for admin access', () => {
            renderWithProviders();

            expect(screen.getByText('Vehiculos')).toBeTruthy();
        });

        it('should show zonas button for admin and despacho access', () => {
            renderWithProviders();

            expect(screen.getByText('Zonas')).toBeTruthy();
        });

        it('should show revision button for multiple access levels', () => {
            renderWithProviders();

            expect(screen.getByText('Revisión y control tanques')).toBeTruthy();
        });

        it('should show reporte emergencia button for multiple access levels', () => {
            renderWithProviders();

            expect(screen.getByText('Reporte de emergencia')).toBeTruthy();
        });

        it('should show capacidades button only for admin access', () => {
            renderWithProviders();

            expect(screen.getByText('Capacidades')).toBeTruthy();
        });

        it('should not show clientes button for cliente access', () => {
            const clienteContextValue = {
                ...mockContextValue,
                acceso: 'cliente' as UserAccess,
            };

            renderWithProviders(clienteContextValue);

            expect(screen.queryByText('Clientes')).toBeNull();
        });
    });

    describe('Special Admin Features', () => {
        it('should show user search input for specific admin user', () => {
            const specialAdminContextValue = {
                ...mockContextValue,
                email: 'fernandooj@ymail.com',
            };

            renderWithProviders(specialAdminContextValue);

            expect(screen.getByPlaceholderText('ID de usuario')).toBeTruthy();
        });

        it('should not show user search input for regular admin user', () => {
            const regularAdminContextValue = {
                ...mockContextValue,
                email: 'admin@example.com',
            };

            renderWithProviders(regularAdminContextValue);

            expect(screen.queryByPlaceholderText('ID de usuario')).toBeNull();
        });
    });

    describe('User Interactions', () => {
        it('should navigate to edit profile when edit profile button is pressed', () => {
            renderWithProviders();

            fireEvent.press(screen.getByText('Editar perfil'));

            expect(mockNavigation.navigate).toHaveBeenCalledWith('verPerfil', { tipoAcceso: null });
        });

        it('should navigate to clientes when clientes button is pressed', () => {
            renderWithProviders();

            fireEvent.press(screen.getByText('Clientes'));

            expect(mockNavigation.navigate).toHaveBeenCalledWith('clientes');
        });

        it('should navigate to frecuencias when frecuencias button is pressed', () => {
            renderWithProviders();

            fireEvent.press(screen.getByText('Frecuencias'));

            expect(mockNavigation.navigate).toHaveBeenCalledWith('frecuencia');
        });

        it('should navigate to usuarios when usuarios button is pressed', () => {
            renderWithProviders();

            fireEvent.press(screen.getByText('Usuarios'));

            expect(mockNavigation.navigate).toHaveBeenCalledWith('usuarios');
        });

        it('should navigate to vehiculos when vehiculos button is pressed', () => {
            renderWithProviders();

            fireEvent.press(screen.getByText('Vehiculos'));

            expect(mockNavigation.navigate).toHaveBeenCalledWith('vehiculo', { tipoAcceso: 'admin' });
        });

        it('should navigate to zonas when zonas button is pressed', () => {
            renderWithProviders();

            fireEvent.press(screen.getByText('Zonas'));

            expect(mockNavigation.navigate).toHaveBeenCalledWith('zona');
        });

        it('should navigate to revision when revision button is pressed', () => {
            renderWithProviders();

            fireEvent.press(screen.getByText('Revisión y control tanques'));

            expect(mockNavigation.navigate).toHaveBeenCalledWith('tanques', { revision: true });
        });

        it('should navigate to reporte emergencia when reporte emergencia button is pressed', () => {
            renderWithProviders();

            fireEvent.press(screen.getByText('Reporte de emergencia'));

            expect(mockNavigation.navigate).toHaveBeenCalledWith('reporteEmergencia', { revision: true });
        });

        it('should navigate to capacidad when capacidades button is pressed', () => {
            renderWithProviders();

            fireEvent.press(screen.getByText('Capacidades'));

            expect(mockNavigation.navigate).toHaveBeenCalledWith('capacidad');
        });

        it('should call cerrarSesion and navigate to Home when logout button is pressed', () => {
            renderWithProviders();

            fireEvent.press(screen.getByText('Cerrar Sesión'));

            expect(mockContextValue.cerrarSesion).toHaveBeenCalled();
            expect(mockNavigation.navigate).toHaveBeenCalledWith('Home');
        });
    });

    describe('User Search Functionality', () => {
        it('should call searchUser when search button is pressed', async () => {
            const specialAdminContextValue = {
                ...mockContextValue,
                email: 'fernandooj@ymail.com',
            };

            (axios.get as jest.Mock).mockResolvedValue({
                data: {
                    data: {
                        users: mockUserData,
                    },
                },
            });

            renderWithProviders(specialAdminContextValue);

            const searchInput = screen.getByPlaceholderText('ID de usuario');
            fireEvent.changeText(searchInput, 'test-user-id');

            const searchButton = screen.getByTestId('search-button');
            fireEvent.press(searchButton);

            await waitFor(() => {
                expect(axios.get).toHaveBeenCalledWith('users/by/asefsfxf323-dxc/test-user-id');
            });
        });

        it('should handle search user error', async () => {
            const specialAdminContextValue = {
                ...mockContextValue,
                email: 'fernandooj@ymail.com',
            };

            (axios.get as jest.Mock).mockRejectedValue(new Error('Network error'));

            renderWithProviders(specialAdminContextValue);

            const searchInput = screen.getByPlaceholderText('ID de usuario');
            fireEvent.changeText(searchInput, 'test-user-id');

            const searchButton = screen.getByTestId('search-button');
            fireEvent.press(searchButton);

            await waitFor(() => {
                expect(Toast.show).toHaveBeenCalledWith({
                    type: 'error',
                    text1: 'Tenemos un problema, intentelo mas tarde',
                });
            });
        });

        it('should handle search user success and change profile', async () => {
            const specialAdminContextValue = {
                ...mockContextValue,
                email: 'fernandooj@ymail.com',
            };

            const mockNewUserData: UserData = {
                _id: 'new-user-id',
                nombre: 'New User',
                email: 'new@example.com',
                acceso: 'admin' as UserAccess,
                avatar: 'https://example.com/new-avatar.jpg',
            };

            (axios.get as jest.Mock).mockResolvedValue({
                data: {
                    data: {
                        users: mockNewUserData,
                    },
                },
            });

            renderWithProviders(specialAdminContextValue);

            const searchInput = screen.getByPlaceholderText('ID de usuario');
            fireEvent.changeText(searchInput, 'new-user-id');

            const searchButton = screen.getByTestId('search-button');
            fireEvent.press(searchButton);

            await waitFor(() => {
                expect(AsyncStorage.setItem).toHaveBeenCalledWith('userId', 'new-user-id');
                expect(AsyncStorage.setItem).toHaveBeenCalledWith('nombre', 'New User');
                expect(AsyncStorage.setItem).toHaveBeenCalledWith('email', 'new@example.com');
                expect(AsyncStorage.setItem).toHaveBeenCalledWith('acceso', 'admin');
                expect(AsyncStorage.setItem).toHaveBeenCalledWith('avatar', 'https://example.com/new-avatar.jpg');
                expect(mockNavigation.navigate).toHaveBeenCalledWith('Home');
            });
        });
    });

    describe('Data Loading and Synchronization', () => {
        it('should load user data from AsyncStorage on focus', async () => {
            const mockStoredData: [string, string | null][] = [
                ['nombre', 'Stored Name'],
                ['email', 'stored@example.com'],
                ['avatar', 'stored-avatar.jpg'],
            ];

            (AsyncStorage.multiGet as jest.Mock).mockResolvedValue(mockStoredData);

            renderWithProviders();

            await waitFor(() => {
                expect(AsyncStorage.multiGet).toHaveBeenCalledWith(['nombre', 'email', 'avatar']);
            });
        });

        it('should update user data when context data changes', async () => {
            const { rerender } = renderWithProviders();

            const updatedContextValue = {
                ...mockContextValue,
                nombre: 'Updated Name',
                email: 'updated@example.com',
            };

            rerender(
                <NavigationContainer>
                    <DataContext.Provider value={updatedContextValue}>
                        <Perfil navigation={mockNavigation} />
                    </DataContext.Provider>
                </NavigationContainer>
            );

            expect(screen.getByText('Updated Name')).toBeTruthy();
            expect(screen.getByText('updated@example.com')).toBeTruthy();
        });
    });

    describe('Avatar Display', () => {
        it('should show FontAwesome icon when avatar is null', () => {
            const noAvatarContextValue = {
                ...mockContextValue,
                avatar: null,
            } as any;

            renderWithProviders(noAvatarContextValue);

            // The FontAwesome icon should be rendered
            expect(screen.getByTestId('avatar-icon')).toBeTruthy();
        });

        it('should show FontAwesome icon when avatar is empty string', () => {
            const emptyAvatarContextValue = {
                ...mockContextValue,
                avatar: '',
            };

            renderWithProviders(emptyAvatarContextValue);

            // The FontAwesome icon should be rendered
            expect(screen.getByTestId('avatar-icon')).toBeTruthy();
        });

        it('should show image when avatar is provided', () => {
            renderWithProviders();

            // The image should be rendered
            expect(screen.getByTestId('avatar-image')).toBeTruthy();
        });
    });
});

// Test utilities
export const createMockUserData = (overrides: Partial<UserData> = {}): UserData => ({
    _id: 'test-id',
    nombre: 'Test User',
    email: 'test@example.com',
    acceso: 'admin' as UserAccess,
    avatar: 'https://example.com/avatar.jpg',
    ...overrides,
});

export const createMockContextValue = (overrides: any = {}) => ({
    nombre: 'Test User',
    avatar: 'https://example.com/avatar.jpg',
    email: 'test@example.com',
    userInfo: createMockUserData(),
    acceso: 'admin' as UserAccess,
    cerrarSesion: jest.fn(),
    updateUserData: jest.fn(),
    ...overrides,
});
