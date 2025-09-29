export interface RecuperarPassProps {
    navigation: any;
}

export interface RecuperarPassState {
    email: string;
    password: string;
    confirmarPassword: string;
    showModulo: boolean;
}

export interface RecuperarPassContext {
    recoverPass: (email: string) => Promise<void>;
}
