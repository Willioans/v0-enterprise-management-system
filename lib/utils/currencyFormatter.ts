// lib/utils/currencyFormatter.ts
import { Currency } from '../schemas';

const currencyRates: Record<Currency, number> = {
  USD: 1, // Base
  EUR: 0.92,
  MXN: 17.5,
  COP: 3850,
  BRL: 4.95,
  ARS: 850,
  CLP: 850,
  PEN: 3.7,
  VES: 36.5,
  UYU: 38.5,
  DOP: 58,
  GTQ: 7.8,
  HNL: 24.6,
};

export class CurrencyFormatter {
  /**
   * Formatear valor a moneda
   */
  static format(value: number, currency: Currency): string {
    const formatter = new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return formatter.format(value);
  }

  /**
   * Convertir entre monedas
   */
  static convert(amount: number, from: Currency, to: Currency): number {
    if (from === to) return amount;

    const rateFrom = currencyRates[from] || 1;
    const rateTo = currencyRates[to] || 1;

    return (amount / rateFrom) * rateTo;
  }

  /**
   * Obtener símbolo de moneda
   */
  static getSymbol(currency: Currency): string {
    const symbols: Record<Currency, string> = {
      USD: '$',
      EUR: '€',
      MXN: '$',
      COP: '$',
      BRL: 'R$',
      ARS: '$',
      CLP: '$',
      PEN: 'S/',
      VES: 'Bs.S',
      UYU: '$',
      DOP: 'RD$',
      GTQ: 'Q',
      HNL: 'L',
    };

    return symbols[currency] || currency;
  }

  /**
   * Obtener nombre completo de moneda
   */
  static getName(currency: Currency): string {
    const names: Record<Currency, string> = {
      USD: 'Dólar Estadounidense',
      EUR: 'Euro',
      MXN: 'Peso Mexicano',
      COP: 'Peso Colombiano',
      BRL: 'Real Brasileño',
      ARS: 'Peso Argentino',
      CLP: 'Peso Chileno',
      PEN: 'Sol Peruano',
      VES: 'Bolívar Venezolano',
      UYU: 'Peso Uruguayo',
      DOP: 'Peso Dominicano',
      GTQ: 'Quetzal Guatemalteco',
      HNL: 'Lempira Hondureño',
    };

    return names[currency] || currency;
  }

  /**
   * Parsear string a número
   */
  static parse(value: string): number {
    return parseFloat(value.replace(/[^\d.-]/g, '')) || 0;
  }
}
