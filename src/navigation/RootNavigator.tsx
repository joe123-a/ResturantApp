import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StyleSheet, Text} from 'react-native';
import {useCart} from '../context/CartContext';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import DetailScreen from '../screens/DetailScreen';
import HomeScreen from '../screens/HomeScreen';
import OrderSuccessScreen from '../screens/OrderSuccessScreen';
import OrdersScreen from '../screens/OrdersScreen';
import {RootStackParamList, TabParamList} from '../types';
import {colors} from '../theme/theme';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<TabParamList>();
type TabIconProps = {color: string; focused: boolean; size: number};
const HomeIcon = ({color}: TabIconProps) => <Text style={[styles.tabIcon, {color}]}>⌂</Text>;
const OrdersIcon = ({color}: TabIconProps) => <Text style={[styles.tabIcon, {color}]}>▤</Text>;
const CartIcon = ({color}: TabIconProps) => <Text style={[styles.tabIcon, {color}]}>🛍</Text>;

function MainTabs() {
  const {itemCount} = useCart();

  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {height: 64, paddingTop: 7, paddingBottom: 8, backgroundColor: colors.surface, borderTopColor: colors.border},
        tabBarLabelStyle: {fontSize: 11, fontWeight: '600'},
      }}>
      <Tabs.Screen name="Home" component={HomeScreen} options={{title: 'Menu', tabBarIcon: HomeIcon}} />
      <Tabs.Screen name="Orders" component={OrdersScreen} options={{title: 'My orders', tabBarIcon: OrdersIcon}} />
      <Tabs.Screen
        name="Cart"
        component={CartScreen}
        options={{title: 'Cart', tabBarBadge: itemCount ? itemCount : undefined, tabBarIcon: CartIcon}}
      />
    </Tabs.Navigator>
  );
}

const styles = StyleSheet.create({tabIcon: {fontSize: 20}});

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {backgroundColor: colors.background},
          headerTintColor: colors.text,
          headerTitleStyle: {fontWeight: '700'},
          contentStyle: {backgroundColor: colors.background},
        }}>
        <Stack.Screen name="MainTabs" component={MainTabs} options={{headerShown: false}} />
        <Stack.Screen name="Detail" component={DetailScreen} options={{title: 'Item details'}} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} options={{title: 'Checkout'}} />
        <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} options={{headerShown: false, gestureEnabled: false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
