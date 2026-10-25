import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useCart} from '../context/CartContext';
import {colors} from '../theme/theme';
import {RootStackParamList} from '../types';
import {formatPrice} from '../utils/pricing';

export default function OrdersScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {orders} = useCart();

  if (!orders.length) {
    return (
      <SafeAreaView edges={['top']} style={styles.empty}>
        <Text style={styles.icon}>🍽️</Text>
        <Text style={styles.title}>No orders yet</Text>
        <Text style={styles.subtitle}>Your delicious choices will show up here.</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('MainTabs', {screen: 'Home'})}>
          <Text style={styles.buttonText}>Browse the menu</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={styles.page}>
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator>
      <Text style={styles.title}>Your orders</Text>
      <Text style={styles.subtitle}>Your recent restaurant orders.</Text>
      {orders.map(order => (
        <View key={order.id} style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.orderId}>Order #{order.id}</Text>
            <Text style={styles.status}>{order.status}</Text>
          </View>
          <Text style={styles.date}>{new Date(order.createdAt).toLocaleString()}</Text>
          <Text style={styles.items}>{order.lines.map(line => `${line.quantity} × ${line.item.name}`).join('\n')}</Text>
          <Text style={styles.payment}>Payment: {order.payment}</Text>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.address} numberOfLines={1}>{order.address}</Text>
            <Text style={styles.total}>{formatPrice(order.total)}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {flex: 1, backgroundColor: colors.background},
  scroll: {flex: 1},
  content: {flexGrow: 1, padding: 20, paddingBottom: 30},
  title: {fontSize: 25, fontWeight: '800', color: colors.text},
  subtitle: {fontSize: 14, color: colors.muted, marginTop: 5, marginBottom: 18},
  card: {backgroundColor: colors.surface, borderRadius: 15, borderWidth: 1, borderColor: colors.border, padding: 16, marginBottom: 12},
  row: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  orderId: {fontSize: 15, fontWeight: '800', color: colors.text},
  status: {fontSize: 11, fontWeight: '700', color: colors.success, backgroundColor: '#eaf5ee', borderRadius: 12, overflow: 'hidden', paddingHorizontal: 9, paddingVertical: 5},
  date: {fontSize: 11, color: colors.muted, marginTop: 6},
  payment: {fontSize: 12, color: colors.muted, marginTop: 8},
  items: {fontSize: 13, lineHeight: 20, color: colors.text, marginTop: 12},
  divider: {height: 1, backgroundColor: colors.border, marginVertical: 11},
  address: {fontSize: 12, color: colors.muted, flex: 1, marginRight: 10},
  total: {fontSize: 15, fontWeight: '800', color: colors.primary},
  empty: {flex: 1, alignItems: 'center', justifyContent: 'center', padding: 25, backgroundColor: colors.background},
  icon: {fontSize: 52},
  button: {backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 13, paddingHorizontal: 18, marginTop: 18},
  buttonText: {fontSize: 14, color: '#fff', fontWeight: '800'},
});
