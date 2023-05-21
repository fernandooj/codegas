import { signInWithEmailAndPassword } from "firebase/auth";
import {auth} from "./firebase-config"

export const signIn = async ({email, password}: any) => {
    try {
        const response = await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
        console.error(error)
    }
}


