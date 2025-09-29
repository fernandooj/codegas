import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import NovedadModal from '../NovedadModal';

// Mock de las dependencias
jest.mock('@react-native-vector-icons/fontawesome', () => 'FontAwesome');

// Mock de Alert
jest.spyOn(Alert, 'alert');

describe('NovedadModal', () => {
  const mockOnClose = jest.fn();
  const mockOnNovedadChange = jest.fn();
  const mockOnSave = jest.fn();

  const defaultProps = {
    visible: true,
    onClose: mockOnClose,
    novedad: '',
    onNovedadChange: mockOnNovedadChange,
    onSave: mockOnSave
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render modal when visible is true', () => {
      const { getByText } = render(<NovedadModal {...defaultProps} />);
      
      expect(getByText('Agregar Novedad')).toBeTruthy();
    });

    it('should not render modal when visible is false', () => {
      const { queryByText } = render(
        <NovedadModal {...defaultProps} visible={false} />
      );
      
      expect(queryByText('Agregar Novedad')).toBeNull();
    });

    it('should display input field with placeholder', () => {
      const { getByPlaceholderText } = render(<NovedadModal {...defaultProps} />);
      
      expect(getByPlaceholderText('Escriba la novedad aquí...')).toBeTruthy();
    });

    it('should display existing novedad value', () => {
      const { getByDisplayValue } = render(
        <NovedadModal {...defaultProps} novedad="Test novedad" />
      );
      
      expect(getByDisplayValue('Test novedad')).toBeTruthy();
    });

    it('should display action buttons', () => {
      const { getByText } = render(<NovedadModal {...defaultProps} />);
      
      expect(getByText('Guardar')).toBeTruthy();
      expect(getByText('Cancelar')).toBeTruthy();
    });
  });

  describe('User Interactions', () => {
    it('should call onClose when close button is pressed', () => {
      const { getByTestId } = render(<NovedadModal {...defaultProps} />);
      
      const closeButton = getByTestId('close-button');
      fireEvent.press(closeButton);
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call onNovedadChange when text input changes', () => {
      const { getByPlaceholderText } = render(<NovedadModal {...defaultProps} />);
      
      const input = getByPlaceholderText('Escriba la novedad aquí...');
      fireEvent.changeText(input, 'Nueva novedad');
      
      expect(mockOnNovedadChange).toHaveBeenCalledWith('Nueva novedad');
    });

    it('should call onSave when save button is pressed with valid text', async () => {
      const { getByText, getByPlaceholderText } = render(
        <NovedadModal {...defaultProps} novedad="Test novedad" />
      );
      
      const saveButton = getByText('Guardar');
      fireEvent.press(saveButton);
      
      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledTimes(1);
      });
    });

    it('should call onClose when cancel button is pressed', () => {
      const { getByText } = render(<NovedadModal {...defaultProps} />);
      
      const cancelButton = getByText('Cancelar');
      fireEvent.press(cancelButton);
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should show alert when save button is pressed with empty text', async () => {
      const { getByText } = render(<NovedadModal {...defaultProps} novedad="" />);
      
      const saveButton = getByText('Guardar');
      fireEvent.press(saveButton);
      
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Error',
          'Por favor ingrese una novedad'
        );
      });
    });

    it('should show alert when save button is pressed with whitespace only', async () => {
      const { getByText } = render(<NovedadModal {...defaultProps} novedad="   " />);
      
      const saveButton = getByText('Guardar');
      fireEvent.press(saveButton);
      
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Error',
          'Por favor ingrese una novedad'
        );
      });
    });
  });

  describe('Text Input Behavior', () => {
    it('should handle multiline text input', () => {
      const { getByPlaceholderText } = render(<NovedadModal {...defaultProps} />);
      
      const input = getByPlaceholderText('Escriba la novedad aquí...');
      const multilineText = 'Línea 1\nLínea 2\nLínea 3';
      
      fireEvent.changeText(input, multilineText);
      
      expect(mockOnNovedadChange).toHaveBeenCalledWith(multilineText);
    });

    it('should handle special characters in input', () => {
      const { getByPlaceholderText } = render(<NovedadModal {...defaultProps} />);
      
      const input = getByPlaceholderText('Escriba la novedad aquí...');
      const specialText = 'Novedad con @#$%^&*()_+{}|:"<>?[]\\;\',./';
      
      fireEvent.changeText(input, specialText);
      
      expect(mockOnNovedadChange).toHaveBeenCalledWith(specialText);
    });

    it('should handle long text input', () => {
      const { getByPlaceholderText } = render(<NovedadModal {...defaultProps} />);
      
      const input = getByPlaceholderText('Escriba la novedad aquí...');
      const longText = 'A'.repeat(1000);
      
      fireEvent.changeText(input, longText);
      
      expect(mockOnNovedadChange).toHaveBeenCalledWith(longText);
    });
  });

  describe('Validation', () => {
    it('should validate empty string', async () => {
      const { getByText } = render(<NovedadModal {...defaultProps} novedad="" />);
      
      const saveButton = getByText('Guardar');
      fireEvent.press(saveButton);
      
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Error',
          'Por favor ingrese una novedad'
        );
      });
    });

    it('should validate whitespace only string', async () => {
      const { getByText } = render(<NovedadModal {...defaultProps} novedad="   " />);
      
      const saveButton = getByText('Guardar');
      fireEvent.press(saveButton);
      
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Error',
          'Por favor ingrese una novedad'
        );
      });
    });

    it('should validate newline only string', async () => {
      const { getByText } = render(<NovedadModal {...defaultProps} novedad="\n\n\n" />);
      
      const saveButton = getByText('Guardar');
      fireEvent.press(saveButton);
      
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Error',
          'Por favor ingrese una novedad'
        );
      });
    });

    it('should allow valid text with leading/trailing spaces', async () => {
      const { getByText } = render(
        <NovedadModal {...defaultProps} novedad="  Valid text  " />
      );
      
      const saveButton = getByText('Guardar');
      fireEvent.press(saveButton);
      
      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Modal Behavior', () => {
    it('should handle onRequestClose', () => {
      const { getByTestId } = render(<NovedadModal {...defaultProps} />);
      
      const modal = getByTestId('modal');
      fireEvent(modal, 'onRequestClose');
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should have correct animation type', () => {
      const { getByTestId } = render(<NovedadModal {...defaultProps} />);
      
      const modal = getByTestId('modal');
      expect(modal.props.animationType).toBe('slide');
    });

    it('should be transparent', () => {
      const { getByTestId } = render(<NovedadModal {...defaultProps} />);
      
      const modal = getByTestId('modal');
      expect(modal.props.transparent).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined novedad', () => {
      const { getByText } = render(
        <NovedadModal {...defaultProps} novedad={undefined as any} />
      );
      
      expect(getByText('Agregar Novedad')).toBeTruthy();
    });

    it('should handle null novedad', () => {
      const { getByText } = render(
        <NovedadModal {...defaultProps} novedad={null as any} />
      );
      
      expect(getByText('Agregar Novedad')).toBeTruthy();
    });

    it('should handle very long novedad text', () => {
      const longText = 'A'.repeat(10000);
      const { getByDisplayValue } = render(
        <NovedadModal {...defaultProps} novedad={longText} />
      );
      
      expect(getByDisplayValue(longText)).toBeTruthy();
    });
  });

  describe('Button States', () => {
    it('should show save button as enabled', () => {
      const { getByText } = render(<NovedadModal {...defaultProps} />);
      
      const saveButton = getByText('Guardar');
      expect(saveButton).toBeTruthy();
    });

    it('should show cancel button as enabled', () => {
      const { getByText } = render(<NovedadModal {...defaultProps} />);
      
      const cancelButton = getByText('Cancelar');
      expect(cancelButton).toBeTruthy();
    });
  });

  describe('Layout Structure', () => {
    it('should have correct header structure', () => {
      const { getByText } = render(<NovedadModal {...defaultProps} />);
      
      expect(getByText('Agregar Novedad')).toBeTruthy();
    });

    it('should have correct input structure', () => {
      const { getByPlaceholderText } = render(<NovedadModal {...defaultProps} />);
      
      expect(getByPlaceholderText('Escriba la novedad aquí...')).toBeTruthy();
    });

    it('should have correct button structure', () => {
      const { getByText } = render(<NovedadModal {...defaultProps} />);
      
      expect(getByText('Guardar')).toBeTruthy();
      expect(getByText('Cancelar')).toBeTruthy();
    });
  });
});
