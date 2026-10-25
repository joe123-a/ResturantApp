import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useCart} from '../context/CartContext';
import {colors} from '../theme/theme';
import {RootStackParamList} from '../types';
import {formatPrice} from '../utils/pricing';

type Props = NativeStackScreenProps<RootStackParamList, 'OrderSuccess'>;

export default function OrderSuccessScreen({route, navigation}: Props) {
  const {orders} = useCart();
  const order = orders.find(value => value.id === route.params.orderId);

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.check}><Text style={styles.checkText}>✓</Text></View>
      <Text style={styles.title}>Order placed!</Text>
      <Text style={styles.subtitle}>Thanks for ordering with us. The kitchen is getting started.</Text>
      {order && (
        <View style={styles.card}>
          <Text style={styles.orderId}>Order #{order.id}</Text>
          <Text style={styles.detail}>{order.lines.reduce((count, line) => count + line.quantity, 0)} items · {formatPrice(order.total)}</Text>
          <Text style={styles.detail}>Delivering to {order.address}</Text>
          <Text style={styles.status}>●  {order.status}</Text>
        </View>
      )}
      <TouchableOpacity style={styles.button} onPress={() => navigation.reset({index: 0, routes: [{name: 'MainTabs', params: {screen: 'Home'}}]})}>
        <Text style={styles.buttonText}>Continue browsing</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.reset({index: 0, routes: [{name: 'MainTabs', params: {screen: 'Orders'} }]})}
        style={styles.secondary}>
        <Text style={styles.secondaryText}>View my orders</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: colors.background},
  check: {width: 76, height: 76, borderRadius: 38, backgroundColor: '#e7f4eb', alignItems: 'center', justifyContent: 'center'},
  checkText: {fontSize: 40, color: colors.success, fontWeight: '700'},
  title: {fontSize: 28, fontWeight: '800', color: colors.text, marginTop: 20},
  subtitle: {fontSize: 15, lineHeight: 22, color: colors.muted, textAlign: 'center', marginTop: 8},
  card: {width: '100%', backgroundColor: colors.surface, borderRadius: 15, borderWidth: 1, borderColor: colors.border, padding: 17, marginTop: 25},
  orderId: {fontSize: 16, fontWeight: '800', color: colors.text},
  detail: {fontSize: 13, color: colors.muted, marginTop: 9},
  status: {fontSize: 13, fontWeight: '700', color: colors.success, marginTop: 15},
  button: {width: '100%', backgroundColor: colors.primary, borderRadius: 13, padding: 16, alignItems: 'center', marginTop: 22},
  buttonText: {fontSize: 15, fontWeight: '800', color: '#fff'},
  secondary: {padding: 14},
  secondaryText: {fontSize: 13, color: colors.primary, fontWeight: '700'},
});
