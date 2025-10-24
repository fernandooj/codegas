import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator} from 'react-native';
import { style } from './style';

interface FormPassProps {
    password: string;
    confirmar: string;
    showLoading: boolean;
    cargando: boolean;
    onUpdatePassword: (password: string) => void;
    onUpdateConfirmar: (confirmar: string) => void;
    onSubmit: () => void;
}

const FormPass: React.FC<FormPassProps> = ({
    password,
    confirmar,
    showLoading,
    cargando,
    onUpdatePassword,
    onUpdateConfirmar,
    onSubmit
}) => {
    return (
        <View style={style.contenedorPerfil}>
            <Text style={style.tituloContrasena}>Inserta tu contraseña</Text>
            <TextInput
                placeholder="Contraseña"
                value={password}
                onChangeText={onUpdatePassword}
                style={style.input}
                secureTextEntry
            />
            <TextInput
                placeholder="Confirmar"
                value={confirmar}
                onChangeText={onUpdateConfirmar}
                style={style.input}
                secureTextEntry={true}
            />
            <TouchableOpacity style={style.btnGuardar} onPress={onSubmit}>
                {cargando && <ActivityIndicator style={{ marginRight: 5 }} />}
                <Text style={style.textGuardar}>{cargando ? "Guardando" : "Guardar"}</Text>
            </TouchableOpacity>
            {
                password !== confirmar
                && <TouchableOpacity
                    style={style.passwordMismatchButton}
                    disabled={showLoading}
                >
                    {showLoading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={style.passwordMismatchText}>
                            No coinciden
                        </Text>
                    )}
                </TouchableOpacity>
            }
        </View>
    );
};

export default FormPass;
