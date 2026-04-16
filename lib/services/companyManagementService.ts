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
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AuditService } from '@/lib/services/auditService';

export type CompanyStatus = 'pending' | 'approved' | 'suspended' | 'rejected';

export interface Company {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  subscription: {
    plan: 'basic' | 'professional' | 'enterprise';
    status: 'active' | 'inactive' | 'suspended';
    startDate: Timestamp;
    endDate: Timestamp;
    maxUsers: number;
    maxTransactions: number;
    storageGB: number;
  };
  status: CompanyStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  adminEmail: string;
  modules: {
    gym: boolean;
    restaurant: boolean;
    store: boolean;
    parts: boolean;
  };
  settings: {
    currency: string;
    language: string;
    timezone: string;
  };
}

export const companyManagementService = {
  // Create company application
  async submitCompanyApplication(companyData: Partial<Company>, adminId: string) {
    try {
      const newCompanyRef = doc(collection(db, 'companies'));
      const company: Company = {
        id: newCompanyRef.id,
        name: companyData.name || '',
        email: companyData.email || '',
        phone: companyData.phone || '',
        country: companyData.country || '',
        subscription: {
          plan: 'basic',
          status: 'inactive',
          startDate: Timestamp.now(),
          endDate: Timestamp.fromDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
          maxUsers: 5,
          maxTransactions: 1000,
          storageGB: 10,
        },
        status: 'pending',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        adminEmail: companyData.adminEmail || '',
        modules: {
          gym: false,
          restaurant: false,
          store: false,
          parts: false,
        },
        settings: {
          currency: companyData.settings?.currency || 'USD',
          language: companyData.settings?.language || 'es',
          timezone: companyData.settings?.timezone || 'America/New_York',
        },
      };

      await setDoc(newCompanyRef, company);
      await AuditService.logActivity('system', adminId, 'COMPANY_APPLICATION_SUBMITTED', 'companies', company.id);
      return company;
    } catch (error) {
      console.error('Error submitting company application:', error);
      throw error;
    }
  },

  // Get all companies (Super Admin only)
  async getAllCompanies(superAdminId: string) {
    try {
      const companiesRef = collection(db, 'companies');
      const snapshot = await getDocs(companiesRef);
      const companies: Company[] = [];
      snapshot.forEach((doc) => {
        companies.push(doc.data() as Company);
      });
      return companies;
    } catch (error) {
      console.error('Error fetching all companies:', error);
      throw error;
    }
  },

  // Get company by ID
  async getCompanyById(companyId: string) {
    try {
      const companyRef = doc(db, 'companies', companyId);
      const snapshot = await getDoc(companyRef);
      if (snapshot.exists()) {
        return snapshot.data() as Company;
      }
      return null;
    } catch (error) {
      console.error('Error fetching company:', error);
      throw error;
    }
  },

  // Approve company application
  async approveCompany(companyId: string, superAdminId: string) {
    try {
      const companyRef = doc(db, 'companies', companyId);
      await updateDoc(companyRef, {
        status: 'approved',
        'subscription.status': 'active',
        updatedAt: Timestamp.now(),
      });
      await AuditService.logActivity('system', superAdminId, 'COMPANY_APPROVED', 'companies', companyId);
      return { success: true };
    } catch (error) {
      console.error('Error approving company:', error);
      throw error;
    }
  },

  // Reject company application
  async rejectCompany(companyId: string, reason: string, superAdminId: string) {
    try {
      const companyRef = doc(db, 'companies', companyId);
      await updateDoc(companyRef, {
        status: 'rejected',
        updatedAt: Timestamp.now(),
      });
      await AuditService.logActivity('system', superAdminId, 'COMPANY_REJECTED', 'companies', companyId, { reason });
      return { success: true };
    } catch (error) {
      console.error('Error rejecting company:', error);
      throw error;
    }
  },

  // Suspend company
  async suspendCompany(companyId: string, reason: string, superAdminId: string) {
    try {
      const companyRef = doc(db, 'companies', companyId);
      await updateDoc(companyRef, {
        status: 'suspended',
        'subscription.status': 'suspended',
        updatedAt: Timestamp.now(),
      });
      await AuditService.logActivity('system', superAdminId, 'COMPANY_SUSPENDED', 'companies', companyId, { reason });
      return { success: true };
    } catch (error) {
      console.error('Error suspending company:', error);
      throw error;
    }
  },

  // Activate suspended company
  async activateCompany(companyId: string, superAdminId: string) {
    try {
      const companyRef = doc(db, 'companies', companyId);
      await updateDoc(companyRef, {
        status: 'approved',
        'subscription.status': 'active',
        updatedAt: Timestamp.now(),
      });
      await AuditService.logActivity('system', superAdminId, 'COMPANY_ACTIVATED', 'companies', companyId);
      return { success: true };
    } catch (error) {
      console.error('Error activating company:', error);
      throw error;
    }
  },

  // Update subscription plan
  async updateSubscriptionPlan(
    companyId: string,
    plan: 'basic' | 'professional' | 'enterprise',
    superAdminId: string
  ) {
    try {
      const planLimits = {
        basic: { maxUsers: 5, maxTransactions: 1000, storageGB: 10 },
        professional: { maxUsers: 50, maxTransactions: 10000, storageGB: 100 },
        enterprise: { maxUsers: 500, maxTransactions: 100000, storageGB: 1000 },
      };

      const limits = planLimits[plan];
      const companyRef = doc(db, 'companies', companyId);
      await updateDoc(companyRef, {
        'subscription.plan': plan,
        'subscription.maxUsers': limits.maxUsers,
        'subscription.maxTransactions': limits.maxTransactions,
        'subscription.storageGB': limits.storageGB,
        updatedAt: Timestamp.now(),
      });
      await AuditService.logActivity('system', superAdminId, 'SUBSCRIPTION_UPDATED', 'companies', companyId, { plan });
      return { success: true };
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  },

  // Enable/Disable modules for company
  async updateModules(
    companyId: string,
    modules: Partial<Company['modules']>,
    superAdminId: string
  ) {
    try {
      const companyRef = doc(db, 'companies', companyId);
      const updateData: any = { updatedAt: Timestamp.now() };
      Object.entries(modules).forEach(([key, value]) => {
        updateData[`modules.${key}`] = value;
      });
      await updateDoc(companyRef, updateData);
      await AuditService.logActivity('system', superAdminId, 'MODULES_UPDATED', 'companies', companyId, modules);
      return { success: true };
    } catch (error) {
      console.error('Error updating modules:', error);
      throw error;
    }
  },

  // Get companies by status
  async getCompaniesByStatus(status: CompanyStatus) {
    try {
      const q = query(collection(db, 'companies'), where('status', '==', status));
      const snapshot = await getDocs(q);
      const companies: Company[] = [];
      snapshot.forEach((doc) => {
        companies.push(doc.data() as Company);
      });
      return companies;
    } catch (error) {
      console.error('Error fetching companies by status:', error);
      throw error;
    }
  },
};
