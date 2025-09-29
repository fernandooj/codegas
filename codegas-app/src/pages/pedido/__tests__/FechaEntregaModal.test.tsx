import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import FechaEntregaModal from '../FechaEntregaModal';

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
    buttonContainer: {},
    button: {},
    buttonText: {}
  }
}));

// Mock de Alert
jest.spyOn(Alert, 'alert');

describe('FechaEntregaModal', () => {
  const mockOnClose = jest.fn();
  const mockOnDateSelect = jest.fn();
  const mockOnSave = jest.fn();

  const defaultProps = {
    visible: true,
    onClose: mockOnClose,
    fechaEntrega: '2023-01-01',
    onDateSelect: mockOnDateSelect,
    onSave: mockOnSave
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render modal when visible is true', () => {
      const { getByText } = render(<FechaEntregaModal {...defaultProps} />);
      
      expect(getByText('Seleccionar Fecha de Entrega')).toBeTruthy();
    });

    it('should not render when visible is false', () => {
      const { queryByText } = render(
        <FechaEntregaModal {...defaultProps} visible={false} />
      );
      
      expect(queryByText('Seleccionar Fecha de Entrega')).toBeNull();
    });

    it('should display calendar component', () => {
      const { getByTestId } = render(<FechaEntregaModal {...defaultProps} />);
      
      expect(getByTestId('calendar')).toBeTruthy();
    });

    it('should display current date', () => {
      const { getByText } = render(<FechaEntregaModal {...defaultProps} />);
      
      expect(getByText('2023-01-01')).toBeTruthy();
    });
  });

  describe('User Interactions', () => {
    it('should call onClose when close button is pressed', () => {
      const { getByTestId } = render(<FechaEntregaModal {...defaultProps} />);
      
      const closeButton = getByTestId('close-button');
      fireEvent.press(closeButton);
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call onDateSelect and onClose when date is selected', async () => {
      const { getByTestId } = render(<FechaEntregaModal {...defaultProps} />);
      
      const calendar = getByTestId('calendar');
      fireEvent(calendar, 'onDayPress', { dateString: '2023-01-15' });
      
      expect(mockOnDateSelect).toHaveBeenCalledWith('2023-01-15');
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call onSave after date selection with delay', async () => {
      const { getByTestId } = render(<FechaEntregaModal {...defaultProps} />);
      
      const calendar = getByTestId('calendar');
      fireEvent(calendar, 'onDayPress', { dateString: '2023-01-15' });
      
      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledTimes(1);
      }, { timeout: 500 });
    });

    it('should show alert after date selection', async () => {
      const { getByTestId } = render(<FechaEntregaModal {...defaultProps} />);
      
      const calendar = getByTestId('calendar');
      fireEvent(calendar, 'onDayPress', { dateString: '2023-01-15' });
      
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Fecha guardada',
          'Fecha de entrega actualizada: 15/01/2023',
          [{ text: 'OK' }]
        );
      }, { timeout: 500 });
    });
  });

  describe('Date Selection', () => {
    it('should handle different date formats', async () => {
      const { getByTestId } = render(<FechaEntregaModal {...defaultProps} />);
      
      const calendar = getByTestId('calendar');
      const testDates = ['2023-01-15', '2023-12-31', '2024-02-29'];
      
      for (const date of testDates) {
        fireEvent(calendar, 'onDayPress', { dateString: date });
        
        expect(mockOnDateSelect).toHaveBeenCalledWith(date);
        expect(mockOnClose).toHaveBeenCalled();
        
        // Reset mocks for next iteration
        jest.clearAllMocks();
      }
    });

    it('should handle past dates', async () => {
      const { getByTestId } = render(<FechaEntregaModal {...defaultProps} />);
      
      const calendar = getByTestId('calendar');
      fireEvent(calendar, 'onDayPress', { dateString: '2022-12-31' });
      
      expect(mockOnDateSelect).toHaveBeenCalledWith('2022-12-31');
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should handle future dates', async () => {
      const { getByTestId } = render(<FechaEntregaModal {...defaultProps} />);
      
      const calendar = getByTestId('calendar');
      fireEvent(calendar, 'onDayPress', { dateString: '2024-12-31' });
      
      expect(mockOnDateSelect).toHaveBeenCalledWith('2024-12-31');
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Calendar Configuration', () => {
    it('should pass correct props to calendar', () => {
      const { getByTestId } = render(<FechaEntregaModal {...defaultProps} />);
      
      const calendar = getByTestId('calendar');
      expect(calendar).toBeTruthy();
    });

    it('should handle calendar day press events', () => {
      const { getByTestId } = render(<FechaEntregaModal {...defaultProps} />);
      
      const calendar = getByTestId('calendar');
      const mockDay = { dateString: '2023-01-15' };
      
      fireEvent(calendar, 'onDayPress', mockDay);
      
      expect(mockOnDateSelect).toHaveBeenCalledWith('2023-01-15');
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined fechaEntrega', () => {
      const { getByText } = render(
        <FechaEntregaModal {...defaultProps} fechaEntrega={undefined} />
      );
      
      expect(getByText('Seleccionar Fecha de Entrega')).toBeTruthy();
    });

    it('should handle empty fechaEntrega', () => {
      const { getByText } = render(
        <FechaEntregaModal {...defaultProps} fechaEntrega="" />
      );
      
      expect(getByText('Seleccionar Fecha de Entrega')).toBeTruthy();
    });

    it('should handle invalid date format', async () => {
      const { getByTestId } = render(<FechaEntregaModal {...defaultProps} />);
      
      const calendar = getByTestId('calendar');
      fireEvent(calendar, 'onDayPress', { dateString: 'invalid-date' });
      
      expect(mockOnDateSelect).toHaveBeenCalledWith('invalid-date');
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Modal Behavior', () => {
    it('should handle onRequestClose', () => {
      const { getByTestId } = render(<FechaEntregaModal {...defaultProps} />);
      
      const modal = getByTestId('modal');
      fireEvent(modal, 'onRequestClose');
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should have correct animation type', () => {
      const { getByTestId } = render(<FechaEntregaModal {...defaultProps} />);
      
      const modal = getByTestId('modal');
      expect(modal.props.animationType).toBe('slide');
    });

    it('should be transparent', () => {
      const { getByTestId } = render(<FechaEntregaModal {...defaultProps} />);
      
      const modal = getByTestId('modal');
      expect(modal.props.transparent).toBe(true);
    });
  });

  describe('Alert Functionality', () => {
    it('should show success alert with formatted date', async () => {
      const { getByTestId } = render(<FechaEntregaModal {...defaultProps} />);
      
      const calendar = getByTestId('calendar');
      fireEvent(calendar, 'onDayPress', { dateString: '2023-01-15' });
      
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Fecha guardada',
          'Fecha de entrega actualizada: 15/01/2023',
          [{ text: 'OK' }]
        );
      }, { timeout: 500 });
    });

    it('should show alert with different date formats', async () => {
      const { getByTestId } = render(<FechaEntregaModal {...defaultProps} />);
      
      const calendar = getByTestId('calendar');
      fireEvent(calendar, 'onDayPress', { dateString: '2023-12-25' });
      
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Fecha guardada',
          'Fecha de entrega actualizada: 25/12/2023',
          [{ text: 'OK' }]
        );
      }, { timeout: 500 });
    });
  });

  describe('Layout Structure', () => {
    it('should have correct header structure', () => {
      const { getByText } = render(<FechaEntregaModal {...defaultProps} />);
      
      expect(getByText('Seleccionar Fecha de Entrega')).toBeTruthy();
    });

    it('should have correct calendar container', () => {
      const { getByTestId } = render(<FechaEntregaModal {...defaultProps} />);
      
      expect(getByTestId('calendar-container')).toBeTruthy();
    });

    it('should have correct calendar component', () => {
      const { getByTestId } = render(<FechaEntregaModal {...defaultProps} />);
      
      expect(getByTestId('calendar')).toBeTruthy();
    });
  });

  describe('Timing and Delays', () => {
    it('should handle setTimeout delay correctly', async () => {
      jest.useFakeTimers();
      
      const { getByTestId } = render(<FechaEntregaModal {...defaultProps} />);
      
      const calendar = getByTestId('calendar');
      fireEvent(calendar, 'onDayPress', { dateString: '2023-01-15' });
      
      // Fast-forward time
      jest.advanceTimersByTime(300);
      
      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledTimes(1);
      });
      
      jest.useRealTimers();
    });
  });
});
