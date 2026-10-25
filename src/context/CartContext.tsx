import React, {createContext, useCallback, useContext, useMemo, useState} from 'react';
import {CartLine, MenuItem, Order} from '../types';

type CartContextValue = {
  lines: CartLine[];
  orders: Order[];
  itemCount: number;
  addItem: (item: MenuItem) => void;
  removeItem: (itemId: string) => void;
  setQuantity: (itemId: string, quantity: number) => void;
  placeOrder: (customerName: string, address: string, payment: Order['payment'], total: number) => Order;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({children}: React.PropsWithChildren) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const addItem = useCallback((item: MenuItem) => {
    setLines(current => {
      const existing = current.find(line => line.item.id === item.id);
      return existing
        ? current.map(line => line.item.id === item.id ? {...line, quantity: line.quantity + 1} : line)
        : [...current, {item, quantity: 1}];
    });
  }, []);

  const setQuantity = useCallback((itemId: string, quantity: number) => {
    setLines(current => quantity <= 0
      ? current.filter(line => line.item.id !== itemId)
      : current.map(line => line.item.id === itemId ? {...line, quantity} : line));
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setLines(current => current.filter(line => line.item.id !== itemId));
  }, []);

  const placeOrder = useCallback((customerName: string, address: string, payment: Order['payment'], total: number) => {
    if (!lines.length) {
      throw new Error('Cannot place an order with an empty cart.');
    }
    const order: Order = {
      id: `R${Date.now().toString().slice(-7)}`,
      lines: lines.map(line => ({...line})),
      total,
      customerName,
      address,
      payment,
      createdAt: new Date().toISOString(),
      status: 'Preparing',
    };
    setOrders(current => [order, ...current]);
    setLines([]);
    return order;
  }, [lines]);

  const itemCount = lines.reduce((count, line) => count + line.quantity, 0);
  const value = useMemo(
    () => ({lines, orders, itemCount, addItem, removeItem, setQuantity, placeOrder}),
    [lines, orders, itemCount, addItem, removeItem, setQuantity, placeOrder],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
