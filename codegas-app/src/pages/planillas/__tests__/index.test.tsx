import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import Planillas from '../index';
import { DataContext } from '../../../context/context';

// Mock dependencies
jest.mock('axios');
jest.mock('react-native-toast-message');

const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
};

const mockDataContext = {
    userId: '123',
    acceso: 'admin',
    nombre: 'Test User',
    email: 'test@example.com',
};

describe('Planillas Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (axios.get as jest.Mock).mockResolvedValue({
            data: {
                status: true,
                planillas: [],
            },
        });
    });

    it('should render component correctly', () => {
        const { getByText } = render(
            <NavigationContainer>
                <DataContext.Provider value={mockDataContext}>
                    <Planillas navigation={mockNavigation} />
                </DataContext.Provider>
            </NavigationContainer>
        );

        expect(getByText('Planillas')).toBeTruthy();
    });

    it('should show error for invalid access', () => {
        const invalidContext = {
            ...mockDataContext,
            acceso: 'cliente',
        };

        const { getByText } = render(
            <NavigationContainer>
                <DataContext.Provider value={invalidContext}>
                    <Planillas navigation={mockNavigation} />
                </DataContext.Provider>
            </NavigationContainer>
        );

        expect(getByText('No tienes acceso a esta sección')).toBeTruthy();
    });

    it('should load planillas on mount', async () => {
        (axios.get as jest.Mock).mockResolvedValue({
            data: {
                status: true,
                planillas: [
                    {
                        _id: '1',
                        ruta: 'Ruta 1',
                        guia: 'Guía 1',
                        user_id: 123,
                        gastos: [],
                    },
                ],
            },
        });

        render(
            <NavigationContainer>
                <DataContext.Provider value={mockDataContext}>
                    <Planillas navigation={mockNavigation} />
                </DataContext.Provider>
            </NavigationContainer>
        );

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith(
                expect.stringContaining('pla/planilla')
            );
        });
    });

    it('should open create modal when button is pressed', () => {
        const { getByText } = render(
            <NavigationContainer>
                <DataContext.Provider value={mockDataContext}>
                    <Planillas navigation={mockNavigation} />
                </DataContext.Provider>
            </NavigationContainer>
        );

        const createButton = getByText('Nueva');
        fireEvent.press(createButton);

        expect(getByText('Nueva Planilla')).toBeTruthy();
    });

    it('should filter planillas by search term', async () => {
        (axios.get as jest.Mock).mockResolvedValue({
            data: {
                status: true,
                planillas: [
                    {
                        _id: '1',
                        ruta: 'Ruta 1',
                        guia: 'Guía 1',
                        user_id: 123,
                        gastos: [],
                    },
                    {
                        _id: '2',
                        ruta: 'Ruta 2',
                        guia: 'Guía 2',
                        user_id: 123,
                        gastos: [],
                    },
                ],
            },
        });

        const { getByPlaceholderText, getByText } = render(
            <NavigationContainer>
                <DataContext.Provider value={mockDataContext}>
                    <Planillas navigation={mockNavigation} />
                </DataContext.Provider>
            </NavigationContainer>
        );

        await waitFor(() => {
            const searchInput = getByPlaceholderText('Buscar planillas...');
            fireEvent.changeText(searchInput, 'Ruta 1');
        });

        await waitFor(() => {
            expect(getByText(/Ruta 1/)).toBeTruthy();
        });
    });
});

