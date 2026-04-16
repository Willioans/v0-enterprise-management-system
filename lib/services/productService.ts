// lib/services/productService.ts
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
import { Product } from '../schemas';

export class ProductService {
  /**
   * Crear un nuevo producto
   */
  static async createProduct(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    try {
      const productId = doc(collection(db, 'products')).id;
      const product: Product = {
        ...data,
        id: productId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(doc(db, 'products', productId), product);
      return product;
    } catch (error) {
      throw new Error(`Failed to create product: ${error}`);
    }
  }

  /**
   * Obtener producto por ID
   */
  static async getProduct(productId: string): Promise<Product | null> {
    try {
      const docSnap = await getDoc(doc(db, 'products', productId));
      return docSnap.exists() ? (docSnap.data() as Product) : null;
    } catch (error) {
      throw new Error(`Failed to fetch product: ${error}`);
    }
  }

  /**
   * Obtener todos los productos de una organización
   */
  static async getProductsByOrganization(organizationId: string): Promise<Product[]> {
    try {
      const q = query(
        collection(db, 'products'),
        where('organizationId', '==', organizationId)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => doc.data() as Product);
    } catch (error) {
      throw new Error(`Failed to fetch products: ${error}`);
    }
  }

  /**
   * Obtener productos de una sucursal
   */
  static async getProductsByBranch(branchId: string): Promise<Product[]> {
    try {
      const q = query(
        collection(db, 'products'),
        where('branchId', '==', branchId)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => doc.data() as Product);
    } catch (error) {
      throw new Error(`Failed to fetch branch products: ${error}`);
    }
  }

  /**
   * Buscar productos por SKU o código de barras
   */
  static async searchProduct(
    organizationId: string,
    searchTerm: string
  ): Promise<Product[]> {
    try {
      const q = query(
        collection(db, 'products'),
        where('organizationId', '==', organizationId)
      );
      const querySnapshot = await getDocs(q);
      const products = querySnapshot.docs.map((doc) => doc.data() as Product);

      return products.filter(
        (p) =>
          p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.barcode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (error) {
      throw new Error(`Failed to search products: ${error}`);
    }
  }

  /**
   * Actualizar producto
   */
  static async updateProduct(productId: string, updates: Partial<Product>): Promise<void> {
    try {
      await updateDoc(doc(db, 'products', productId), {
        ...updates,
        updatedAt: new Date(),
      });
    } catch (error) {
      throw new Error(`Failed to update product: ${error}`);
    }
  }

  /**
   * Actualizar stock de un producto
   */
  static async updateStock(productId: string, newStock: number): Promise<void> {
    try {
      await updateDoc(doc(db, 'products', productId), {
        stock: newStock,
        updatedAt: new Date(),
      });
    } catch (error) {
      throw new Error(`Failed to update stock: ${error}`);
    }
  }

  /**
   * Decrementar stock (para venta)
   */
  static async decrementStock(productId: string, quantity: number): Promise<void> {
    try {
      const product = await this.getProduct(productId);
      if (product) {
        const newStock = Math.max(0, product.stock - quantity);
        await this.updateStock(productId, newStock);
      }
    } catch (error) {
      throw new Error(`Failed to decrement stock: ${error}`);
    }
  }

  /**
   * Incrementar stock (para compra/devolución)
   */
  static async incrementStock(productId: string, quantity: number): Promise<void> {
    try {
      const product = await this.getProduct(productId);
      if (product) {
        await this.updateStock(productId, product.stock + quantity);
      }
    } catch (error) {
      throw new Error(`Failed to increment stock: ${error}`);
    }
  }

  /**
   * Obtener productos con stock bajo
   */
  static async getLowStockProducts(organizationId: string, threshold: number = 10): Promise<Product[]> {
    try {
      const products = await this.getProductsByOrganization(organizationId);
      return products.filter((p) => p.stock <= threshold && p.active);
    } catch (error) {
      throw new Error(`Failed to get low stock products: ${error}`);
    }
  }

  /**
   * Deletar producto
   */
  static async deleteProduct(productId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'products', productId));
    } catch (error) {
      throw new Error(`Failed to delete product: ${error}`);
    }
  }
}
