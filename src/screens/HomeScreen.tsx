import React, {useMemo, useState} from 'react';
import {ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import FoodCard from '../components/FoodCard';
import {menu} from '../data/menu';
import {colors} from '../theme/theme';
import {RootStackParamList} from '../types';
import {useCart} from '../context/CartContext';

const categories = ['All', 'Mains', 'Sides', 'Drinks', 'Desserts'];

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {addItem, itemCount} = useCart();
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const filtered = useMemo(() => menu.filter(item =>
    (category === 'All' || item.category === category) &&
    `${item.name} ${item.description}`.toLowerCase().includes(search.trim().toLowerCase()),
  ), [category, search]);

  return (
    <SafeAreaView edges={['top']} style={styles.page}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator>
        <View style={styles.topline}>
          <View>
            <Text style={styles.eyebrow}>GOOD FOOD, GOOD MOOD</Text>
            <Text style={styles.title}>What sounds{'\n'}good today?</Text>
          </View>
          <View style={styles.cartBadge}><Text style={styles.cartIcon}>🛍</Text><Text style={styles.cartCount}>{itemCount}</Text></View>
        </View>
        <View style={styles.promo}>
          <Text style={styles.promoTitle}>Freshly made, just for you</Text>
          <Text style={styles.promoBody}>Neighborhood favorites, delivered with care.</Text>
          <Text style={styles.delivery}>⌁  Delivery in 25–35 min</Text>
        </View>
        <TextInput
          accessibilityLabel="Search menu"
          placeholder="Search dishes..."
          placeholderTextColor={colors.muted}
          value={search}
          onChangeText={setSearch}
          style={styles.search}
          returnKeyType="search"
        />
        <ScrollView
          horizontal
          nestedScrollEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categories}>
          {categories.map(value => (
            <TouchableOpacity key={value} onPress={() => setCategory(value)} style={[styles.category, category === value && styles.categoryActive]}>
              <Text style={[styles.categoryText, category === value && styles.categoryTextActive]}>{value}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{category === 'All' ? 'Our menu' : category}</Text>
          <Text style={styles.resultCount}>{filtered.length} items</Text>
        </View>
        {filtered.length ? filtered.map(item => (
          <FoodCard
            key={item.id}
            item={item}
            onPress={() => navigation.navigate('Detail', {itemId: item.id})}
            onAdd={() => addItem(item)}
          />
        )) : <Text style={styles.empty}>No dishes found. Try another search.</Text>}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {flex: 1, backgroundColor: colors.background},
  scroll: {flex: 1},
  content: {flexGrow: 1, padding: 20, paddingBottom: 28},
  topline: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20},
  eyebrow: {fontSize: 11, fontWeight: '800', letterSpacing: 1.3, color: colors.primary, marginBottom: 7},
  title: {fontSize: 30, lineHeight: 36, fontWeight: '800', color: colors.text},
  cartBadge: {flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 22, paddingHorizontal: 12, paddingVertical: 9},
  cartIcon: {fontSize: 18},
  cartCount: {fontSize: 15, fontWeight: '800', color: colors.text, marginLeft: 7},
  promo: {backgroundColor: colors.accent, borderRadius: 17, padding: 18, marginBottom: 18},
  promoTitle: {fontSize: 18, fontWeight: '800', color: colors.text},
  promoBody: {fontSize: 13, color: '#513b29', marginTop: 5},
  delivery: {fontSize: 12, color: '#513b29', fontWeight: '700', marginTop: 11},
  search: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 15, paddingVertical: 12, fontSize: 15, color: colors.text},
  categories: {paddingVertical: 17, gap: 8},
  category: {borderWidth: 1, borderColor: colors.border, borderRadius: 20, paddingVertical: 8, paddingHorizontal: 15, backgroundColor: colors.surface},
  categoryActive: {backgroundColor: colors.primary, borderColor: colors.primary},
  categoryText: {fontSize: 13, fontWeight: '600', color: colors.muted},
  categoryTextActive: {color: '#fff'},
  sectionHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12},
  sectionTitle: {fontSize: 21, fontWeight: '800', color: colors.text},
  resultCount: {fontSize: 12, color: colors.muted},
  empty: {textAlign: 'center', color: colors.muted, marginTop: 25},
});
