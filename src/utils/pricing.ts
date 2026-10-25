import {CartLine} from '../types';

export const DELIVERY_FEE = 2.5;

export function formatPrice(amount: number) {
  return `$${amount.toFixed(2)}`;
}

export function getSubtotal(lines: CartLine[]) {
  return lines.reduce((total, line) => total + line.item.price * line.quantity, 0);
}

export function getDeliveryFee(lines: CartLine[]) {
  return lines.length ? DELIVERY_FEE : 0;
}

export function getTotal(lines: CartLine[]) {
  return getSubtotal(lines) + getDeliveryFee(lines);
}
