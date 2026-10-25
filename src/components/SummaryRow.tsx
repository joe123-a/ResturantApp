import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors} from '../theme/theme';

type Props = {label: string; value: string; bold?: boolean};

export default function SummaryRow({label, value, bold}: Props) {
  return (
    <View style={styles.row}>
      <Text style={[styles.text, bold && styles.bold]}>{label}</Text>
      <Text style={[styles.text, bold && styles.bold]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 7},
  text: {fontSize: 14, color: colors.muted},
  bold: {fontSize: 16, fontWeight: '800', color: colors.text},
});
