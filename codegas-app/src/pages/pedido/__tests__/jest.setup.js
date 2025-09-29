// Jest setup para tests del módulo de pedidos

// Mock de React Native PixelRatio
jest.mock('react-native/Libraries/Utilities/PixelRatio', () => ({
  get: jest.fn(() => 2),
  getFontScale: jest.fn(() => 1),
  getPixelSizeForLayoutSize: jest.fn((size) => size * 2),
  roundToNearestPixel: jest.fn((size) => Math.round(size * 2) / 2),
}));

// Mock de React Native Dimensions
jest.mock('react-native/Libraries/Utilities/Dimensions', () => ({
  get: jest.fn(() => ({
    width: 375,
    height: 667,
    scale: 2,
    fontScale: 1,
  })),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));

// Mock de React Native Platform
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'ios',
  select: jest.fn((obj) => obj.ios || obj.default),
}));

// Mock de React Native Alert
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

// Mock de React Native Keyboard
jest.mock('react-native/Libraries/Components/Keyboard/Keyboard', () => ({
  addListener: jest.fn(),
  removeListener: jest.fn(),
  dismiss: jest.fn(),
}));

// Mock de React Native PermissionsAndroid
jest.mock('react-native/Libraries/PermissionsAndroid/PermissionsAndroid', () => ({
  request: jest.fn(() => Promise.resolve('granted')),
  check: jest.fn(() => Promise.resolve(true)),
  PERMISSIONS: {
    CAMERA: 'android.permission.CAMERA',
    WRITE_EXTERNAL_STORAGE: 'android.permission.WRITE_EXTERNAL_STORAGE',
  },
  RESULTS: {
    GRANTED: 'granted',
    DENIED: 'denied',
  },
}));

// Mock de React Native Linking
jest.mock('react-native/Libraries/Linking/Linking', () => ({
  openURL: jest.fn(() => Promise.resolve()),
  canOpenURL: jest.fn(() => Promise.resolve(true)),
}));

// Mock de React Native ImagePicker
jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn(),
  launchCamera: jest.fn(),
  MediaTypeOptions: {
    All: 'mixed',
    Images: 'photo',
    Videos: 'video',
  },
  ImagePickerResponse: {},
}));

// Mock de React Native Image Crop Picker
jest.mock('react-native-image-crop-picker', () => ({
  openPicker: jest.fn(),
  openCamera: jest.fn(),
  openCropper: jest.fn(),
}));

// Mock de React Native Toast Message
jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
  hide: jest.fn(),
}));

// Mock de React Native Vector Icons
jest.mock('@react-native-vector-icons/fontawesome', () => 'FontAwesome');

// Mock de React Native Calendars
jest.mock('react-native-calendars', () => ({
  Calendar: 'Calendar',
  CalendarList: 'CalendarList',
  Agenda: 'Agenda',
}));

// Mock de Moment
jest.mock('moment', () => {
  const moment = jest.requireActual('moment');
  return jest.fn(() => ({
    format: jest.fn(() => '2023-01-01'),
    add: jest.fn(() => ({
      format: jest.fn(() => '2023-01-02'),
    })),
    subtract: jest.fn(() => ({
      format: jest.fn(() => '2022-12-31'),
    })),
    startOf: jest.fn(() => ({
      format: jest.fn(() => '2023-01-01'),
    })),
    endOf: jest.fn(() => ({
      format: jest.fn(() => '2023-01-01'),
    })),
    isSame: jest.fn(() => false),
    isBefore: jest.fn(() => false),
    isAfter: jest.fn(() => false),
    diff: jest.fn(() => 0),
    valueOf: jest.fn(() => 1672531200000),
    toDate: jest.fn(() => new Date('2023-01-01')),
    toISOString: jest.fn(() => '2023-01-01T00:00:00.000Z'),
    unix: jest.fn(() => 1672531200),
    utc: jest.fn(() => ({
      format: jest.fn(() => '2023-01-01'),
    })),
    tz: jest.fn(() => ({
      format: jest.fn(() => '2023-01-01'),
    })),
  }));
});

// Mock de Redux
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(() => jest.fn()),
  Provider: ({ children }) => children,
  connect: jest.fn(() => (Component) => Component),
}));

// Mock de React Navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(() => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    dispatch: jest.fn(),
    setParams: jest.fn(),
    state: {
      key: 'test-key',
      routeName: 'test-route',
    },
  })),
  useRoute: jest.fn(() => ({
    key: 'test-key',
    name: 'test-route',
    params: {},
  })),
  useFocusEffect: jest.fn(),
  useIsFocused: jest.fn(() => true),
}));

// Mock de Context
jest.mock('../../context/context', () => ({
  DataContext: {
    Provider: ({ children }) => children,
    Consumer: ({ children }) => children({}),
  },
}));

// Mock de utilidades
jest.mock('../../utils/calendar', () => ({
  setupCalendarLocale: jest.fn(),
}));

jest.mock('../../utils/number', () => ({
  formatCurrency: jest.fn((value) => `$${value}`),
  formatNumber: jest.fn((value) => value.toString()),
}));

jest.mock('../../utils/colors', () => ({
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
    success: '#28a745',
    danger: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8',
    light: '#f8f9fa',
    dark: '#343a40',
  },
  estadoColors: {
    activo: '#28a745',
    innactivo: '#6c757d',
    espera: '#ffc107',
    noentregado: '#dc3545',
  },
  estadoBackgroundColors: {
    activo: '#d4edda',
    innactivo: '#e2e3e5',
    espera: '#fff3cd',
    noentregado: '#f8d7da',
  },
}));

// Mock de estilos
jest.mock('../style', () => ({
  style: {
    container: {},
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
    successButton: {},
    successButtonText: {},
    imageContainer: {},
    imagePreview: {},
    removeImageButton: {},
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
    saveButtonText: {},
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
    header: {},
    title: {},
    searchContainer: {},
    searchInput: {},
    filterContainer: {},
    filterButton: {},
    filterButtonText: {},
    pedidosList: {},
    loadingContainer: {},
    loadingText: {},
    emptyContainer: {},
    emptyText: {},
    errorContainer: {},
    errorText: {},
  },
}));

// Mock de componentes
jest.mock('../components/footer', () => 'Footer');
jest.mock('../components/tomarFoto', () => 'TomarFoto');

// Mock de modales
jest.mock('../EditarPedidoModal', () => 'EditarPedidoModal');
jest.mock('../NovedadModal', () => 'NovedadModal');
jest.mock('../CerrarPedidoModal', () => 'CerrarPedidoModal');
jest.mock('../ModalOrdenamiento', () => 'ModalOrdenamiento');
jest.mock('../PedidoSimplified', () => 'PedidoSimplified');
jest.mock('../CambiarEstadoModal', () => 'CambiarEstadoModal');
jest.mock('../VehiculosModal', () => 'VehiculosModal');
jest.mock('../FechaEntregaModal', () => 'FechaEntregaModal');

// Mock de acciones Redux
jest.mock('../../redux/actions/pedidoActions', () => ({
  getPedidos: jest.fn(),
  guardarNovedadInactivo: jest.fn(),
  asignarConductor: jest.fn(),
  asignarFechaEntrega: jest.fn(),
  guardarNovedadCerrarPedido: jest.fn(),
  cambiarEstadoPedido: jest.fn(),
  finalizarPedido: jest.fn(),
  resetPedido: jest.fn(),
}));

jest.mock('../../redux/actions/vehiculoActions', () => ({
  getVehiculos: jest.fn(),
}));

// Mock de hook personalizado
jest.mock('../usePedidoState', () => ({
  usePedidoState: () => ({
    state: {
      openModal: false,
      modalConductor: false,
      modalFechaEntrega: false,
      modalNovedad: false,
      modalPerfiles: false,
      modalCerrarPedido: false,
      modalOrdenamiento: false,
      modalResetPedido: false,
      terminoBuscador: undefined,
      showSearch: false,
      final: false,
      limit: 20,
      elevation: 7,
      showSpin: false,
      pedidosFiltro: [],
      selectedPedido: {},
    },
    updateState: jest.fn(),
    openPedidoModal: jest.fn(),
    closePedidoModal: jest.fn(),
    handleKeyboardShow: jest.fn(),
    handleKeyboardHide: jest.fn(),
    handleSearch: jest.fn(),
    clearSearch: jest.fn(),
    handleScroll: jest.fn(),
    actions: {
      setOpenModal: jest.fn(),
      setModalConductor: jest.fn(),
      setModalFechaEntrega: jest.fn(),
      setModalNovedad: jest.fn(),
      setModalPerfiles: jest.fn(),
      setModalCerrarPedido: jest.fn(),
      setModalOrdenamiento: jest.fn(),
      setModalResetPedido: jest.fn(),
      setTerminoBuscador: jest.fn(),
      setShowSearch: jest.fn(),
      setFinal: jest.fn(),
      setLimit: jest.fn(),
      setElevation: jest.fn(),
      setShowSpin: jest.fn(),
      setPedidosFiltro: jest.fn(),
      setPedidoData: jest.fn(),
      resetPedidoData: jest.fn(),
    },
  }),
}));

// Configuración global de Jest
global.console = {
  ...console,
  // Suprimir warnings de console en tests
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock de fetch global
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
  })
);

// Mock de setTimeout y setInterval
jest.useFakeTimers();

// Cleanup después de cada test
afterEach(() => {
  jest.clearAllMocks();
  jest.clearAllTimers();
});
