import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import {Text, TouchableOpacity} from 'react-native';
import {CartProvider, useCart} from '../src/context/CartContext';
import {menu} from '../src/data/menu';
import {getTotal} from '../src/utils/pricing';

function CartProbe() {
  const {lines, orders, itemCount, addItem, setQuantity, placeOrder} = useCart();

  return (
    <>
      <Text>{`count:${itemCount};lines:${lines.length};orders:${orders.length}`}</Text>
      <TouchableOpacity accessibilityLabel="add-item" onPress={() => addItem(menu[0])} />
      <TouchableOpacity accessibilityLabel="set-quantity" onPress={() => setQuantity(menu[0].id, 2)} />
      <TouchableOpacity
        accessibilityLabel="place-order"
        onPress={() => placeOrder('Sam Guest', '1 Main Street', 'Cash on delivery', getTotal(lines))}
      />
    </>
  );
}

test('adds items, updates quantities and places an order that clears the cart', () => {
  let renderer: ReactTestRenderer.ReactTestRenderer;
  ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(<CartProvider><CartProbe /></CartProvider>);
  });
  const root = renderer!.root;

  ReactTestRenderer.act(() => root.findByProps({accessibilityLabel: 'add-item'}).props.onPress());
  ReactTestRenderer.act(() => root.findByProps({accessibilityLabel: 'set-quantity'}).props.onPress());
  expect(root.findByType(Text).props.children).toBe('count:2;lines:1;orders:0');

  ReactTestRenderer.act(() => root.findByProps({accessibilityLabel: 'place-order'}).props.onPress());
  expect(root.findByType(Text).props.children).toBe('count:0;lines:0;orders:1');
});
