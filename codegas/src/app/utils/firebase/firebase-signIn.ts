import { signInWithEmailAndPassword } from "firebase/auth";
import {auth} from "./firebase-config"

export const signIn = async ({email, password}: any) => {
    try {
        const response = await signInWithEmailAndPassword(auth, email, password)
        console.log(response)
    } catch (error) {
        console.error(error)
    }
}


