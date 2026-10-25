import {NavigatorScreenParams} from '@react-navigation/native';

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  emoji: string;
  popular?: boolean;
};

export type CartLine = {
  item: MenuItem;
  quantity: number;
};

export type Order = {
  id: string;
  lines: CartLine[];
  total: number;
  customerName: string;
  address: string;
  payment: 'Cash on delivery' | 'Card on delivery';
  createdAt: string;
  status: 'Preparing' | 'On the way' | 'Delivered';
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<TabParamList> | undefined;
  Detail: {itemId: string};
  Checkout: undefined;
  OrderSuccess: {orderId: string};
};

export type TabParamList = {
  Home: undefined;
  Orders: undefined;
  Cart: undefined;
};
