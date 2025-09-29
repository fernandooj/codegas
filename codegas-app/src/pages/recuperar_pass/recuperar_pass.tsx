import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  Alert,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import Footer from '../components/footer';
import HeaderLogo from '../../components/HeaderLogo';
import Toast from 'react-native-toast-message';

import { style } from './style';
import { DataContext } from '../../context/context';
import { RecuperarPassProps, RecuperarPassState, RecuperarPassContext } from './recuperar_pass.types';

const RecuperarPass: React.FC<RecuperarPassProps> = ({ navigation }) => {
  const { recoverPass }: RecuperarPassContext = useContext(DataContext);
  const [state, setState] = useState<RecuperarPassState>({
    email: '',
    password: '',
    confirmarPassword: '',
    showModulo: false,
  });
  const [loading, setLoading] = useState(false);


  const updateState = (newState: Partial<RecuperarPassState>) => {
    setState(prev => ({ ...prev, ...newState }));
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const recuperar = async () => {
    if (!state.email.trim()) {
      Alert.alert('Error', 'El email es obligatorio');
      return;
    }

    if (!validateEmail(state.email)) {
      Alert.alert('Error', 'Por favor ingresa un email válido');
      return;
    }

    try {
      setLoading(true);
      await recoverPass(state.email);
      Alert.alert(
        'Éxito',
        'Se ha enviado un link de recuperación a tu email. Revisa tu bandeja de entrada.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Error al recuperar contraseña:', error);
      Alert.alert('Error', 'No se pudo enviar el email de recuperación. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const renderHeader = () => (
    <HeaderLogo
      showWelcome={false}
      containerStyle={style.headerContainer}
    />
  );

  const renderForm = () => (
    <View style={style.formContainer}>
      <View style={style.titleContainer}>
        <FontAwesome name="key" style={style.titleIcon} />
        <Text style={style.title}>Recuperar Contraseña</Text>
        <Text style={style.subtitle}>
          Ingresa tu email y te enviaremos un link para restablecer tu contraseña
        </Text>
      </View>

      <View style={style.inputContainer}>
        <View style={style.inputWrapper}>
          <FontAwesome name="envelope" style={style.inputIcon} />
          <TextInput
            style={[
              style.input,
              !state.email.trim() && style.inputInvalid
            ]}
            placeholder="Ingresa tu email"
            placeholderTextColor="#999"
            value={state.email}
            onChangeText={(text) => updateState({ email: text })}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />
        </View>

        {!state.email.trim() && (
          <Text style={style.errorText}>El email es obligatorio</Text>
        )}
      </View>

      <TouchableOpacity
        style={[
          style.submitButton,
          (!state.email.trim() || loading) && style.submitButtonDisabled
        ]}
        onPress={recuperar}
        disabled={!state.email.trim() || loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <View style={style.loadingContainer}>
            <FontAwesome name="spinner" style={style.loadingIcon} />
            <Text style={style.submitButtonText}>Enviando...</Text>
          </View>
        ) : (
          <View style={style.submitButtonContent}>
            <FontAwesome name="paper-plane" style={style.submitButtonIcon} />
            <Text style={style.submitButtonText}>Enviar Link de Recuperación</Text>
          </View>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={style.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <FontAwesome name="arrow-left" style={style.backButtonIcon} />
        <Text style={style.backButtonText}>Volver al Login</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={style.container}>
      <ImageBackground
        style={style.backgroundImage}
        source={require('../../assets/img/pg1/fondo.jpg')}
        resizeMode="cover"
      >
        {renderHeader()}

        <KeyboardAwareScrollView
          style={style.scrollContainer}
          contentContainerStyle={style.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {renderForm()}
        </KeyboardAwareScrollView>

        <Footer navigation={navigation} />
        <Toast />
      </ImageBackground>
    </SafeAreaView>
  );
};

export default RecuperarPass;
