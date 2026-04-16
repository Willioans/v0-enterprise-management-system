// lib/auth/authService.ts
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  browserLocalPersistence,
  User as FirebaseUser,
  sendPasswordResetEmail,
  updateProfile,
} from '@firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from '@firebase/firestore';
import { auth, db } from '../firebase';
import { User, UserRole } from '../schemas';

export class AuthService {
  // Register new user
  static async register(
    email: string,
    password: string,
    name: string,
    lastName: string,
    organizationId: string,
    role: UserRole = UserRole.CUSTOMER
  ): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Update profile
      await updateProfile(firebaseUser, {
        displayName: `${name} ${lastName}`,
      });

      // Create user document in Firestore
      const userData: User = {
        id: firebaseUser.uid,
        email: email,
        name: name,
        lastName: lastName,
        role: role,
        organizationId: organizationId,
        status: 'active',
        mfaEnabled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), userData);

      return userData;
    } catch (error) {
      throw new Error(`Registration failed: ${error}`);
    }
  }

  // Login user
  static async login(email: string, password: string): Promise<FirebaseUser> {
    try {
      // Set persistence before sign in for better UX
      await setPersistence(auth, browserLocalPersistence);

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw new Error(`Login failed: ${error}`);
    }
  }

  // Logout user
  static async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      throw new Error(`Logout failed: ${error}`);
    }
  }

  // Get current user
  static async getCurrentUser(): Promise<User | null> {
    const firebaseUser = auth.currentUser;

    if (!firebaseUser) {
      return null;
    }

    try {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      return userDoc.exists() ? (userDoc.data() as User) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Reset password
  static async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw new Error(`Password reset failed: ${error}`);
    }
  }

  // Update user profile
  static async updateUserProfile(userId: string, updates: Partial<User>): Promise<void> {
    try {
      await updateDoc(doc(db, 'users', userId), {
        ...updates,
        updatedAt: new Date(),
      });
    } catch (error) {
      throw new Error(`Profile update failed: ${error}`);
    }
  }

  // Check if user has specific role
  static async hasRole(userId: string, requiredRole: UserRole): Promise<boolean> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (!userDoc.exists()) return false;

      const user = userDoc.data() as User;
      return user.role === requiredRole;
    } catch (error) {
      console.error('Error checking role:', error);
      return false;
    }
  }

  // Check if user belongs to organization
  static async belongsToOrganization(userId: string, organizationId: string): Promise<boolean> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (!userDoc.exists()) return false;

      const user = userDoc.data() as User;
      return user.organizationId === organizationId;
    } catch (error) {
      console.error('Error checking organization membership:', error);
      return false;
    }
  }
}
