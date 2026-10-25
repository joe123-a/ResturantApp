import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import SummaryRow from '../components/SummaryRow';
import {useCart} from '../context/CartContext';
import {colors} from '../theme/theme';
import {RootStackParamList} from '../types';
import {formatPrice, getDeliveryFee, getSubtotal, getTotal} from '../utils/pricing';

export default function CartScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {lines, setQuantity, removeItem} = useCart();
  const subtotal = getSubtotal(lines);

  if (!lines.length) {
    return (
      <SafeAreaView edges={['top']} style={styles.emptyPage}>
        <Text style={styles.emptyIcon}>🛍</Text>
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptyText}>Find something delicious on the menu.</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('MainTabs', {screen: 'Home'})}>
          <Text style={styles.buttonText}>Explore the menu</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={styles.page}>
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator>
      <Text style={styles.title}>Your cart</Text>
      <Text style={styles.subtitle}>{lines.reduce((sum, line) => sum + line.quantity, 0)} delicious items</Text>
      {lines.map(({item, quantity}) => (
        <View key={item.id} style={styles.line}>
          <View style={styles.itemEmoji}><Text style={styles.foodEmoji}>{item.emoji}</Text></View>
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>{formatPrice(item.price)}</Text>
            <TouchableOpacity onPress={() => removeItem(item.id)}><Text style={styles.remove}>Remove</Text></TouchableOpacity>
          </View>
          <View style={styles.quantity}>
            <TouchableOpacity accessibilityLabel={`Remove one ${item.name}`} onPress={() => setQuantity(item.id, quantity - 1)} style={styles.quantityButton}><Text style={styles.quantityText}>−</Text></TouchableOpacity>
            <Text style={styles.count}>{quantity}</Text>
            <TouchableOpacity accessibilityLabel={`Add one ${item.name}`} onPress={() => setQuantity(item.id, quantity + 1)} style={styles.quantityButton}><Text style={styles.quantityText}>+</Text></TouchableOpacity>
          </View>
        </View>
      ))}
      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>Order summary</Text>
        <SummaryRow label="Subtotal" value={formatPrice(subtotal)} />
        <SummaryRow label="Delivery" value={formatPrice(getDeliveryFee(lines))} />
        <View style={styles.separator} />
        <SummaryRow label="Total" value={formatPrice(getTotal(lines))} bold />
      </View>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Checkout')}>
        <Text style={styles.buttonText}>Continue to checkout · {formatPrice(getTotal(lines))}</Text>
      </TouchableOpacity>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {flex: 1, backgroundColor: colors.background},
  scroll: {flex: 1},
  content: {flexGrow: 1, padding: 20, paddingBottom: 30},
  title: {fontSize: 27, fontWeight: '800', color: colors.text},
  subtitle: {fontSize: 14, color: colors.muted, marginTop: 5, marginBottom: 18},
  line: {flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 15, borderWidth: 1, borderColor: colors.border, padding: 13, marginBottom: 10},
  itemEmoji: {width: 55, height: 55, borderRadius: 12, backgroundColor: colors.soft, alignItems: 'center', justifyContent: 'center'},
  foodEmoji: {fontSize: 28},
  itemInfo: {flex: 1, marginLeft: 12},
  itemName: {fontSize: 15, fontWeight: '700', color: colors.text},
  itemPrice: {fontSize: 13, color: colors.primary, marginTop: 4},
  remove: {fontSize: 12, color: colors.muted, marginTop: 5, textDecorationLine: 'underline'},
  quantity: {flexDirection: 'row', alignItems: 'center', gap: 9},
  quantityButton: {width: 29, height: 29, borderRadius: 15, backgroundColor: colors.soft, alignItems: 'center', justifyContent: 'center'},
  quantityText: {fontSize: 18, fontWeight: '700', color: colors.primary},
  count: {minWidth: 15, textAlign: 'center', fontWeight: '700', color: colors.text},
  summary: {padding: 16, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 15, marginTop: 10, marginBottom: 18},
  summaryTitle: {fontSize: 16, fontWeight: '800', color: colors.text, marginBottom: 7},
  separator: {height: 1, backgroundColor: colors.border, marginVertical: 8},
  button: {backgroundColor: colors.primary, borderRadius: 13, padding: 16, alignItems: 'center'},
  buttonText: {fontSize: 15, fontWeight: '800', color: '#fff'},
  emptyPage: {flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28, backgroundColor: colors.background},
  emptyIcon: {fontSize: 55},
  emptyTitle: {fontSize: 23, fontWeight: '800', color: colors.text, marginTop: 16},
  emptyText: {fontSize: 15, color: colors.muted, marginTop: 7, textAlign: 'center'},
});
