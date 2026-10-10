import { getAuth, deleteUser, EmailAuthProvider, reauthenticateWithCredential, signOut, sendPasswordResetEmail } from 'firebase/auth';


export const resetPassword = async (auth, email) => {
    try {
        await sendPasswordResetEmail(auth, email);
        return { success: true };
    } catch (error) {
        return {
            success: false,
            message: error.message || 'Failed to reset password',
        };
    }
};

export const deleteAccount = async (password) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
        return { success: false, message: 'No user is currently logged in.' };
    }

    try {
        const credential = EmailAuthProvider.credential(user.email, password);
        await reauthenticateWithCredential(user, credential);

        await deleteUser(user);
        return {
            success: true, message: 'Your account has been deleted.'
        };
    } catch (error) {
        let errorMessage = 'Failed to delete account.';

        if (error.code === 'auth/wrong-password') {
            errorMessage = 'Incorrect password. Please try again.';
        } else if (error.code === 'auth/too-many-requests') {
            errorMessage = 'Too many unsuccessful attempts. Please try again later.';
        }
        return { success: false, message: errorMessage }
    }
}


export const logOutUser = async () => {
    const auth = getAuth();
    try {
        await signOut(auth);
        return {
            success: true,
            message: 'Successfully logged out'
        };
    } catch (error) {
        console.error('Logout error:', error);
        return {
            success: false,
            message: error.message || 'Failed to log out. Please try again.'
        };
    }
};
