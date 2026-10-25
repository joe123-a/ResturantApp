import React from 'react';
import {Pressable, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {MenuItem} from '../types';
import {colors} from '../theme/theme';
import {formatPrice} from '../utils/pricing';

type Props = {
  item: MenuItem;
  onPress: () => void;
  onAdd: () => void;
};

export default function FoodCard({item, onPress, onAdd}: Props) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.card}>
      <View style={styles.image}><Text style={styles.emoji}>{item.emoji}</Text></View>
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text numberOfLines={2} style={styles.description}>{item.description}</Text>
        <Text style={styles.price}>{formatPrice(item.price)}</Text>
      </View>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={`Add ${item.name} to cart`}
        onPress={onAdd}
        style={styles.addButton}>
        <Text style={styles.addText}>+</Text>
      </TouchableOpacity>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 16, padding: 13, marginBottom: 12, borderWidth: 1, borderColor: colors.border},
  image: {width: 68, height: 68, borderRadius: 14, backgroundColor: colors.soft, alignItems: 'center', justifyContent: 'center'},
  emoji: {fontSize: 34},
  info: {flex: 1, marginHorizontal: 13},
  name: {fontSize: 16, fontWeight: '700', color: colors.text},
  description: {fontSize: 12, lineHeight: 17, color: colors.muted, marginTop: 3},
  price: {fontSize: 14, fontWeight: '700', color: colors.primary, marginTop: 6},
  addButton: {width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center'},
  addText: {fontSize: 24, lineHeight: 27, color: '#fff', fontWeight: '500'},
});
