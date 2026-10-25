import React, {useState} from 'react';
import {Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import SummaryRow from '../components/SummaryRow';
import {useCart} from '../context/CartContext';
import {colors} from '../theme/theme';
import {RootStackParamList} from '../types';
import {formatPrice, getDeliveryFee, getTotal} from '../utils/pricing';

type Props = NativeStackScreenProps<RootStackParamList, 'Checkout'>;

export default function CheckoutScreen({navigation}: Props) {
  const {lines, placeOrder} = useCart();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [payment, setPayment] = useState<'Cash on delivery' | 'Card on delivery'>('Cash on delivery');

  if (!lines.length) {
    return (
      <View style={styles.empty}>
        <Text style={styles.title}>Your cart is empty</Text>
        <Text style={styles.muted}>Add items before checking out.</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('MainTabs', {screen: 'Home'})}>
          <Text style={styles.buttonText}>Back to menu</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const submit = () => {
    if (!name.trim() || !address.trim()) {
      Alert.alert('A little more information', 'Enter your name and delivery address to place your order.');
      return;
    }
    const order = placeOrder(name.trim(), address.trim(), payment, getTotal(lines));
    navigation.replace('OrderSuccess', {orderId: order.id});
  };

  return (
    <KeyboardAvoidingView style={styles.page} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator>
        <Text style={styles.title}>Almost there!</Text>
        <Text style={styles.muted}>Add your details and we’ll get cooking.</Text>

        <Text style={styles.section}>Delivery details</Text>
        <Text style={styles.label}>Full name</Text>
        <TextInput accessibilityLabel="Full name" placeholder="e.g. Alex Morgan" value={name} onChangeText={setName} style={styles.input} returnKeyType="next" />
        <Text style={styles.label}>Delivery address</Text>
        <TextInput accessibilityLabel="Delivery address" placeholder="Street, building, apartment" value={address} onChangeText={setAddress} style={[styles.input, styles.address]} multiline textAlignVertical="top" />

        <Text style={styles.section}>Payment method</Text>
        {(['Cash on delivery', 'Card on delivery'] as const).map(method => (
          <TouchableOpacity key={method} accessibilityRole="radio" accessibilityState={{checked: payment === method}} onPress={() => setPayment(method)} style={styles.payment}>
            <View style={[styles.radio, payment === method && styles.radioSelected]} />
            <Text style={styles.paymentText}>{method}</Text>
          </TouchableOpacity>
        ))}

        <View style={styles.summary}>
          <Text style={styles.section}>Your order</Text>
          {lines.map(({item, quantity}) => (
            <SummaryRow key={item.id} label={`${item.name} × ${quantity}`} value={formatPrice(item.price * quantity)} />
          ))}
          <SummaryRow label="Delivery" value={formatPrice(getDeliveryFee(lines))} />
          <View style={styles.separator} />
          <SummaryRow label="Total due" value={formatPrice(getTotal(lines))} bold />
        </View>
        <TouchableOpacity style={styles.button} onPress={submit}>
          <Text style={styles.buttonText}>Place order · {formatPrice(getTotal(lines))}</Text>
        </TouchableOpacity>
        <Text style={styles.finePrint}>Payment is collected by your courier. This demo does not process card payments.</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: {flex: 1, backgroundColor: colors.background},
  scroll: {flex: 1},
  content: {flexGrow: 1, padding: 20, paddingBottom: 35},
  title: {fontSize: 26, fontWeight: '800', color: colors.text},
  muted: {fontSize: 14, color: colors.muted, marginTop: 5, marginBottom: 17},
  section: {fontSize: 17, fontWeight: '800', color: colors.text, marginTop: 17, marginBottom: 12},
  label: {fontSize: 13, fontWeight: '700', color: colors.text, marginBottom: 7},
  input: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 11, paddingHorizontal: 13, paddingVertical: 12, fontSize: 15, color: colors.text, marginBottom: 13},
  address: {height: 78},
  payment: {flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 11, padding: 14, marginBottom: 9},
  radio: {width: 19, height: 19, borderRadius: 10, borderWidth: 1.5, borderColor: colors.muted, marginRight: 11},
  radioSelected: {borderWidth: 6, borderColor: colors.primary},
  paymentText: {fontSize: 14, color: colors.text},
  summary: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 15, marginTop: 12, marginBottom: 16},
  separator: {height: 1, backgroundColor: colors.border, marginVertical: 8},
  button: {backgroundColor: colors.primary, borderRadius: 13, padding: 16, alignItems: 'center'},
  buttonText: {fontSize: 15, fontWeight: '800', color: '#fff'},
  finePrint: {fontSize: 11, lineHeight: 16, color: colors.muted, textAlign: 'center', marginTop: 11},
  empty: {flex: 1, alignItems: 'center', justifyContent: 'center', padding: 25, backgroundColor: colors.background},
});
