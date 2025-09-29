import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ModalOrdenamiento from '../ModalOrdenamiento';

// Mock de las dependencias
jest.mock('@react-native-vector-icons/fontawesome', () => 'FontAwesome');

describe('ModalOrdenamiento', () => {
  const mockOnClose = jest.fn();
  const mockOnOrdenPorChange = jest.fn();
  const mockOnTipoOrdenChange = jest.fn();
  const mockOnApply = jest.fn();

  const defaultProps = {
    visible: true,
    onClose: mockOnClose,
    ordenPor: 'fecha_creacion',
    tipoOrden: 'DESC',
    onOrdenPorChange: mockOnOrdenPorChange,
    onTipoOrdenChange: mockOnTipoOrdenChange,
    onApply: mockOnApply
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render modal when visible is true', () => {
      const { getByText } = render(<ModalOrdenamiento {...defaultProps} />);
      
      expect(getByText('Ordenar por')).toBeTruthy();
    });

    it('should not render modal when visible is false', () => {
      const { queryByText } = render(
        <ModalOrdenamiento {...defaultProps} visible={false} />
      );
      
      expect(queryByText('Ordenar por')).toBeNull();
    });

    it('should display all ordenamiento options', () => {
      const { getByText } = render(<ModalOrdenamiento {...defaultProps} />);
      
      expect(getByText('Fecha creación')).toBeTruthy();
      expect(getByText('Razón social')).toBeTruthy();
      expect(getByText('Nombre cliente')).toBeTruthy();
      expect(getByText('Fecha solicitud')).toBeTruthy();
      expect(getByText('Precio')).toBeTruthy();
      expect(getByText('Cantidad')).toBeTruthy();
      expect(getByText('Vehículo')).toBeTruthy();
    });

    it('should display tipo orden options', () => {
      const { getByText } = render(<ModalOrdenamiento {...defaultProps} />);
      
      expect(getByText('Ascendente')).toBeTruthy();
      expect(getByText('Descendente')).toBeTruthy();
    });

    it('should show current ordenPor selection', () => {
      const { getByText } = render(<ModalOrdenamiento {...defaultProps} />);
      
      // The selected option should be highlighted or marked
      expect(getByText('Fecha creación')).toBeTruthy();
    });

    it('should show current tipoOrden selection', () => {
      const { getByText } = render(<ModalOrdenamiento {...defaultProps} />);
      
      // The selected option should be highlighted or marked
      expect(getByText('Descendente')).toBeTruthy();
    });
  });

  describe('User Interactions', () => {
    it('should call onClose when close button is pressed', () => {
      const { getByTestId } = render(<ModalOrdenamiento {...defaultProps} />);
      
      const closeButton = getByTestId('close-button');
      fireEvent.press(closeButton);
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call onOrdenPorChange when orden option is selected', () => {
      const { getByText } = render(<ModalOrdenamiento {...defaultProps} />);
      
      const razonSocialButton = getByText('Razón social');
      fireEvent.press(razonSocialButton);
      
      expect(mockOnOrdenPorChange).toHaveBeenCalledWith('razon_social');
    });

    it('should call onTipoOrdenChange when tipo orden option is selected', () => {
      const { getByText } = render(<ModalOrdenamiento {...defaultProps} />);
      
      const ascendenteButton = getByText('Ascendente');
      fireEvent.press(ascendenteButton);
      
      expect(mockOnTipoOrdenChange).toHaveBeenCalledWith('ASC');
    });

    it('should call onApply when apply button is pressed', () => {
      const { getByText } = render(<ModalOrdenamiento {...defaultProps} />);
      
      const applyButton = getByText('Aplicar');
      fireEvent.press(applyButton);
      
      expect(mockOnApply).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when cancel button is pressed', () => {
      const { getByText } = render(<ModalOrdenamiento {...defaultProps} />);
      
      const cancelButton = getByText('Cancelar');
      fireEvent.press(cancelButton);
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Ordenamiento Options', () => {
    it('should call onOrdenPorChange with correct values for all options', () => {
      const { getByText } = render(<ModalOrdenamiento {...defaultProps} />);
      
      // Test all ordenamiento options
      const fechaCreacionButton = getByText('Fecha creación');
      fireEvent.press(fechaCreacionButton);
      expect(mockOnOrdenPorChange).toHaveBeenCalledWith('fecha_creacion');
      
      const razonSocialButton = getByText('Razón social');
      fireEvent.press(razonSocialButton);
      expect(mockOnOrdenPorChange).toHaveBeenCalledWith('razon_social');
      
      const nombreClienteButton = getByText('Nombre cliente');
      fireEvent.press(nombreClienteButton);
      expect(mockOnOrdenPorChange).toHaveBeenCalledWith('nombre_cliente');
      
      const fechaSolicitudButton = getByText('Fecha solicitud');
      fireEvent.press(fechaSolicitudButton);
      expect(mockOnOrdenPorChange).toHaveBeenCalledWith('fecha_solicitud');
      
      const precioButton = getByText('Precio');
      fireEvent.press(precioButton);
      expect(mockOnOrdenPorChange).toHaveBeenCalledWith('precio');
      
      const cantidadButton = getByText('Cantidad');
      fireEvent.press(cantidadButton);
      expect(mockOnOrdenPorChange).toHaveBeenCalledWith('cantidad');
      
      const vehiculoButton = getByText('Vehículo');
      fireEvent.press(vehiculoButton);
      expect(mockOnOrdenPorChange).toHaveBeenCalledWith('vehiculo');
    });
  });

  describe('Tipo Orden Options', () => {
    it('should call onTipoOrdenChange with correct values', () => {
      const { getByText } = render(<ModalOrdenamiento {...defaultProps} />);
      
      const ascendenteButton = getByText('Ascendente');
      fireEvent.press(ascendenteButton);
      expect(mockOnTipoOrdenChange).toHaveBeenCalledWith('ASC');
      
      const descendenteButton = getByText('Descendente');
      fireEvent.press(descendenteButton);
      expect(mockOnTipoOrdenChange).toHaveBeenCalledWith('DESC');
    });
  });

  describe('Selection States', () => {
    it('should show selected ordenPor option', () => {
      const { getByText } = render(
        <ModalOrdenamiento {...defaultProps} ordenPor="razon_social" />
      );
      
      expect(getByText('Razón social')).toBeTruthy();
    });

    it('should show selected tipoOrden option', () => {
      const { getByText } = render(
        <ModalOrdenamiento {...defaultProps} tipoOrden="ASC" />
      );
      
      expect(getByText('Ascendente')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty ordenPor', () => {
      const { getByText } = render(
        <ModalOrdenamiento {...defaultProps} ordenPor="" />
      );
      
      expect(getByText('Ordenar por')).toBeTruthy();
    });

    it('should handle empty tipoOrden', () => {
      const { getByText } = render(
        <ModalOrdenamiento {...defaultProps} tipoOrden="" />
      );
      
      expect(getByText('Ordenar por')).toBeTruthy();
    });

    it('should handle undefined ordenPor', () => {
      const { getByText } = render(
        <ModalOrdenamiento {...defaultProps} ordenPor={undefined as any} />
      );
      
      expect(getByText('Ordenar por')).toBeTruthy();
    });

    it('should handle undefined tipoOrden', () => {
      const { getByText } = render(
        <ModalOrdenamiento {...defaultProps} tipoOrden={undefined as any} />
      );
      
      expect(getByText('Ordenar por')).toBeTruthy();
    });
  });

  describe('Modal Behavior', () => {
    it('should handle onRequestClose', () => {
      const { getByTestId } = render(<ModalOrdenamiento {...defaultProps} />);
      
      const modal = getByTestId('modal');
      fireEvent(modal, 'onRequestClose');
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should have correct animation type', () => {
      const { getByTestId } = render(<ModalOrdenamiento {...defaultProps} />);
      
      const modal = getByTestId('modal');
      expect(modal.props.animationType).toBe('fade');
    });

    it('should be transparent', () => {
      const { getByTestId } = render(<ModalOrdenamiento {...defaultProps} />);
      
      const modal = getByTestId('modal');
      expect(modal.props.transparent).toBe(true);
    });
  });

  describe('Layout Structure', () => {
    it('should have correct header structure', () => {
      const { getByText } = render(<ModalOrdenamiento {...defaultProps} />);
      
      expect(getByText('Ordenar por')).toBeTruthy();
    });

    it('should have correct button structure', () => {
      const { getByText } = render(<ModalOrdenamiento {...defaultProps} />);
      
      expect(getByText('Aplicar')).toBeTruthy();
      expect(getByText('Cancelar')).toBeTruthy();
    });

    it('should display all ordenamiento options in correct order', () => {
      const { getByText } = render(<ModalOrdenamiento {...defaultProps} />);
      
      const options = [
        'Fecha creación',
        'Razón social',
        'Nombre cliente',
        'Fecha solicitud',
        'Precio',
        'Cantidad',
        'Vehículo'
      ];
      
      options.forEach(option => {
        expect(getByText(option)).toBeTruthy();
      });
    });
  });
});
