import React, { useState, useEffect, useCallback, useContext, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Platform,
  StatusBar
} from 'react-native';
import { style } from './style';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import { getUsuarios } from '../../redux/actions/usuarioActions';
import Footer from '../components/footer';
import { DataContext } from '../../context/context';
import {
  ClienteProps,
  ClienteSearchState,
  DataContextType,
  RootState,
  Usuario,
  ClienteNavigationParams,
  ScrollEvent,
  CLIENTE_CONSTANTS
} from './types';

const VerPerfil: React.FC<ClienteProps> = ({ navigation, route }) => {
  const { userId, acceso } = useContext(DataContext) as DataContextType;
  const dispatch = useDispatch();
  const usuarios = useSelector((state: RootState) => state.usuario.usuarios || []);
  const usuariosFiltro = useSelector((state: RootState) => state.usuario.usuarios || []);
  const scrollViewRef = useRef<ScrollView>(null);

  const [state, setState] = useState<ClienteSearchState>({
    terminoBuscador: '',
    inicio: 0,
    final: false,
    limit: 10,
    showSearch: true,
    scrollPosition: 0
  });

  const updateState = useCallback((updates: Partial<ClienteSearchState>) => {
    setState(prevState => ({ ...prevState, ...updates }));
  }, []);

  // Effect para carga inicial
  useEffect(() => {
    console.log('🔍 Clientes - Carga inicial:', { userId, acceso, tieneUserId: !!userId, tieneAcceso: !!acceso });
    if (userId && acceso) {
      console.log('🚀 Clientes - Ejecutando searchUser inicial');
      searchUser();
    } else {
      console.log('❌ Clientes - No se ejecuta searchUser inicial:', { userId, acceso });
    }
  }, [userId, acceso]);

  // Efecto para restaurar la posición de scroll cuando se regrese de editarPerfil
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const params = route?.params;
      if (params?.scrollPosition && scrollViewRef.current) {
        // Pequeño delay para asegurar que el contenido esté renderizado
        setTimeout(() => {
          scrollViewRef.current?.scrollTo({
            y: params.scrollPosition,
            animated: true
          });
        }, 100);
      }
    });

    return unsubscribe;
  }, [navigation, route]);

  const onScroll = useCallback((event: ScrollEvent) => {
    const { final, limit, terminoBuscador } = state;
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
    const reachedEnd = contentOffset.y + layoutMeasurement.height >= contentSize.height;

    // Actualizar la posición de scroll en el estado
    updateState({ scrollPosition: contentOffset.y });

    if (reachedEnd && !final) {
      updateState({ final: true, limit: limit + 10 });
      searchUser();
    } else if (!reachedEnd && final) {
      updateState({ final: false });
    }
  }, [state.final, state.limit, state.terminoBuscador]);

  const searchUser = useCallback((clean = false) => {
    const { limit, inicio, terminoBuscador } = state;
    const searchTerm = clean ? '' : terminoBuscador;
    console.log('📡 Clientes - Enviando request:', {
      limit,
      inicio,
      acceso: CLIENTE_CONSTANTS.ACCESO,
      terminoBuscador: searchTerm,
      userId,
      clean
    });
    dispatch(getUsuarios(limit, inicio, CLIENTE_CONSTANTS.ACCESO, searchTerm, userId) as any);
  }, [state.limit, state.inicio, state.terminoBuscador, dispatch, userId]);

  const handleSearch = useCallback(() => {
    const { terminoBuscador, showSearch } = state;

    if (showSearch) {
      if (terminoBuscador && terminoBuscador.length > 1) {
        searchUser();
        updateState({ showSearch: false });
      } else {
        // Alert.alert("Error", "Inserte un valor");
      }
    } else {
      updateState({ showSearch: true, terminoBuscador: '' });
      searchUser(true);
    }
  }, [state.terminoBuscador, state.showSearch, searchUser]);

  const navigateToUser = useCallback((userId: string) => {
    const params = route?.params;

    // Guardar la posición actual del scroll antes de navegar
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: state.scrollPosition, animated: false });
    }

    if (params && params.idUsuario) {
      navigation.navigate("puntos", { idUsuario: userId });
    } else {
      navigation.navigate("editarPerfil", {
        tipoAcceso: "editar",
        idUsuario: userId,
        scrollPosition: state.scrollPosition
      });
    }
  }, [navigation, route, state.scrollPosition]);

  const navigateToCreateClient = useCallback(() => {
    navigation.navigate('editarPerfil', { tipoAcceso: 'crear' });
  }, [navigation]);

  // Función para renderizar clientes jerárquicamente
  const renderClienteJerarquico = useCallback((usuario: Usuario, nivel: number = 0) => {
    const paddingLeft = nivel * 20;
    const esPadre = (usuario.children && usuario.children.length > 0);
    const tieneHijos = usuario.children && Array.isArray(usuario.children) && usuario.children.length > 0;
    const isInactive = !usuario.activo;

    return (
      <View key={usuario._id}>
        <View
          style={[
            style.contenedorUsers,
            isInactive ? style.userCardInactive : style.userCardActive,
            {
              marginLeft: paddingLeft + 5,
              width: paddingLeft > 0 ? `${100 - ((paddingLeft + 5) / 10)}%` : "97%",
            }
          ]}
        >
          <TouchableOpacity
            style={style.userTouchable}
            onPress={() => navigateToUser(usuario._id)}
          >
            <View style={style.userContentContainer}>
              {/* Status indicator */}
              {isInactive && (
                <View style={style.inactiveIndicator}>
                  <FontAwesome
                    name={'exclamation-circle'}
                    style={style.inactiveIcon}
                  />
                  <Text style={style.inactiveText}>
                    CLIENTE INACTIVO
                  </Text>
                </View>
              )}

              {/* Razón Social */}
              {usuario.acceso === "cliente" && (
                <Text style={[
                  style.textUsers,
                  esPadre ? style.textAccesoPadre : style.textAccesoHijo,
                  isInactive && style.userNameInactive
                ]}>
                  {nivel > 0 ? '└─ ' : ''}
                  {usuario.idPadre
                    ? (usuario.razon_social?.toUpperCase() || 'Sin razón social')
                    : (usuario.razon_social && usuario.razon_social.length > 0
                      ? usuario.razon_social.toUpperCase()
                      : 'Sin razón social')
                  }
                </Text>
              )}

              {/* Email */}
              {usuario.email && usuario.email.length > 0 && (
                <Text style={[
                  style.textUsers,
                  style.userEmail,
                  isInactive && style.userEmailInactive
                ]}>
                  📧 {usuario.email.toLowerCase()}
                </Text>
              )}

              {/* Badges de estado y tipo */}
              <View style={style.badgeContainer}>
                {/* Badge de acceso */}
                {usuario.acceso && usuario.acceso.length > 0 && (
                  <View style={[
                    style.badgeAccess,
                    isInactive ? style.badgeAccessInactive : style.badgeAccessActive
                  ]}>
                    <Text style={style.badgeAccessText}>
                      {usuario.acceso.toUpperCase()}
                    </Text>
                  </View>
                )}

                {/* Badge de estado activo/inactivo */}
                <View style={[
                  style.badgeStatus,
                  usuario.activo ? style.badgeStatusActive : style.badgeStatusInactive
                ]}>
                  <Text style={usuario.activo ? style.badgeStatusTextActive : style.badgeStatusTextInactive}>
                    {usuario.activo ? 'ACTIVO' : 'INACTIVO'}
                  </Text>
                </View>

                {/* Badge de valor unitario */}
                {usuario.valorUnitario && (
                  <View style={style.badgePrice}>
                    <Text style={style.badgePriceText}>
                      ${String(usuario.valorUnitario)}
                    </Text>
                  </View>
                )}
              </View>

              {/* Información adicional */}
              {usuario.celular && usuario.celular.length > 0 && (
                <Text style={[
                  style.textUsers,
                  style.userPhone,
                  isInactive && style.userPhoneInactive
                ]}>
                  📱 {usuario.celular}
                </Text>
              )}

              {usuario.padre && (
                <Text style={[
                  style.textUsers,
                  style.userParent,
                  isInactive && style.userParentInactive
                ]}>
                  👤 Padre: {usuario.padre?.nombre?.toUpperCase() || 'Sin padre'}
                </Text>
              )}
            </View>

            <View style={style.userActionContainer}>
              {tieneHijos && (
                <View testID="children-badge" style={style.childrenBadge}>
                  <Text style={style.childrenBadgeText}>
                    {usuario.children?.length || 0}
                  </Text>
                </View>
              )}
              <FontAwesome
                name={'angle-right'}
                style={[
                  style.iconCerrar,
                  style.arrowIcon,
                  isInactive && style.arrowIconInactive
                ]}
              />
            </View>
          </TouchableOpacity>
        </View>
        {/* Renderizar hijos recursivamente */}
        {tieneHijos && usuario.children && usuario.children.map((hijo: Usuario) =>
          renderClienteJerarquico(hijo, nivel + 1)
        )}
      </View>
    );
  }, [navigateToUser]);

  const renderUsuarios = useCallback(() => {
    // Renderizar directamente los usuarios que vienen del API
    // Estos son los usuarios de nivel superior para esta vista
    return usuarios.map((usuario: Usuario) => renderClienteJerarquico(usuario));
  }, [usuarios, renderClienteJerarquico]);

  const renderContent = useCallback(() => {
    const { terminoBuscador } = state;
    const params = route?.params as ClienteNavigationParams;
    console.log('🎨 Clientes - Renderizando contenido:', {
      usuariosLength: usuarios.length,
      terminoBuscador,
      usuarios: usuarios,
      params: params
    });

    if (usuarios.length === 0) {
      console.log('⏳ Clientes - Mostrando loading porque usuarios.length === 0');
      return (
        <View style={style.loadingContainer}>
          <ActivityIndicator testID="activity-indicator" color="#00218b" />
        </View>
      );
    }

    // Solo activar modo revisiones si hay idUsuario en params (no solo scrollPosition)
    if (!route || !params || !params.idUsuario) {
      return renderUsuarios();
    }

    if (terminoBuscador && terminoBuscador.length > 2) {
      return renderUsuarios();
    }

    return (
      <View style={style.emptyStateContainer}>
        <Text style={style.emptyStateText}>Digita un usuario</Text>
      </View>
    );
  }, [usuarios.length, state.terminoBuscador, route, renderUsuarios]);

  const renderHeader = () => {
    return (
      <View style={style.headerContainer}>
        {/* Header con mejor espaciado */}
        <View style={style.headerContent}>
          <View style={style.headerTitleContainer}>
            <Text style={style.headerTitle}>
              {route && params && params.idUsuario ? 'Ver por revisiones' : 'Listado Clientes'}
            </Text>
            {usuarios && (
              <Text style={style.headerSubtitle}>
                {usuarios.length} clientes encontrados
              </Text>
            )}
          </View>

          {route && params && params.idUsuario && (
            <TouchableOpacity
              onPress={() => navigation.navigate("revision", { idUsuario: params.idUsuario })}
              style={style.revisionButton}
            >
              <Text style={style.revisionButtonText}>
                Ver Revisiones
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Search bar */}
        <View style={style.searchContainer}>
          <View style={style.searchInputContainer}>
            <TextInput
              placeholder="Buscar por: cliente, fecha, forma"
              autoCapitalize='none'
              placeholderTextColor="#aaa"
              onChangeText={(text) => updateState({ terminoBuscador: text })}
              value={terminoBuscador}
              style={style.searchInput}
            />
            {terminoBuscador && terminoBuscador.length > 0 && (
              <TouchableOpacity
                testID="close-icon"
                onPress={() => updateState({ terminoBuscador: '', showSearch: true })}
                style={style.clearButton}
              >
                <FontAwesome name="close" style={style.clearIcon} />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              testID="search-button"
              onPress={handleSearch}
              style={style.searchButton}
            >
              <FontAwesome
                name={showSearch ? 'search' : 'close'}
                style={style.searchIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const { terminoBuscador, showSearch } = state;
  const params = route?.params as ClienteNavigationParams;

  return (
    <View style={style.container}>
      {renderHeader()}

      <ScrollView
        ref={scrollViewRef}
        testID="users-scroll-view"
        style={style.scrollView}
        onScroll={onScroll}
        keyboardDismissMode="on-drag"
        scrollEventThrottle={16}
      >
        {renderContent()}
      </ScrollView>

      <Footer navigation={navigation} />

      {/* Round + button with shadow - Solo mostrar si no es veo */}
      {acceso !== "veo" && (
        <TouchableOpacity
          style={style.floatingButton}
          onPress={navigateToCreateClient}
        >
          <FontAwesome name={'plus'} style={style.floatingButtonIcon} />
        </TouchableOpacity>
      )}
    </View>
  );
};


export default VerPerfil;