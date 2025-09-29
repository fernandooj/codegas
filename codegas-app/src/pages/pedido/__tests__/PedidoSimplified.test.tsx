import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PedidoSimplified from '../PedidoSimplified';
import { Pedido, AccesoUsuario } from '../types';

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
    pedidoItem: {},
    pedidoHeader: {},
    pedidoInfo: {},
    pedidoNombre: {},
    pedidoEstado: {},
    pedidoValor: {},
    pedidoDetalles: {},
    pedidoDetalle: {},
    pedidoDetalleLabel: {},
    pedidoDetalleValue: {},
    pedidoActions: {},
    actionButton: {},
    actionButtonText: {},
    dangerButton: {},
    dangerButtonText: {},
    successButton: {},
    successButtonText: {}
  }
}));

describe('PedidoSimplified', () => {
  const mockOnPress = jest.fn();
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnChangeState = jest.fn();
  const mockOnAssignVehicle = jest.fn();
  const mockOnCancelOrder = jest.fn();
  const mockOnCloseOrder = jest.fn();
  const mockOnResetOrder = jest.fn();

  const mockPedido: Pedido = {
    _id: '123',
    usuarioid: '456',
    nombre: 'Test Pedido',
    razon_social: 'Empresa Test',
    cedula: '12345678',
    email: 'test@example.com',
    forma: 'cantidad',
    cantidad: 100,
    valor_total: 50000,
    estado: 'activo',
    entregado: false,
    fechasolicitud: '2023-01-01',
    fechaentrega: '2023-01-02',
    creado: '2023-01-01',
    usuariocrea: '789',
    observacion: 'Observación test',
    observacion_pedido: 'Observación pedido test',
    puntoid: 'P001',
    carroId: 'C001',
    placa: 'ABC123',
    conductor: 'John Doe',
    kilos: 100,
    factura: 'FAC001',
    remision: 'REM001',
    forma_pago: 'Efectivo',
    imagen: 'imagen.jpg',
    imagencerrar: 'imagen_cerrar.jpg',
    motivo_no_cierre: 'Motivo test',
    perfil_novedad: 'Perfil test',
    coordenadas: { x: 10, y: 20 },
    lat: 4.6097,
    lng: -74.0817,
    eliminado: false
  };

  const defaultProps = {
    pedido: mockPedido,
    onPress: mockOnPress,
    onEdit: mockOnEdit,
    onDelete: mockOnDelete,
    onChangeState: mockOnChangeState,
    onAssignVehicle: mockOnAssignVehicle,
    onCancelOrder: mockOnCancelOrder,
    onCloseOrder: mockOnCloseOrder,
    onResetOrder: mockOnResetOrder,
    acceso: 'admin' as AccesoUsuario,
    getEstadoColor: (estado: string) => '#000000',
    getEstadoBackgroundColor: (estado: string) => '#ffffff',
    showActions: true
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render pedido information correctly', () => {
      const { getByText } = render(<PedidoSimplified {...defaultProps} />);
      
      expect(getByText('Test Pedido')).toBeTruthy();
      expect(getByText('Empresa Test')).toBeTruthy();
      expect(getByText('12345678')).toBeTruthy();
      expect(getByText('test@example.com')).toBeTruthy();
      expect(getByText('activo')).toBeTruthy();
      expect(getByText('$50000')).toBeTruthy();
    });

    it('should display pedido details', () => {
      const { getByText } = render(<PedidoSimplified {...defaultProps} />);
      
      expect(getByText('Cantidad:')).toBeTruthy();
      expect(getByText('100')).toBeTruthy();
      expect(getByText('Fecha solicitud:')).toBeTruthy();
      expect(getByText('2023-01-01')).toBeTruthy();
      expect(getByText('Fecha entrega:')).toBeTruthy();
      expect(getByText('2023-01-02')).toBeTruthy();
    });

    it('should display vehicle information when available', () => {
      const { getByText } = render(<PedidoSimplified {...defaultProps} />);
      
      expect(getByText('Vehículo:')).toBeTruthy();
      expect(getByText('ABC123')).toBeTruthy();
      expect(getByText('Conductor:')).toBeTruthy();
      expect(getByText('John Doe')).toBeTruthy();
    });

    it('should display form information when available', () => {
      const { getByText } = render(<PedidoSimplified {...defaultProps} />);
      
      expect(getByText('Forma:')).toBeTruthy();
      expect(getByText('cantidad')).toBeTruthy();
      expect(getByText('Kilos:')).toBeTruthy();
      expect(getByText('100')).toBeTruthy();
    });
  });

  describe('User Interactions', () => {
    it('should call onPress when pedido is pressed', () => {
      const { getByTestId } = render(<PedidoSimplified {...defaultProps} />);
      
      const pedidoItem = getByTestId('pedido-item');
      fireEvent.press(pedidoItem);
      
      expect(mockOnPress).toHaveBeenCalledWith(mockPedido);
    });

    it('should call onEdit when edit button is pressed', () => {
      const { getByText } = render(<PedidoSimplified {...defaultProps} />);
      
      const editButton = getByText('Editar');
      fireEvent.press(editButton);
      
      expect(mockOnEdit).toHaveBeenCalledWith(mockPedido);
    });

    it('should call onDelete when delete button is pressed', () => {
      const { getByText } = render(<PedidoSimplified {...defaultProps} />);
      
      const deleteButton = getByText('Eliminar');
      fireEvent.press(deleteButton);
      
      expect(mockOnDelete).toHaveBeenCalledWith(mockPedido);
    });

    it('should call onChangeState when change state button is pressed', () => {
      const { getByText } = render(<PedidoSimplified {...defaultProps} />);
      
      const changeStateButton = getByText('Cambiar Estado');
      fireEvent.press(changeStateButton);
      
      expect(mockOnChangeState).toHaveBeenCalledWith(mockPedido);
    });

    it('should call onAssignVehicle when assign vehicle button is pressed', () => {
      const { getByText } = render(<PedidoSimplified {...defaultProps} />);
      
      const assignVehicleButton = getByText('Asignar Vehículo');
      fireEvent.press(assignVehicleButton);
      
      expect(mockOnAssignVehicle).toHaveBeenCalledWith(mockPedido);
    });

    it('should call onCancelOrder when cancel order button is pressed', () => {
      const { getByText } = render(<PedidoSimplified {...defaultProps} />);
      
      const cancelOrderButton = getByText('Cancelar Pedido');
      fireEvent.press(cancelOrderButton);
      
      expect(mockOnCancelOrder).toHaveBeenCalledWith(mockPedido);
    });

    it('should call onCloseOrder when close order button is pressed', () => {
      const { getByText } = render(<PedidoSimplified {...defaultProps} />);
      
      const closeOrderButton = getByText('Cerrar Pedido');
      fireEvent.press(closeOrderButton);
      
      expect(mockOnCloseOrder).toHaveBeenCalledWith(mockPedido);
    });

    it('should call onResetOrder when reset order button is pressed', () => {
      const { getByText } = render(<PedidoSimplified {...defaultProps} />);
      
      const resetOrderButton = getByText('Resetear Pedido');
      fireEvent.press(resetOrderButton);
      
      expect(mockOnResetOrder).toHaveBeenCalledWith(mockPedido);
    });
  });

  describe('Access Control', () => {
    it('should show all actions for admin access', () => {
      const { getByText } = render(
        <PedidoSimplified {...defaultProps} acceso="admin" />
      );
      
      expect(getByText('Editar')).toBeTruthy();
      expect(getByText('Eliminar')).toBeTruthy();
      expect(getByText('Cambiar Estado')).toBeTruthy();
      expect(getByText('Asignar Vehículo')).toBeTruthy();
      expect(getByText('Cancelar Pedido')).toBeTruthy();
      expect(getByText('Cerrar Pedido')).toBeTruthy();
      expect(getByText('Resetear Pedido')).toBeTruthy();
    });

    it('should show limited actions for conductor access', () => {
      const { getByText, queryByText } = render(
        <PedidoSimplified {...defaultProps} acceso="conductor" />
      );
      
      expect(getByText('Asignar Vehículo')).toBeTruthy();
      expect(queryByText('Editar')).toBeNull();
      expect(queryByText('Eliminar')).toBeNull();
      expect(queryByText('Cambiar Estado')).toBeNull();
      expect(queryByText('Cancelar Pedido')).toBeNull();
      expect(queryByText('Resetear Pedido')).toBeNull();
    });

    it('should show limited actions for cliente access', () => {
      const { queryByText } = render(
        <PedidoSimplified {...defaultProps} acceso="cliente" />
      );
      
      expect(queryByText('Editar')).toBeNull();
      expect(queryByText('Eliminar')).toBeNull();
      expect(queryByText('Cambiar Estado')).toBeNull();
      expect(queryByText('Asignar Vehículo')).toBeNull();
      expect(queryByText('Cancelar Pedido')).toBeNull();
      expect(queryByText('Resetear Pedido')).toBeNull();
    });

    it('should show limited actions for solucion access', () => {
      const { getByText, queryByText } = render(
        <PedidoSimplified {...defaultProps} acceso="solucion" />
      );
      
      expect(getByText('Asignar Vehículo')).toBeTruthy();
      expect(queryByText('Editar')).toBeNull();
      expect(queryByText('Eliminar')).toBeNull();
      expect(queryByText('Cambiar Estado')).toBeNull();
      expect(queryByText('Cancelar Pedido')).toBeNull();
      expect(queryByText('Resetear Pedido')).toBeNull();
    });

    it('should show limited actions for comercial access', () => {
      const { getByText, queryByText } = render(
        <PedidoSimplified {...defaultProps} acceso="comercial" />
      );
      
      expect(getByText('Asignar Vehículo')).toBeTruthy();
      expect(queryByText('Editar')).toBeNull();
      expect(queryByText('Eliminar')).toBeNull();
      expect(queryByText('Cambiar Estado')).toBeNull();
      expect(queryByText('Cancelar Pedido')).toBeNull();
      expect(queryByText('Resetear Pedido')).toBeNull();
    });

    it('should show limited actions for despacho access', () => {
      const { getByText, queryByText } = render(
        <PedidoSimplified {...defaultProps} acceso="despacho" />
      );
      
      expect(getByText('Asignar Vehículo')).toBeTruthy();
      expect(queryByText('Editar')).toBeNull();
      expect(queryByText('Eliminar')).toBeNull();
      expect(queryByText('Cambiar Estado')).toBeNull();
      expect(queryByText('Cancelar Pedido')).toBeNull();
      expect(queryByText('Resetear Pedido')).toBeNull();
    });
  });

  describe('Show Actions Control', () => {
    it('should show actions when showActions is true', () => {
      const { getByText } = render(
        <PedidoSimplified {...defaultProps} showActions={true} />
      );
      
      expect(getByText('Editar')).toBeTruthy();
      expect(getByText('Eliminar')).toBeTruthy();
    });

    it('should not show actions when showActions is false', () => {
      const { queryByText } = render(
        <PedidoSimplified {...defaultProps} showActions={false} />
      );
      
      expect(queryByText('Editar')).toBeNull();
      expect(queryByText('Eliminar')).toBeNull();
    });
  });

  describe('Estado Display', () => {
    it('should display estado with correct color', () => {
      const { getByText } = render(<PedidoSimplified {...defaultProps} />);
      
      expect(getByText('activo')).toBeTruthy();
    });

    it('should call getEstadoColor with correct estado', () => {
      const mockGetEstadoColor = jest.fn((estado: string) => '#000000');
      
      render(
        <PedidoSimplified 
          {...defaultProps} 
          getEstadoColor={mockGetEstadoColor} 
        />
      );
      
      expect(mockGetEstadoColor).toHaveBeenCalledWith('activo');
    });

    it('should call getEstadoBackgroundColor with correct estado', () => {
      const mockGetEstadoBackgroundColor = jest.fn((estado: string) => '#ffffff');
      
      render(
        <PedidoSimplified 
          {...defaultProps} 
          getEstadoBackgroundColor={mockGetEstadoBackgroundColor} 
        />
      );
      
      expect(mockGetEstadoBackgroundColor).toHaveBeenCalledWith('activo');
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing pedido data gracefully', () => {
      const emptyPedido: Pedido = {
        _id: '123',
        usuarioid: '456',
        nombre: '',
        razon_social: '',
        cedula: '',
        email: '',
        forma: 'cantidad',
        estado: 'activo',
        entregado: false,
        eliminado: false
      };

      const { getByText } = render(
        <PedidoSimplified {...defaultProps} pedido={emptyPedido} />
      );
      
      expect(getByText('activo')).toBeTruthy();
    });

    it('should handle undefined acceso', () => {
      const { getByText } = render(
        <PedidoSimplified {...defaultProps} acceso={undefined} />
      );
      
      expect(getByText('Test Pedido')).toBeTruthy();
    });

    it('should handle missing vehicle information', () => {
      const pedidoSinVehiculo: Pedido = {
        ...mockPedido,
        placa: undefined,
        conductor: undefined
      };

      const { queryByText } = render(
        <PedidoSimplified {...defaultProps} pedido={pedidoSinVehiculo} />
      );
      
      expect(queryByText('Vehículo:')).toBeNull();
      expect(queryByText('Conductor:')).toBeNull();
    });

    it('should handle missing form information', () => {
      const pedidoSinForma: Pedido = {
        ...mockPedido,
        forma: undefined,
        cantidad: undefined,
        kilos: undefined
      };

      const { queryByText } = render(
        <PedidoSimplified {...defaultProps} pedido={pedidoSinForma} />
      );
      
      expect(queryByText('Forma:')).toBeNull();
      expect(queryByText('Cantidad:')).toBeNull();
      expect(queryByText('Kilos:')).toBeNull();
    });
  });

  describe('Data Formatting', () => {
    it('should format currency values correctly', () => {
      const { getByText } = render(<PedidoSimplified {...defaultProps} />);
      
      expect(getByText('$50000')).toBeTruthy();
    });

    it('should format dates correctly', () => {
      const { getByText } = render(<PedidoSimplified {...defaultProps} />);
      
      expect(getByText('2023-01-01')).toBeTruthy();
      expect(getByText('2023-01-02')).toBeTruthy();
    });
  });

  describe('Layout Structure', () => {
    it('should have correct header structure', () => {
      const { getByText } = render(<PedidoSimplified {...defaultProps} />);
      
      expect(getByText('Test Pedido')).toBeTruthy();
      expect(getByText('Empresa Test')).toBeTruthy();
      expect(getByText('activo')).toBeTruthy();
      expect(getByText('$50000')).toBeTruthy();
    });

    it('should have correct details structure', () => {
      const { getByText } = render(<PedidoSimplified {...defaultProps} />);
      
      expect(getByText('Cantidad:')).toBeTruthy();
      expect(getByText('Fecha solicitud:')).toBeTruthy();
      expect(getByText('Fecha entrega:')).toBeTruthy();
    });

    it('should have correct actions structure when showActions is true', () => {
      const { getByText } = render(
        <PedidoSimplified {...defaultProps} showActions={true} />
      );
      
      expect(getByText('Editar')).toBeTruthy();
      expect(getByText('Eliminar')).toBeTruthy();
    });
  });
});
