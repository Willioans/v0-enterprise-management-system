// lib/services/organizationService.ts
import {
  collection,
  doc,
  setDoc,
  getDoc,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import { Organization, Branch, User, UserRole } from '../schemas';

export class OrganizationService {
  /**
   * Crear una nueva organización
   */
  static async createOrganization(data: Omit<Organization, 'id' | 'createdAt' | 'updatedAt'>): Promise<Organization> {
    try {
      const orgId = doc(collection(db, 'organizations')).id;
      const organization: Organization = {
        ...data,
        id: orgId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(doc(db, 'organizations', orgId), organization);
      return organization;
    } catch (error) {
      throw new Error(`Failed to create organization: ${error}`);
    }
  }

  /**
   * Obtener organización por ID
   */
  static async getOrganization(organizationId: string): Promise<Organization | null> {
    try {
      const docSnap = await getDoc(doc(db, 'organizations', organizationId));
      return docSnap.exists() ? (docSnap.data() as Organization) : null;
    } catch (error) {
      throw new Error(`Failed to fetch organization: ${error}`);
    }
  }

  /**
   * Actualizar organización
   */
  static async updateOrganization(
    organizationId: string,
    updates: Partial<Organization>
  ): Promise<void> {
    try {
      await updateDoc(doc(db, 'organizations', organizationId), {
        ...updates,
        updatedAt: new Date(),
      });
    } catch (error) {
      throw new Error(`Failed to update organization: ${error}`);
    }
  }

  /**
   * Obtener todas las sucursales de una organización
   */
  static async getBranches(organizationId: string): Promise<Branch[]> {
    try {
      const q = query(
        collection(db, 'branches'),
        where('organizationId', '==', organizationId)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => doc.data() as Branch);
    } catch (error) {
      throw new Error(`Failed to fetch branches: ${error}`);
    }
  }

  /**
   * Crear una nueva sucursal
   */
  static async createBranch(data: Omit<Branch, 'id' | 'createdAt' | 'updatedAt'>): Promise<Branch> {
    try {
      const branchId = doc(collection(db, 'branches')).id;
      const branch: Branch = {
        ...data,
        id: branchId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(doc(db, 'branches', branchId), branch);
      return branch;
    } catch (error) {
      throw new Error(`Failed to create branch: ${error}`);
    }
  }

  /**
   * Obtener todos los usuarios de una organización
   */
  static async getUsers(organizationId: string): Promise<User[]> {
    try {
      const q = query(
        collection(db, 'users'),
        where('organizationId', '==', organizationId)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => doc.data() as User);
    } catch (error) {
      throw new Error(`Failed to fetch users: ${error}`);
    }
  }

  /**
   * Agregar usuario a organización
   */
  static async addUserToOrganization(
    userId: string,
    organizationId: string,
    role: UserRole
  ): Promise<void> {
    try {
      await updateDoc(doc(db, 'users', userId), {
        organizationId,
        role,
        updatedAt: new Date(),
      });
    } catch (error) {
      throw new Error(`Failed to add user to organization: ${error}`);
    }
  }

  /**
   * Cambiar rol de usuario
   */
  static async updateUserRole(userId: string, newRole: UserRole): Promise<void> {
    try {
      await updateDoc(doc(db, 'users', userId), {
        role: newRole,
        updatedAt: new Date(),
      });
    } catch (error) {
      throw new Error(`Failed to update user role: ${error}`);
    }
  }

  /**
   * Obtener módulos de una organización
   */
  static async getModules(organizationId: string): Promise<string[]> {
    try {
      const org = await this.getOrganization(organizationId);
      return org?.modules || [];
    } catch (error) {
      throw new Error(`Failed to fetch modules: ${error}`);
    }
  }

  /**
   * Habilitar módulo en organización
   */
  static async enableModule(organizationId: string, module: string): Promise<void> {
    try {
      const org = await this.getOrganization(organizationId);
      if (org && !org.modules.includes(module)) {
        await updateDoc(doc(db, 'organizations', organizationId), {
          modules: [...org.modules, module],
          updatedAt: new Date(),
        });
      }
    } catch (error) {
      throw new Error(`Failed to enable module: ${error}`);
    }
  }

  /**
   * Deshabilitar módulo en organización
   */
  static async disableModule(organizationId: string, module: string): Promise<void> {
    try {
      const org = await this.getOrganization(organizationId);
      if (org) {
        await updateDoc(doc(db, 'organizations', organizationId), {
          modules: org.modules.filter((m) => m !== module),
          updatedAt: new Date(),
        });
      }
    } catch (error) {
      throw new Error(`Failed to disable module: ${error}`);
    }
  }
}
