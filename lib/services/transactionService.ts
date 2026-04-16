// lib/services/transactionService.ts
import {
  collection,
  doc,
  setDoc,
  getDoc,
  query,
  where,
  getDocs,
  updateDoc,
} from '@firebase/firestore';
import { db } from '../firebase';
import { Transaction } from '../schemas';

export class TransactionService {
  /**
   * Crear una nueva transacción
   */
  static async createTransaction(data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<Transaction> {
    try {
      const transactionId = doc(collection(db, 'transactions')).id;
      const transaction: Transaction = {
        ...data,
        id: transactionId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(doc(db, 'transactions', transactionId), transaction);
      return transaction;
    } catch (error) {
      throw new Error(`Failed to create transaction: ${error}`);
    }
  }

  /**
   * Obtener transacción por ID
   */
  static async getTransaction(transactionId: string): Promise<Transaction | null> {
    try {
      const docSnap = await getDoc(doc(db, 'transactions', transactionId));
      return docSnap.exists() ? (docSnap.data() as Transaction) : null;
    } catch (error) {
      throw new Error(`Failed to fetch transaction: ${error}`);
    }
  }

  /**
   * Obtener transacciones de una organización
   */
  static async getOrganizationTransactions(organizationId: string): Promise<Transaction[]> {
    try {
      const q = query(
        collection(db, 'transactions'),
        where('organizationId', '==', organizationId)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs
        .map((doc) => doc.data() as Transaction)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } catch (error) {
      throw new Error(`Failed to fetch transactions: ${error}`);
    }
  }

  /**
   * Obtener transacciones de una sucursal
   */
  static async getBranchTransactions(branchId: string): Promise<Transaction[]> {
    try {
      const q = query(
        collection(db, 'transactions'),
        where('branchId', '==', branchId)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs
        .map((doc) => doc.data() as Transaction)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } catch (error) {
      throw new Error(`Failed to fetch branch transactions: ${error}`);
    }
  }

  /**
   * Obtener transacciones por tipo
   */
  static async getTransactionsByType(
    organizationId: string,
    type: string
  ): Promise<Transaction[]> {
    try {
      const q = query(
        collection(db, 'transactions'),
        where('organizationId', '==', organizationId),
        where('type', '==', type)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs
        .map((doc) => doc.data() as Transaction)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } catch (error) {
      throw new Error(`Failed to fetch transactions by type: ${error}`);
    }
  }

  /**
   * Calcular total de ventas
   */
  static async calculateTotalSales(organizationId: string, startDate?: Date, endDate?: Date): Promise<number> {
    try {
      const transactions = await this.getTransactionsByType(organizationId, 'sale');

      let total = 0;
      transactions.forEach((t) => {
        const txDate = new Date(t.createdAt);
        if ((!startDate || txDate >= startDate) && (!endDate || txDate <= endDate)) {
          if (t.status === 'completed') {
            total += t.amount;
          }
        }
      });

      return total;
    } catch (error) {
      throw new Error(`Failed to calculate sales: ${error}`);
    }
  }

  /**
   * Calcular total de gastos
   */
  static async calculateTotalExpenses(organizationId: string, startDate?: Date, endDate?: Date): Promise<number> {
    try {
      const transactions = await this.getTransactionsByType(organizationId, 'expense');

      let total = 0;
      transactions.forEach((t) => {
        const txDate = new Date(t.createdAt);
        if ((!startDate || txDate >= startDate) && (!endDate || txDate <= endDate)) {
          if (t.status === 'completed') {
            total += t.amount;
          }
        }
      });

      return total;
    } catch (error) {
      throw new Error(`Failed to calculate expenses: ${error}`);
    }
  }

  /**
   * Obtener balance neto
   */
  static async getNetBalance(organizationId: string, startDate?: Date, endDate?: Date): Promise<number> {
    try {
      const sales = await this.calculateTotalSales(organizationId, startDate, endDate);
      const expenses = await this.calculateTotalExpenses(organizationId, startDate, endDate);
      return sales - expenses;
    } catch (error) {
      throw new Error(`Failed to calculate net balance: ${error}`);
    }
  }

  /**
   * Actualizar estado de transacción
   */
  static async updateTransactionStatus(transactionId: string, status: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'transactions', transactionId), {
        status,
        updatedAt: new Date(),
      });
    } catch (error) {
      throw new Error(`Failed to update transaction status: ${error}`);
    }
  }

  /**
   * Obtener resumen de transacciones
   */
  static async getTransactionSummary(
    organizationId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<{
    totalSales: number;
    totalExpenses: number;
    totalIncome: number;
    netBalance: number;
    transactionCount: number;
  }> {
    try {
      const allTransactions = await this.getOrganizationTransactions(organizationId);

      let sales = 0,
        expenses = 0,
        income = 0,
        count = 0;

      allTransactions.forEach((t) => {
        const txDate = new Date(t.createdAt);
        if ((!startDate || txDate >= startDate) && (!endDate || txDate <= endDate)) {
          if (t.status === 'completed') {
            count++;
            if (t.type === 'sale') sales += t.amount;
            if (t.type === 'expense') expenses += t.amount;
            if (t.type === 'income') income += t.amount;
          }
        }
      });

      return {
        totalSales: sales,
        totalExpenses: expenses,
        totalIncome: income,
        netBalance: sales + income - expenses,
        transactionCount: count,
      };
    } catch (error) {
      throw new Error(`Failed to get transaction summary: ${error}`);
    }
  }
}
