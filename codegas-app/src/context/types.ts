import {User} from '@react-native-firebase/auth';
export interface SignInProps {
  email: string;
  password: string;
}

export interface DataProps {
  idUser: string | null;
  acceso: string | null;
  user: User | null;
  login: (credentials: SignInProps) => Promise<void>;
  closeSesion: () => Promise<void>;
  createUserFirebase: (credentials: SignInProps) => Promise<void>;
}
