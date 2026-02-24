import React, { useEffect, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import { DataContext } from '../../context/context';
import { getCartera, clearCartera } from '../../redux/actions/magisterActions';
import Footer from '../components/footer';

/** Convierte fecha numérica de Magister (estilo Excel) a DD/MM/YYYY */
const formatMagisterDate = (n: number): string => {
  if (n == null || n === undefined) return '-';
  const d = new Date((n - 25569) * 86400 * 1000);
  if (isNaN(d.getTime())) return String(n);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const Cartera = ({ navigation, route }: { navigation: any; route: any }) => {
  const { cedula: contextCedula, acceso: contextAcceso } = useContext(DataContext) as { cedula?: string; acceso?: string };
  const nitFromParams = route.params?.nit != null ? String(route.params.nit).trim() : '';
  const nitFromContext = contextAcceso === 'cliente' && contextCedula ? String(contextCedula).trim() : '';
  const nit = nitFromParams || nitFromContext;
  const nombreCliente = route.params?.nombreCliente ?? '';
  const dispatch = useDispatch();
  const { cartera, total, error, loading } = useSelector((state: any) => state.magister);

  useEffect(() => {
    if (nit) {
      dispatch(getCartera(nit));
    }
    return () => {
      dispatch(clearCartera());
    };
  }, [nit, dispatch]);

  const handleRefresh = () => {
    if (nit) dispatch(getCartera(nit));
  };

  if (!nit) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <FontAwesome name="arrow-left" size={22} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cartera</Text>
        </View>
        <View style={styles.container}>
          <Text style={styles.errorText}>No se especificó NIT del cliente.</Text>
        </View>
        <Footer navigation={navigation} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <FontAwesome name="arrow-left" size={22} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {nombreCliente ? `Cartera - ${nombreCliente}` : 'Información crediticia'}
        </Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#0A6BB2" />
          <Text style={styles.loadingText}>Cargando cartera...</Text>
        </View>
      ) : error ? (
        <View style={styles.container}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity style={styles.button} onPress={handleRefresh}>
            <Text style={styles.buttonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.body}>
          <View style={styles.infoBar}>
            <Text style={styles.nitText}>NIT: {nit}</Text>
            <Text style={styles.countText}>{total} registro(s)</Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleRefresh}>
            <FontAwesome name="refresh" size={16} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>Actualizar</Text>
          </TouchableOpacity>
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator>
            {cartera.length === 0 ? (
              <Text style={styles.emptyText}>No hay registros de cartera</Text>
            ) : (
              cartera.map((item: any, index: number) => (
                <View key={`${item.CAR_NUMERO}-${index}`} style={styles.card}>
                  <Text style={styles.cardDoc}>
                    {item.CAR_DOCUMENTO} - {item.CAR_NUMERO?.trim?.() ?? item.CAR_NUMERO}
                  </Text>
                  <View style={styles.cardRow}>
                    <Text style={styles.cardLabel}>Fecha:</Text>
                    <Text style={styles.cardValue}>{formatMagisterDate(item.CAR_FECHA)}</Text>
                  </View>
                  <View style={styles.cardRow}>
                    <Text style={styles.cardLabel}>Vence:</Text>
                    <Text style={styles.cardValue}>{formatMagisterDate(item.CAR_FECHA_VENCE)}</Text>
                  </View>
                  <View style={styles.cardRow}>
                    <Text style={[styles.cardLabel, styles.saldoLabel]}>Saldo:</Text>
                    <Text style={styles.saldoValue}>
                      ${typeof item.CAR_SALDO === 'number' ? item.CAR_SALDO.toLocaleString('es-CO') : (item.CAR_SALDO ?? '0')}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        </View>
      )}
      <Footer navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backBtn: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    flex: 1,
    padding: 16,
  },
  infoBar: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  nitText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  countText: {
    fontSize: 14,
    color: '#0A6BB2',
    marginTop: 4,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#0A6BB2',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
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
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  cardDoc: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  cardLabel: {
    fontSize: 14,
    color: '#666',
  },
  cardValue: {
    fontSize: 14,
    color: '#333',
  },
  saldoLabel: {
    fontWeight: '600',
  },
  saldoValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0A6BB2',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#dc3545',
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 24,
  },
});

export default Cartera;
