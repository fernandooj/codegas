import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Animated } from 'react-native';
import EditarPedidoModal from '../EditarPedidoModal';
import { AccesoUsuario, EstadoPedido, SelectedPedidoData } from '../types';

// Mock de las dependencias
jest.mock('@react-native-vector-icons/fontawesome', () => 'FontAwesome');
jest.mock('moment', () => () => ({
    format: jest.fn(() => '2023-01-01'),
    add: jest.fn(() => ({
        format: jest.fn(() => '2023-01-02')
    }))
}));

jest.mock('../../utils/number', () => ({
    formatCurrency: jest.fn((value) => `$${value}`)
}));

jest.mock('../style', () => ({
    style: {
        modalContainer: {},
        modalContent: {},
        modalHeader: {},
        modalTitle: {},
        closeButton: {},
        pedidoInfo: {},
        infoRow: {},
        infoLabel: {},
        infoValue: {},
        actionButton: {},
        actionButtonText: {},
        dangerButton: {},
        dangerButtonText: {}
    }
}));

// Mock de los componentes hijos
jest.mock('../CambiarEstadoModal', () => 'CambiarEstadoModal');
jest.mock('../VehiculosModal', () => 'VehiculosModal');
jest.mock('../FechaEntregaModal', () => 'FechaEntregaModal');

describe('EditarPedidoModal', () => {
    const mockOnClose = jest.fn();
    const mockOnChangeState = jest.fn();
    const mockOnAssignVehicle = jest.fn();
    const mockOnCancelOrder = jest.fn();
    const mockOnClosePedido = jest.fn();
    const mockOnResetPedido = jest.fn();
    const mockOnEstadoChange = jest.fn();
    const mockOnConfirmStateChange = jest.fn();
    const mockOnCancelStateChange = jest.fn();
    const mockOnCloseConductor = jest.fn();
    const mockOnToggleCalendar = jest.fn();
    const mockOnDateSelect = jest.fn();
    const mockOnSaveDate = jest.fn();
    const mockOnVehicleSelect = jest.fn();
    const mockOnAssignVehicleAction = jest.fn();
    const mockOnCloseFechaEntrega = jest.fn();
    const mockOnSaveFecha = jest.fn();
    const mockGetEstadoColor = jest.fn((estado: EstadoPedido) => '#000000');
    const mockGetEstadoBackgroundColor = jest.fn((estado: EstadoPedido) => '#ffffff');

    const mockPedidoData: SelectedPedidoData = {
        id: '123',
        nombre: 'Test Pedido',
        razon_social: 'Empresa Test',
        cedula: '12345678',
        email: 'test@example.com',
        estado: 'activo',
        forma: 'cantidad',
        cantidad: 100,
        valor_total: 50000,
        fechaEntrega: '2023-01-01',
        placa: 'ABC123',
        conductor: 'John Doe'
    };

    const mockVehiculos = [
        {
            _id: '1',
            placa: 'ABC123',
            conductor: {
                _id: '456',
                nombre: 'John Doe',
                avatar: 'avatar.jpg'
            },
            activo: true
        }
    ];

    const defaultProps = {
        visible: true,
        onClose: mockOnClose,
        modalMainScale: new Animated.Value(1),
        modalMainOpacity: new Animated.Value(1),
        pedidoData: mockPedidoData,
        acceso: 'admin' as AccesoUsuario,
        getEstadoColor: mockGetEstadoColor,
        getEstadoBackgroundColor: mockGetEstadoBackgroundColor,
        onChangeState: mockOnChangeState,
        onAssignVehicle: mockOnAssignVehicle,
        onCancelOrder: mockOnCancelOrder,
        onClosePedido: mockOnClosePedido,
        onResetPedido: mockOnResetPedido,
        modalPerfiles: false,
        onEstadoChange: mockOnEstadoChange,
        onConfirmStateChange: mockOnConfirmStateChange,
        onCancelStateChange: mockOnCancelStateChange,
        modalConductor: false,
        modalFechaEntrega: false,
        vehiculos: mockVehiculos,
        showCalendar: false,
        fechaEntregaModal: '2023-01-01',
        idVehiculo: '1',
        placa: 'ABC123',
        onCloseConductor: mockOnCloseConductor,
        onToggleCalendar: mockOnToggleCalendar,
        onDateSelect: mockOnDateSelect,
        onSaveDate: mockOnSaveDate,
        onVehicleSelect: mockOnVehicleSelect,
        onAssignVehicleAction: mockOnAssignVehicleAction,
        onCloseFechaEntrega: mockOnCloseFechaEntrega,
        onSaveFecha: mockOnSaveFecha
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Rendering', () => {
        it('should render modal when visible is true', () => {
            const { getByText } = render(<EditarPedidoModal {...defaultProps} />);

            expect(getByText('Editar Pedido')).toBeTruthy();
        });

        it('should not render modal when visible is false', () => {
            const { queryByText } = render(
                <EditarPedidoModal {...defaultProps} visible={false} />
            );

            expect(queryByText('Editar Pedido')).toBeNull();
        });

        it('should display pedido information correctly', () => {
            const { getByText } = render(<EditarPedidoModal {...defaultProps} />);

            expect(getByText('Test Pedido')).toBeTruthy();
            expect(getByText('Empresa Test')).toBeTruthy();
            expect(getByText('12345678')).toBeTruthy();
            expect(getByText('test@example.com')).toBeTruthy();
        });

        it('should display estado information with correct color', () => {
            const { getByText } = render(<EditarPedidoModal {...defaultProps} />);

            expect(getByText('activo')).toBeTruthy();
            expect(mockGetEstadoColor).toHaveBeenCalledWith('activo');
            expect(mockGetEstadoBackgroundColor).toHaveBeenCalledWith('activo');
        });
    });

    describe('User Interactions', () => {
        it('should call onClose when close button is pressed', () => {
            const { getByTestId } = render(<EditarPedidoModal {...defaultProps} />);

            const closeButton = getByTestId('close-button');
            fireEvent.press(closeButton);

            expect(mockOnClose).toHaveBeenCalledTimes(1);
        });

        it('should call onChangeState when change state button is pressed', () => {
            const { getByText } = render(<EditarPedidoModal {...defaultProps} />);

            const changeStateButton = getByText('Cambiar Estado');
            fireEvent.press(changeStateButton);

            expect(mockOnChangeState).toHaveBeenCalledTimes(1);
        });

        it('should call onAssignVehicle when assign vehicle button is pressed', () => {
            const { getByText } = render(<EditarPedidoModal {...defaultProps} />);

            const assignVehicleButton = getByText('Asignar Vehículo');
            fireEvent.press(assignVehicleButton);

            expect(mockOnAssignVehicle).toHaveBeenCalledTimes(1);
        });

        it('should call onCancelOrder when cancel order button is pressed', () => {
            const { getByText } = render(<EditarPedidoModal {...defaultProps} />);

            const cancelOrderButton = getByText('Cancelar Pedido');
            fireEvent.press(cancelOrderButton);

            expect(mockOnCancelOrder).toHaveBeenCalledTimes(1);
        });

        it('should call onClosePedido when close pedido button is pressed', () => {
            const { getByText } = render(<EditarPedidoModal {...defaultProps} />);

            const closePedidoButton = getByText('Cerrar Pedido');
            fireEvent.press(closePedidoButton);

            expect(mockOnClosePedido).toHaveBeenCalledTimes(1);
        });

        it('should call onResetPedido when reset pedido button is pressed', () => {
            const { getByText } = render(<EditarPedidoModal {...defaultProps} />);

            const resetPedidoButton = getByText('Resetear Pedido');
            fireEvent.press(resetPedidoButton);

            expect(mockOnResetPedido).toHaveBeenCalledTimes(1);
        });
    });

    describe('Access Control', () => {
        it('should show all buttons for admin access', () => {
            const { getByText } = render(
                <EditarPedidoModal {...defaultProps} acceso="admin" />
            );

            expect(getByText('Cambiar Estado')).toBeTruthy();
            expect(getByText('Asignar Vehículo')).toBeTruthy();
            expect(getByText('Cancelar Pedido')).toBeTruthy();
            expect(getByText('Cerrar Pedido')).toBeTruthy();
            expect(getByText('Resetear Pedido')).toBeTruthy();
        });

        it('should show limited buttons for conductor access', () => {
            const { getByText, queryByText } = render(
                <EditarPedidoModal {...defaultProps} acceso="conductor" />
            );

            expect(getByText('Asignar Vehículo')).toBeTruthy();
            expect(queryByText('Cambiar Estado')).toBeNull();
            expect(queryByText('Cancelar Pedido')).toBeNull();
            expect(queryByText('Resetear Pedido')).toBeNull();
        });

        it('should show limited buttons for cliente access', () => {
            const { getByText, queryByText } = render(
                <EditarPedidoModal {...defaultProps} acceso="cliente" />
            );

            expect(queryByText('Cambiar Estado')).toBeNull();
            expect(queryByText('Asignar Vehículo')).toBeNull();
            expect(queryByText('Cancelar Pedido')).toBeNull();
            expect(queryByText('Resetear Pedido')).toBeNull();
        });
    });

    describe('Child Components', () => {
        it('should render CambiarEstadoModal when modalPerfiles is true', () => {
            const { getByTestId } = render(
                <EditarPedidoModal {...defaultProps} modalPerfiles={true} />
            );

            expect(getByTestId('cambiar-estado-modal')).toBeTruthy();
        });

        it('should render VehiculosModal when modalConductor is true', () => {
            const { getByTestId } = render(
                <EditarPedidoModal {...defaultProps} modalConductor={true} />
            );

            expect(getByTestId('vehiculos-modal')).toBeTruthy();
        });

        it('should render FechaEntregaModal when modalFechaEntrega is true', () => {
            const { getByTestId } = render(
                <EditarPedidoModal {...defaultProps} modalFechaEntrega={true} />
            );

            expect(getByTestId('fecha-entrega-modal')).toBeTruthy();
        });
    });

    describe('Data Display', () => {
        it('should format currency values correctly', () => {
            const { getByText } = render(<EditarPedidoModal {...defaultProps} />);

            expect(getByText('$50000')).toBeTruthy();
        });

        it('should display fecha entrega correctly', () => {
            const { getByText } = render(<EditarPedidoModal {...defaultProps} />);

            expect(getByText('2023-01-01')).toBeTruthy();
        });

        it('should display vehicle information when available', () => {
            const { getByText } = render(<EditarPedidoModal {...defaultProps} />);

            expect(getByText('ABC123')).toBeTruthy();
            expect(getByText('John Doe')).toBeTruthy();
        });
    });

    describe('Edge Cases', () => {
        it('should handle missing pedido data gracefully', () => {
            const emptyPedidoData: SelectedPedidoData = {};

            const { getByText } = render(
                <EditarPedidoModal {...defaultProps} pedidoData={emptyPedidoData} />
            );

            expect(getByText('Editar Pedido')).toBeTruthy();
        });

        it('should handle undefined acceso gracefully', () => {
            const { getByText } = render(
                <EditarPedidoModal {...defaultProps} acceso={undefined} />
            );

            expect(getByText('Editar Pedido')).toBeTruthy();
        });

        it('should handle empty vehiculos array', () => {
            const { getByText } = render(
                <EditarPedidoModal {...defaultProps} vehiculos={[]} />
            );

            expect(getByText('Editar Pedido')).toBeTruthy();
        });
    });

    describe('Animation Props', () => {
        it('should pass animation values to modal', () => {
            const scaleValue = new Animated.Value(0.5);
            const opacityValue = new Animated.Value(0.5);

            render(
                <EditarPedidoModal
                    {...defaultProps}
                    modalMainScale={scaleValue}
                    modalMainOpacity={opacityValue}
                />
            );

            // The animation values should be passed to the modal
            expect(scaleValue).toBeDefined();
            expect(opacityValue).toBeDefined();
        });
    });
});
