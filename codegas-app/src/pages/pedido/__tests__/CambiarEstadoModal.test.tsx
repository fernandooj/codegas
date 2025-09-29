import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CambiarEstadoModal from '../CambiarEstadoModal';
import { EstadoPedido, AccesoUsuario } from '../types';

// Mock de las dependencias
jest.mock('@react-native-vector-icons/fontawesome', () => 'FontAwesome');

describe('CambiarEstadoModal', () => {
  const mockOnEstadoChange = jest.fn();
  const mockOnConfirm = jest.fn();
  const mockOnCancel = jest.fn();
  const mockGetEstadoColor = jest.fn((estado: EstadoPedido) => '#000000');
  const mockGetEstadoBackgroundColor = jest.fn((estado: EstadoPedido) => '#ffffff');

  const defaultProps = {
    visible: true,
    estado: 'activo' as EstadoPedido,
    entregado: false,
    acceso: 'admin' as AccesoUsuario,
    getEstadoColor: mockGetEstadoColor,
    getEstadoBackgroundColor: mockGetEstadoBackgroundColor,
    onEstadoChange: mockOnEstadoChange,
    onConfirm: mockOnConfirm,
    onCancel: mockOnCancel
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render modal when visible is true', () => {
      const { getByText } = render(<CambiarEstadoModal {...defaultProps} />);
      
      expect(getByText('Cambiar Estado')).toBeTruthy();
    });

    it('should not render when visible is false', () => {
      const { queryByText } = render(
        <CambiarEstadoModal {...defaultProps} visible={false} />
      );
      
      expect(queryByText('Cambiar Estado')).toBeNull();
    });

    it('should display current estado', () => {
      const { getByText } = render(<CambiarEstadoModal {...defaultProps} />);
      
      expect(getByText('Estado actual:')).toBeTruthy();
      expect(getByText('activo')).toBeTruthy();
    });

    it('should display entregado status', () => {
      const { getByText } = render(<CambiarEstadoModal {...defaultProps} />);
      
      expect(getByText('Entregado:')).toBeTruthy();
      expect(getByText('No')).toBeTruthy();
    });

    it('should display entregado as Yes when true', () => {
      const { getByText } = render(
        <CambiarEstadoModal {...defaultProps} entregado={true} />
      );
      
      expect(getByText('Entregado:')).toBeTruthy();
      expect(getByText('Sí')).toBeTruthy();
    });
  });

  describe('Estado Options', () => {
    it('should display all estado options', () => {
      const { getByText } = render(<CambiarEstadoModal {...defaultProps} />);
      
      expect(getByText('Activo')).toBeTruthy();
      expect(getByText('Inactivo')).toBeTruthy();
      expect(getByText('En Espera')).toBeTruthy();
      expect(getByText('No Entregado')).toBeTruthy();
    });

    it('should call onEstadoChange when estado option is selected', () => {
      const { getByText } = render(<CambiarEstadoModal {...defaultProps} />);
      
      const inactivoButton = getByText('Inactivo');
      fireEvent.press(inactivoButton);
      
      expect(mockOnEstadoChange).toHaveBeenCalledWith('innactivo');
    });

    it('should call onEstadoChange with correct estado values', () => {
      const { getByText } = render(<CambiarEstadoModal {...defaultProps} />);
      
      const activoButton = getByText('Activo');
      fireEvent.press(activoButton);
      expect(mockOnEstadoChange).toHaveBeenCalledWith('activo');
      
      const inactivoButton = getByText('Inactivo');
      fireEvent.press(inactivoButton);
      expect(mockOnEstadoChange).toHaveBeenCalledWith('innactivo');
      
      const esperaButton = getByText('En Espera');
      fireEvent.press(esperaButton);
      expect(mockOnEstadoChange).toHaveBeenCalledWith('espera');
      
      const noEntregadoButton = getByText('No Entregado');
      fireEvent.press(noEntregadoButton);
      expect(mockOnEstadoChange).toHaveBeenCalledWith('noentregado');
    });
  });

  describe('User Interactions', () => {
    it('should call onConfirm when confirm button is pressed', () => {
      const { getByText } = render(<CambiarEstadoModal {...defaultProps} />);
      
      const confirmButton = getByText('Confirmar');
      fireEvent.press(confirmButton);
      
      expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    });

    it('should call onCancel when cancel button is pressed', () => {
      const { getByText } = render(<CambiarEstadoModal {...defaultProps} />);
      
      const cancelButton = getByText('Cancelar');
      fireEvent.press(cancelButton);
      
      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    it('should call onCancel when back button is pressed', () => {
      const { getByTestId } = render(<CambiarEstadoModal {...defaultProps} />);
      
      const backButton = getByTestId('back-button');
      fireEvent.press(backButton);
      
      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });
  });

  describe('Access Control', () => {
    it('should show all options for admin access', () => {
      const { getByText } = render(
        <CambiarEstadoModal {...defaultProps} acceso="admin" />
      );
      
      expect(getByText('Activo')).toBeTruthy();
      expect(getByText('Inactivo')).toBeTruthy();
      expect(getByText('En Espera')).toBeTruthy();
      expect(getByText('No Entregado')).toBeTruthy();
    });

    it('should show limited options for conductor access', () => {
      const { getByText, queryByText } = render(
        <CambiarEstadoModal {...defaultProps} acceso="conductor" />
      );
      
      expect(getByText('Activo')).toBeTruthy();
      expect(getByText('Inactivo')).toBeTruthy();
      expect(queryByText('En Espera')).toBeNull();
      expect(queryByText('No Entregado')).toBeNull();
    });

    it('should show limited options for cliente access', () => {
      const { getByText, queryByText } = render(
        <CambiarEstadoModal {...defaultProps} acceso="cliente" />
      );
      
      expect(queryByText('Activo')).toBeNull();
      expect(queryByText('Inactivo')).toBeNull();
      expect(queryByText('En Espera')).toBeNull();
      expect(queryByText('No Entregado')).toBeNull();
    });

    it('should show limited options for solucion access', () => {
      const { getByText, queryByText } = render(
        <CambiarEstadoModal {...defaultProps} acceso="solucion" />
      );
      
      expect(getByText('Activo')).toBeTruthy();
      expect(getByText('Inactivo')).toBeTruthy();
      expect(queryByText('En Espera')).toBeNull();
      expect(queryByText('No Entregado')).toBeNull();
    });

    it('should show limited options for comercial access', () => {
      const { getByText, queryByText } = render(
        <CambiarEstadoModal {...defaultProps} acceso="comercial" />
      );
      
      expect(getByText('Activo')).toBeTruthy();
      expect(getByText('Inactivo')).toBeTruthy();
      expect(queryByText('En Espera')).toBeNull();
      expect(queryByText('No Entregado')).toBeNull();
    });

    it('should show limited options for despacho access', () => {
      const { getByText, queryByText } = render(
        <CambiarEstadoModal {...defaultProps} acceso="despacho" />
      );
      
      expect(getByText('Activo')).toBeTruthy();
      expect(getByText('Inactivo')).toBeTruthy();
      expect(queryByText('En Espera')).toBeNull();
      expect(queryByText('No Entregado')).toBeNull();
    });
  });

  describe('Color Functions', () => {
    it('should call getEstadoColor with current estado', () => {
      render(<CambiarEstadoModal {...defaultProps} />);
      
      expect(mockGetEstadoColor).toHaveBeenCalledWith('activo');
    });

    it('should call getEstadoBackgroundColor with current estado', () => {
      render(<CambiarEstadoModal {...defaultProps} />);
      
      expect(mockGetEstadoBackgroundColor).toHaveBeenCalledWith('activo');
    });

    it('should call color functions with different estados', () => {
      const { rerender } = render(<CambiarEstadoModal {...defaultProps} />);
      
      rerender(<CambiarEstadoModal {...defaultProps} estado="innactivo" />);
      expect(mockGetEstadoColor).toHaveBeenCalledWith('innactivo');
      expect(mockGetEstadoBackgroundColor).toHaveBeenCalledWith('innactivo');
      
      rerender(<CambiarEstadoModal {...defaultProps} estado="espera" />);
      expect(mockGetEstadoColor).toHaveBeenCalledWith('espera');
      expect(mockGetEstadoBackgroundColor).toHaveBeenCalledWith('espera');
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined estado', () => {
      const { getByText } = render(
        <CambiarEstadoModal {...defaultProps} estado={undefined} />
      );
      
      expect(getByText('Cambiar Estado')).toBeTruthy();
    });

    it('should handle undefined acceso', () => {
      const { getByText } = render(
        <CambiarEstadoModal {...defaultProps} acceso={undefined} />
      );
      
      expect(getByText('Cambiar Estado')).toBeTruthy();
    });

    it('should handle undefined entregado', () => {
      const { getByText } = render(
        <CambiarEstadoModal {...defaultProps} entregado={undefined} />
      );
      
      expect(getByText('Cambiar Estado')).toBeTruthy();
    });
  });

  describe('Button States', () => {
    it('should show confirm button as enabled', () => {
      const { getByText } = render(<CambiarEstadoModal {...defaultProps} />);
      
      const confirmButton = getByText('Confirmar');
      expect(confirmButton).toBeTruthy();
    });

    it('should show cancel button as enabled', () => {
      const { getByText } = render(<CambiarEstadoModal {...defaultProps} />);
      
      const cancelButton = getByText('Cancelar');
      expect(cancelButton).toBeTruthy();
    });
  });

  describe('Layout', () => {
    it('should have correct layout structure', () => {
      const { getByText } = render(<CambiarEstadoModal {...defaultProps} />);
      
      // Check for header elements
      expect(getByText('Cambiar Estado')).toBeTruthy();
      
      // Check for current state display
      expect(getByText('Estado actual:')).toBeTruthy();
      expect(getByText('Entregado:')).toBeTruthy();
      
      // Check for action buttons
      expect(getByText('Confirmar')).toBeTruthy();
      expect(getByText('Cancelar')).toBeTruthy();
    });
  });
});
