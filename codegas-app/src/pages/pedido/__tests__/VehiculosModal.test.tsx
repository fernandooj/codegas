import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import VehiculosModal from '../VehiculosModal';
import { Vehiculo } from '../types';

// Mock de las dependencias
jest.mock('@react-native-vector-icons/fontawesome', () => 'FontAwesome');
jest.mock('react-native-calendars', () => ({
  Calendar: 'Calendar'
}));
jest.mock('moment', () => () => ({
  format: jest.fn(() => '2023-01-01'),
  add: jest.fn(() => ({
    format: jest.fn(() => '2023-01-02')
  }))
}));

jest.mock('../style', () => ({
  style: {
    modalContainer: {},
    modalContent: {},
    modalHeader: {},
    modalTitle: {},
    closeButton: {},
    calendarContainer: {},
    calendar: {},
    vehiculosList: {},
    vehiculoItem: {},
    vehiculoInfo: {},
    vehiculoPlaca: {},
    vehiculoConductor: {},
    vehiculoAvatar: {},
    selectButton: {},
    selectButtonText: {},
    selectedButton: {},
    selectedButtonText: {},
    dateButton: {},
    dateButtonText: {},
    saveButton: {},
    saveButtonText: {}
  }
}));

describe('VehiculosModal', () => {
  const mockOnClose = jest.fn();
  const mockOnToggleCalendar = jest.fn();
  const mockOnDateSelect = jest.fn();
  const mockOnSaveDate = jest.fn();
  const mockOnVehicleSelect = jest.fn();
  const mockOnAssignVehicle = jest.fn();

  const mockVehiculos: Vehiculo[] = [
    {
      _id: '1',
      placa: 'ABC123',
      conductor: {
        _id: '456',
        nombre: 'John Doe',
        avatar: 'avatar1.jpg'
      },
      activo: true
    },
    {
      _id: '2',
      placa: 'DEF456',
      conductor: {
        _id: '789',
        nombre: 'Jane Smith',
        avatar: 'avatar2.jpg'
      },
      activo: true
    },
    {
      _id: '3',
      placa: 'GHI789',
      conductor: undefined,
      activo: false
    }
  ];

  const defaultProps = {
    visible: true,
    onClose: mockOnClose,
    vehiculos: mockVehiculos,
    showCalendar: false,
    onToggleCalendar: mockOnToggleCalendar,
    fechaEntrega: '2023-01-01',
    onDateSelect: mockOnDateSelect,
    onSaveDate: mockOnSaveDate,
    idVehiculo: '1',
    placa: 'ABC123',
    onVehicleSelect: mockOnVehicleSelect,
    onAssignVehicle: mockOnAssignVehicle
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render modal when visible is true', () => {
      const { getByText } = render(<VehiculosModal {...defaultProps} />);
      
      expect(getByText('Asignar Vehículo')).toBeTruthy();
    });

    it('should not render modal when visible is false', () => {
      const { queryByText } = render(
        <VehiculosModal {...defaultProps} visible={false} />
      );
      
      expect(queryByText('Asignar Vehículo')).toBeNull();
    });

    it('should display vehiculos list correctly', () => {
      const { getByText } = render(<VehiculosModal {...defaultProps} />);
      
      expect(getByText('ABC123')).toBeTruthy();
      expect(getByText('John Doe')).toBeTruthy();
      expect(getByText('DEF456')).toBeTruthy();
      expect(getByText('Jane Smith')).toBeTruthy();
      expect(getByText('GHI789')).toBeTruthy();
    });

    it('should show calendar when showCalendar is true', () => {
      const { getByTestId } = render(
        <VehiculosModal {...defaultProps} showCalendar={true} />
      );
      
      expect(getByTestId('calendar')).toBeTruthy();
    });

    it('should not show calendar when showCalendar is false', () => {
      const { queryByTestId } = render(
        <VehiculosModal {...defaultProps} showCalendar={false} />
      );
      
      expect(queryByTestId('calendar')).toBeNull();
    });
  });

  describe('User Interactions', () => {
    it('should call onClose when close button is pressed', () => {
      const { getByTestId } = render(<VehiculosModal {...defaultProps} />);
      
      const closeButton = getByTestId('close-button');
      fireEvent.press(closeButton);
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call onToggleCalendar when date button is pressed', () => {
      const { getByText } = render(<VehiculosModal {...defaultProps} />);
      
      const dateButton = getByText('Seleccionar Fecha');
      fireEvent.press(dateButton);
      
      expect(mockOnToggleCalendar).toHaveBeenCalledWith(true);
    });

    it('should call onVehicleSelect when vehicle is selected', () => {
      const { getByText } = render(<VehiculosModal {...defaultProps} />);
      
      const selectButton = getByText('Seleccionar');
      fireEvent.press(selectButton);
      
      expect(mockOnVehicleSelect).toHaveBeenCalledWith(mockVehiculos[0]);
    });

    it('should call onAssignVehicle when assign button is pressed', () => {
      const { getByText } = render(<VehiculosModal {...defaultProps} />);
      
      const assignButton = getByText('Asignar');
      fireEvent.press(assignButton);
      
      expect(mockOnAssignVehicle).toHaveBeenCalledWith(mockVehiculos[0]);
    });

    it('should call onDateSelect when date is selected in calendar', () => {
      const { getByTestId } = render(
        <VehiculosModal {...defaultProps} showCalendar={true} />
      );
      
      const calendar = getByTestId('calendar');
      fireEvent(calendar, 'onDayPress', { dateString: '2023-01-15' });
      
      expect(mockOnDateSelect).toHaveBeenCalledWith('2023-01-15');
    });

    it('should call onSaveDate when save date button is pressed', () => {
      const { getByText } = render(
        <VehiculosModal {...defaultProps} showCalendar={true} />
      );
      
      const saveButton = getByText('Guardar Fecha');
      fireEvent.press(saveButton);
      
      expect(mockOnSaveDate).toHaveBeenCalledTimes(1);
    });
  });

  describe('Vehicle Selection', () => {
    it('should highlight selected vehicle', () => {
      const { getByText } = render(<VehiculosModal {...defaultProps} />);
      
      const selectedButton = getByText('Seleccionado');
      expect(selectedButton).toBeTruthy();
    });

    it('should show select button for non-selected vehicles', () => {
      const { getAllByText } = render(<VehiculosModal {...defaultProps} />);
      
      const selectButtons = getAllByText('Seleccionar');
      expect(selectButtons).toHaveLength(2); // Two non-selected vehicles
    });

    it('should handle vehicles without conductor', () => {
      const { getByText } = render(<VehiculosModal {...defaultProps} />);
      
      expect(getByText('GHI789')).toBeTruthy();
      expect(getByText('Sin conductor')).toBeTruthy();
    });

    it('should handle inactive vehicles', () => {
      const { getByText } = render(<VehiculosModal {...defaultProps} />);
      
      expect(getByText('GHI789')).toBeTruthy();
      // Inactive vehicles should still be displayed but might have different styling
    });
  });

  describe('Calendar Functionality', () => {
    it('should display current date as default', () => {
      const { getByText } = render(
        <VehiculosModal {...defaultProps} showCalendar={true} />
      );
      
      expect(getByText('2023-01-01')).toBeTruthy();
    });

    it('should handle date selection', () => {
      const { getByTestId } = render(
        <VehiculosModal {...defaultProps} showCalendar={true} />
      );
      
      const calendar = getByTestId('calendar');
      fireEvent(calendar, 'onDayPress', { dateString: '2023-01-15' });
      
      expect(mockOnDateSelect).toHaveBeenCalledWith('2023-01-15');
    });

    it('should show save button when calendar is visible', () => {
      const { getByText } = render(
        <VehiculosModal {...defaultProps} showCalendar={true} />
      );
      
      expect(getByText('Guardar Fecha')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty vehiculos array', () => {
      const { getByText } = render(
        <VehiculosModal {...defaultProps} vehiculos={[]} />
      );
      
      expect(getByText('Asignar Vehículo')).toBeTruthy();
      expect(getByText('No hay vehículos disponibles')).toBeTruthy();
    });

    it('should handle undefined vehiculos', () => {
      const { getByText } = render(
        <VehiculosModal {...defaultProps} vehiculos={undefined as any} />
      );
      
      expect(getByText('Asignar Vehículo')).toBeTruthy();
    });

    it('should handle missing fechaEntrega', () => {
      const { getByText } = render(
        <VehiculosModal {...defaultProps} fechaEntrega={undefined} />
      );
      
      expect(getByText('Asignar Vehículo')).toBeTruthy();
    });

    it('should handle missing idVehiculo and placa', () => {
      const { getByText } = render(
        <VehiculosModal 
          {...defaultProps} 
          idVehiculo={undefined} 
          placa={undefined} 
        />
      );
      
      expect(getByText('Asignar Vehículo')).toBeTruthy();
    });
  });

  describe('Vehicle Information Display', () => {
    it('should display vehicle placa correctly', () => {
      const { getByText } = render(<VehiculosModal {...defaultProps} />);
      
      expect(getByText('ABC123')).toBeTruthy();
      expect(getByText('DEF456')).toBeTruthy();
      expect(getByText('GHI789')).toBeTruthy();
    });

    it('should display conductor name when available', () => {
      const { getByText } = render(<VehiculosModal {...defaultProps} />);
      
      expect(getByText('John Doe')).toBeTruthy();
      expect(getByText('Jane Smith')).toBeTruthy();
    });

    it('should display "Sin conductor" when conductor is not available', () => {
      const { getByText } = render(<VehiculosModal {...defaultProps} />);
      
      expect(getByText('Sin conductor')).toBeTruthy();
    });

    it('should display conductor avatar when available', () => {
      const { getByTestId } = render(<VehiculosModal {...defaultProps} />);
      
      const avatars = getAllByTestId('conductor-avatar');
      expect(avatars).toHaveLength(2); // Two vehicles with conductors
    });
  });

  describe('Button States', () => {
    it('should show correct button text for selected vehicle', () => {
      const { getByText } = render(<VehiculosModal {...defaultProps} />);
      
      expect(getByText('Seleccionado')).toBeTruthy();
    });

    it('should show correct button text for non-selected vehicles', () => {
      const { getAllByText } = render(<VehiculosModal {...defaultProps} />);
      
      const selectButtons = getAllByText('Seleccionar');
      expect(selectButtons).toHaveLength(2);
    });

    it('should show assign button for selected vehicle', () => {
      const { getByText } = render(<VehiculosModal {...defaultProps} />);
      
      expect(getByText('Asignar')).toBeTruthy();
    });
  });

  describe('Modal Visibility', () => {
    it('should reset local state when modal becomes visible', () => {
      const { rerender } = render(
        <VehiculosModal {...defaultProps} visible={false} />
      );
      
      rerender(<VehiculosModal {...defaultProps} visible={true} />);
      
      // The component should reset its local state when becoming visible
      expect(mockOnToggleCalendar).not.toHaveBeenCalled();
    });
  });
});
