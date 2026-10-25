import React from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useCart} from '../context/CartContext';
import {menu} from '../data/menu';
import {colors} from '../theme/theme';
import {RootStackParamList} from '../types';
import {formatPrice} from '../utils/pricing';

type Props = NativeStackScreenProps<RootStackParamList, 'Detail'>;

export default function DetailScreen({route}: Props) {
  const item = menu.find(value => value.id === route.params.itemId);
  const {addItem} = useCart();
  if (!item) {
    return <View style={styles.page}><Text style={styles.title}>This dish is unavailable.</Text></View>;
  }
  return (
    <View style={styles.page}>
      <View style={styles.hero}><Text style={styles.emoji}>{item.emoji}</Text></View>
      <Text style={styles.category}>{item.category.toUpperCase()}</Text>
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <View style={styles.info}><Text style={styles.infoText}>✦  Freshly prepared to order</Text><Text style={styles.infoText}>◷  Ready in about 25–35 min</Text></View>
      <View style={styles.footer}>
        <View><Text style={styles.priceLabel}>Price</Text><Text style={styles.price}>{formatPrice(item.price)}</Text></View>
        <TouchableOpacity style={styles.button} onPress={() => {
          addItem(item);
          Alert.alert('Added to cart', `${item.name} is in your cart.`);
        }}>
          <Text style={styles.buttonText}>Add to cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {flex: 1, padding: 22, backgroundColor: colors.background},
  hero: {height: 240, borderRadius: 22, backgroundColor: colors.soft, alignItems: 'center', justifyContent: 'center', marginBottom: 25},
  emoji: {fontSize: 112},
  category: {fontSize: 11, fontWeight: '800', letterSpacing: 1.3, color: colors.primary, marginBottom: 7},
  title: {fontSize: 29, lineHeight: 36, fontWeight: '800', color: colors.text},
  description: {fontSize: 16, lineHeight: 24, color: colors.muted, marginTop: 10},
  info: {backgroundColor: colors.surface, borderRadius: 14, padding: 16, marginTop: 24, gap: 12},
  infoText: {fontSize: 14, color: colors.text},
  footer: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 20},
  priceLabel: {fontSize: 12, color: colors.muted},
  price: {fontSize: 23, fontWeight: '800', color: colors.primary, marginTop: 3},
  button: {backgroundColor: colors.primary, paddingHorizontal: 22, paddingVertical: 15, borderRadius: 13},
  buttonText: {color: '#fff', fontWeight: '800', fontSize: 15},
});
