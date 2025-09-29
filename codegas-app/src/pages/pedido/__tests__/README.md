# Tests para el módulo de Pedidos

Este directorio contiene todos los tests para el módulo de pedidos de la aplicación Codegas.

## Estructura de Tests

### Archivos de Test

1. **`index.test.tsx`** - Tests para el componente principal de pedidos
2. **`EditarPedidoModal.test.tsx`** - Tests para el modal de edición de pedidos
3. **`CerrarPedidoModal.test.tsx`** - Tests para el modal de cierre de pedidos
4. **`VehiculosModal.test.tsx`** - Tests para el modal de selección de vehículos
5. **`CambiarEstadoModal.test.tsx`** - Tests para el modal de cambio de estado
6. **`ModalOrdenamiento.test.tsx`** - Tests para el modal de ordenamiento
7. **`NovedadModal.test.tsx`** - Tests para el modal de novedades
8. **`FechaEntregaModal.test.tsx`** - Tests para el modal de fecha de entrega
9. **`PedidoSimplified.test.tsx`** - Tests para el componente simplificado de pedido
10. **`pedidoReducer.test.js`** - Tests para el reducer de pedidos
11. **`usePedidoState.test.js`** - Tests para el hook personalizado de estado
12. **`types.test.ts`** - Tests para las interfaces y tipos TypeScript

## Cobertura de Tests

### Componentes
- ✅ Renderizado correcto
- ✅ Interacciones del usuario
- ✅ Estados de carga y error
- ✅ Casos edge
- ✅ Validación de props
- ✅ Control de acceso basado en roles

### Hooks y Reducers
- ✅ Estado inicial
- ✅ Acciones del reducer
- ✅ Funciones helper
- ✅ Manejo de errores
- ✅ Casos edge

### Modales
- ✅ Apertura y cierre
- ✅ Validación de formularios
- ✅ Interacciones del usuario
- ✅ Estados de carga
- ✅ Manejo de errores

### Tipos TypeScript
- ✅ Interfaces correctamente definidas
- ✅ Tipos de datos válidos
- ✅ Propiedades requeridas y opcionales
- ✅ Validación de tipos

## Ejecutar Tests

Para ejecutar todos los tests del módulo de pedidos:

```bash
npm test -- src/pages/pedido/__tests__
```

Para ejecutar un test específico:

```bash
npm test -- src/pages/pedido/__tests__/index.test.tsx
```

Para ejecutar tests con cobertura:

```bash
npm test -- --coverage src/pages/pedido/__tests__
```

## Mocks Utilizados

### Dependencias Externas
- `@react-native-vector-icons/fontawesome`
- `react-native-toast-message`
- `moment`
- `react-native-calendars`
- `react-native-image-picker`

### Componentes Internos
- `../components/footer`
- `../components/tomarFoto`
- `../../context/context`
- `../../redux/actions/pedidoActions`
- `../../redux/actions/vehiculoActions`

### Utilidades
- `../../utils/calendar`
- `../../utils/number`
- `../../utils/colors`

## Patrones de Test

### 1. Renderizado
```typescript
it('should render component correctly', () => {
  const { getByText } = render(<Component {...props} />);
  expect(getByText('Expected Text')).toBeTruthy();
});
```

### 2. Interacciones del Usuario
```typescript
it('should handle user interaction', () => {
  const { getByText } = render(<Component {...props} />);
  const button = getByText('Button Text');
  fireEvent.press(button);
  expect(mockFunction).toHaveBeenCalled();
});
```

### 3. Estados de Carga
```typescript
it('should show loading state', () => {
  const { getByText } = render(<Component {...props} loading={true} />);
  expect(getByText('Cargando...')).toBeTruthy();
});
```

### 4. Validación de Formularios
```typescript
it('should validate form input', async () => {
  const { getByText, getByPlaceholderText } = render(<Component {...props} />);
  const input = getByPlaceholderText('Enter text');
  fireEvent.changeText(input, '');
  const button = getByText('Submit');
  fireEvent.press(button);
  await waitFor(() => {
    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please enter text');
  });
});
```

### 5. Control de Acceso
```typescript
it('should show limited options for specific access', () => {
  const { getByText, queryByText } = render(
    <Component {...props} acceso="conductor" />
  );
  expect(getByText('Allowed Action')).toBeTruthy();
  expect(queryByText('Restricted Action')).toBeNull();
});
```

## Mejores Prácticas

1. **Nombres Descriptivos**: Usar nombres de test que describan claramente qué se está probando
2. **Arrange-Act-Assert**: Estructurar los tests en tres fases claras
3. **Mocks Apropiados**: Mockear solo lo necesario para aislar el componente bajo prueba
4. **Casos Edge**: Incluir tests para casos límite y errores
5. **Cobertura Completa**: Asegurar que todos los caminos de código estén cubiertos
6. **Tests Independientes**: Cada test debe ser independiente y no depender de otros
7. **Cleanup**: Limpiar mocks y estado entre tests

## Notas Importantes

- Los tests utilizan `@testing-library/react-native` para renderizado y testing
- Se mockean todas las dependencias externas para aislar los componentes
- Se incluyen tests para diferentes roles de usuario (admin, conductor, cliente, etc.)
- Se prueban tanto casos exitosos como casos de error
- Se incluyen tests de accesibilidad y usabilidad

## Mantenimiento

- Actualizar tests cuando se modifiquen los componentes
- Agregar nuevos tests para nuevas funcionalidades
- Revisar cobertura de tests regularmente
- Mantener mocks actualizados con las dependencias reales
