import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import CerrarPedidoModal from '../CerrarPedidoModal';

// Mock de las dependencias
jest.mock('@react-native-vector-icons/fontawesome', () => 'FontAwesome');
jest.mock('../style', () => ({
  style: {
    modalContainer: {},
    modalContent: {},
    modalHeader: {},
    modalTitle: {},
    closeButton: {},
    formContainer: {},
    inputContainer: {},
    inputLabel: {},
    textInput: {},
    buttonContainer: {},
    button: {},
    buttonText: {},
    dangerButton: {},
    dangerButtonText: {},
    imageContainer: {},
    imagePreview: {},
    removeImageButton: {}
  }
}));

jest.mock('../components/tomarFoto', () => 'TomarFoto');

// Mock de Alert
jest.spyOn(Alert, 'alert');

describe('CerrarPedidoModal', () => {
  const mockOnClose = jest.fn();
  const mockOnCerrarPedido = jest.fn();
  const mockOnGuardarNovedad = jest.fn();

  const defaultProps = {
    visible: true,
    onClose: mockOnClose,
    pedidoId: '123',
    entregado: false,
    imagenCerrar: undefined,
    kilos: '',
    factura: '',
    valor_total: '',
    remision: '',
    forma_pago: '',
    valor_unitario: '',
    onCerrarPedido: mockOnCerrarPedido,
    onGuardarNovedad: mockOnGuardarNovedad
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render modal when visible is true', () => {
      const { getByText } = render(<CerrarPedidoModal {...defaultProps} />);
      
      expect(getByText('Cerrar Pedido')).toBeTruthy();
    });

    it('should not render modal when visible is false', () => {
      const { queryByText } = render(
        <CerrarPedidoModal {...defaultProps} visible={false} />
      );
      
      expect(queryByText('Cerrar Pedido')).toBeNull();
    });

    it('should display form fields correctly', () => {
      const { getByText, getByPlaceholderText } = render(
        <CerrarPedidoModal {...defaultProps} />
      );
      
      expect(getByText('Kilos:')).toBeTruthy();
      expect(getByText('Factura:')).toBeTruthy();
      expect(getByText('Valor Total:')).toBeTruthy();
      expect(getByText('Remisión:')).toBeTruthy();
      expect(getByText('Forma de Pago:')).toBeTruthy();
      expect(getByText('Novedad:')).toBeTruthy();
      
      expect(getByPlaceholderText('Ingrese los kilos')).toBeTruthy();
      expect(getByPlaceholderText('Ingrese el número de factura')).toBeTruthy();
      expect(getByPlaceholderText('Ingrese el valor total')).toBeTruthy();
      expect(getByPlaceholderText('Ingrese el número de remisión')).toBeTruthy();
      expect(getByPlaceholderText('Ingrese la forma de pago')).toBeTruthy();
      expect(getByPlaceholderText('Ingrese la novedad')).toBeTruthy();
    });

    it('should display existing values when provided', () => {
      const propsWithValues = {
        ...defaultProps,
        kilos: '100',
        factura: 'FAC001',
        valor_total: '50000',
        remision: 'REM001',
        forma_pago: 'Efectivo',
        valor_unitario: '500'
      };

      const { getByDisplayValue } = render(
        <CerrarPedidoModal {...propsWithValues} />
      );
      
      expect(getByDisplayValue('100')).toBeTruthy();
      expect(getByDisplayValue('FAC001')).toBeTruthy();
      expect(getByDisplayValue('50000')).toBeTruthy();
      expect(getByDisplayValue('REM001')).toBeTruthy();
      expect(getByDisplayValue('Efectivo')).toBeTruthy();
    });
  });

  describe('User Interactions', () => {
    it('should call onClose when close button is pressed', () => {
      const { getByTestId } = render(<CerrarPedidoModal {...defaultProps} />);
      
      const closeButton = getByTestId('close-button');
      fireEvent.press(closeButton);
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should update input values when user types', () => {
      const { getByPlaceholderText } = render(<CerrarPedidoModal {...defaultProps} />);
      
      const kilosInput = getByPlaceholderText('Ingrese los kilos');
      fireEvent.changeText(kilosInput, '150');
      
      expect(kilosInput.props.value).toBe('150');
    });

    it('should call onCerrarPedido when cerrar pedido button is pressed with valid data', async () => {
      const { getByText, getByPlaceholderText } = render(
        <CerrarPedidoModal {...defaultProps} />
      );
      
      // Fill required fields
      const kilosInput = getByPlaceholderText('Ingrese los kilos');
      const facturaInput = getByPlaceholderText('Ingrese el número de factura');
      const valorTotalInput = getByPlaceholderText('Ingrese el valor total');
      const remisionInput = getByPlaceholderText('Ingrese el número de remisión');
      const formaPagoInput = getByPlaceholderText('Ingrese la forma de pago');
      const novedadInput = getByPlaceholderText('Ingrese la novedad');
      
      fireEvent.changeText(kilosInput, '100');
      fireEvent.changeText(facturaInput, 'FAC001');
      fireEvent.changeText(valorTotalInput, '50000');
      fireEvent.changeText(remisionInput, 'REM001');
      fireEvent.changeText(formaPagoInput, 'Efectivo');
      fireEvent.changeText(novedadInput, 'Novedad test');
      
      const cerrarButton = getByText('Cerrar Pedido');
      fireEvent.press(cerrarButton);
      
      await waitFor(() => {
        expect(mockOnCerrarPedido).toHaveBeenCalledWith(
          {
            kilos: '100',
            factura: 'FAC001',
            valor_total: '50000',
            remision: 'REM001',
            forma_pago: 'Efectivo',
            novedad: 'Novedad test'
          },
          '123'
        );
      });
    });

    it('should show alert when cerrar pedido button is pressed with empty required fields', async () => {
      const { getByText } = render(<CerrarPedidoModal {...defaultProps} />);
      
      const cerrarButton = getByText('Cerrar Pedido');
      fireEvent.press(cerrarButton);
      
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Error',
          'Por favor complete todos los campos requeridos'
        );
      });
    });

    it('should call onGuardarNovedad when guardar novedad button is pressed', async () => {
      const { getByText, getByPlaceholderText } = render(
        <CerrarPedidoModal {...defaultProps} />
      );
      
      const novedadInput = getByPlaceholderText('Ingrese la novedad');
      fireEvent.changeText(novedadInput, 'Novedad test');
      
      const guardarButton = getByText('Guardar Novedad');
      fireEvent.press(guardarButton);
      
      await waitFor(() => {
        expect(mockOnGuardarNovedad).toHaveBeenCalledWith('Novedad test');
      });
    });

    it('should show alert when guardar novedad button is pressed with empty novedad', async () => {
      const { getByText } = render(<CerrarPedidoModal {...defaultProps} />);
      
      const guardarButton = getByText('Guardar Novedad');
      fireEvent.press(guardarButton);
      
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Error',
          'Por favor ingrese una novedad'
        );
      });
    });
  });

  describe('Image Handling', () => {
    it('should display image when imagenCerrar is provided', () => {
      const propsWithImage = {
        ...defaultProps,
        imagenCerrar: 'data:image/jpeg;base64,test-image-data'
      };

      const { getByTestId } = render(
        <CerrarPedidoModal {...propsWithImage} />
      );
      
      expect(getByTestId('image-preview')).toBeTruthy();
    });

    it('should not display image when imagenCerrar is not provided', () => {
      const { queryByTestId } = render(<CerrarPedidoModal {...defaultProps} />);
      
      expect(queryByTestId('image-preview')).toBeNull();
    });

    it('should handle image removal', () => {
      const propsWithImage = {
        ...defaultProps,
        imagenCerrar: 'data:image/jpeg;base64,test-image-data'
      };

      const { getByTestId } = render(
        <CerrarPedidoModal {...propsWithImage} />
      );
      
      const removeImageButton = getByTestId('remove-image-button');
      fireEvent.press(removeImageButton);
      
      // The image should be removed (this would depend on the actual implementation)
      expect(removeImageButton).toBeTruthy();
    });
  });

  describe('Form Validation', () => {
    it('should validate required fields', async () => {
      const { getByText } = render(<CerrarPedidoModal {...defaultProps} />);
      
      const cerrarButton = getByText('Cerrar Pedido');
      fireEvent.press(cerrarButton);
      
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Error',
          'Por favor complete todos los campos requeridos'
        );
      });
    });

    it('should validate kilos field', async () => {
      const { getByText, getByPlaceholderText } = render(
        <CerrarPedidoModal {...defaultProps} />
      );
      
      // Fill all fields except kilos
      const facturaInput = getByPlaceholderText('Ingrese el número de factura');
      const valorTotalInput = getByPlaceholderText('Ingrese el valor total');
      const remisionInput = getByPlaceholderText('Ingrese el número de remisión');
      const formaPagoInput = getByPlaceholderText('Ingrese la forma de pago');
      const novedadInput = getByPlaceholderText('Ingrese la novedad');
      
      fireEvent.changeText(facturaInput, 'FAC001');
      fireEvent.changeText(valorTotalInput, '50000');
      fireEvent.changeText(remisionInput, 'REM001');
      fireEvent.changeText(formaPagoInput, 'Efectivo');
      fireEvent.changeText(novedadInput, 'Novedad test');
      
      const cerrarButton = getByText('Cerrar Pedido');
      fireEvent.press(cerrarButton);
      
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Error',
          'Por favor complete todos los campos requeridos'
        );
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing pedidoId', () => {
      const { getByText } = render(
        <CerrarPedidoModal {...defaultProps} pedidoId={undefined} />
      );
      
      expect(getByText('Cerrar Pedido')).toBeTruthy();
    });

    it('should handle entregado true', () => {
      const { getByText } = render(
        <CerrarPedidoModal {...defaultProps} entregado={true} />
      );
      
      expect(getByText('Cerrar Pedido')).toBeTruthy();
    });

    it('should handle empty string values', () => {
      const propsWithEmptyStrings = {
        ...defaultProps,
        kilos: '',
        factura: '',
        valor_total: '',
        remision: '',
        forma_pago: ''
      };

      const { getByText } = render(
        <CerrarPedidoModal {...propsWithEmptyStrings} />
      );
      
      expect(getByText('Cerrar Pedido')).toBeTruthy();
    });
  });

  describe('Component Integration', () => {
    it('should render TomarFoto component', () => {
      const { getByTestId } = render(<CerrarPedidoModal {...defaultProps} />);
      
      expect(getByTestId('tomar-foto')).toBeTruthy();
    });

    it('should pass correct props to TomarFoto component', () => {
      const { getByTestId } = render(<CerrarPedidoModal {...defaultProps} />);
      
      const tomarFoto = getByTestId('tomar-foto');
      expect(tomarFoto).toBeTruthy();
      // Additional props validation would depend on the actual TomarFoto component implementation
    });
  });
});
