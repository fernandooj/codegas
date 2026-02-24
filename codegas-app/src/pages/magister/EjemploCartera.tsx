import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getCartera, clearCartera } from '../../redux/actions/magisterActions';

/**
 * Ejemplo de cómo usar la cartera de Magister
 * 
 * Para usar en tu componente:
 * 1. Importa las acciones: import { getCartera } from '../../redux/actions/magisterActions';
 * 2. Obtén el dispatch: const dispatch = useDispatch();
 * 3. Obtén el estado: const cartera = useSelector((state) => state.magister);
 * 4. Llama a la acción con el NIT: dispatch(getCartera(nit));
 * 
 * El NIT del cliente está en el campo 'cedula' del usuario/cliente
 */
const EjemploCartera = ({ nit }: { nit: string | number }) => {
  const dispatch = useDispatch();
  const { cartera, total, error, loading } = useSelector((state: any) => state.magister);

  useEffect(() => {
    if (nit) {
      // Cargar la cartera cuando el componente se monta
      dispatch(getCartera(nit));
    }

    // Limpiar la cartera cuando el componente se desmonta
    return () => {
      dispatch(clearCartera());
    };
  }, [nit, dispatch]);

  const handleRefresh = () => {
    if (nit) {
      dispatch(getCartera(nit));
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Cargando cartera...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>❌ Error: {error}</Text>
        <TouchableOpacity style={styles.button} onPress={handleRefresh}>
          <Text style={styles.buttonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Cartera del Cliente</Text>
        <Text style={styles.subtitle}>NIT: {nit}</Text>
        <Text style={styles.count}>Total de registros: {total}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRefresh}>
        <Text style={styles.buttonText}>🔄 Actualizar</Text>
      </TouchableOpacity>

      <ScrollView style={styles.scrollView}>
        {cartera.length === 0 ? (
          <Text style={styles.emptyText}>No hay registros de cartera</Text>
        ) : (
          cartera.map((item: any, index: number) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardTitle}>Documento: {item.CAR_DOCUMENTO}</Text>
              <Text style={styles.cardText}>Número: {item.CAR_NUMERO}</Text>
              <Text style={styles.cardText}>Fecha: {item.CAR_FECHA}</Text>
              <Text style={styles.cardText}>Vence: {item.CAR_FECHA_VENCE}</Text>
              <Text style={styles.cardText}>Saldo: ${item.CAR_SALDO?.toLocaleString() || '0'}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  count: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 32,
  },
});

export default EjemploCartera;

