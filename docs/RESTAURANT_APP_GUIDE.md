# Restaurant App: Build and Code Guide

This guide explains how the restaurant ordering prototype is assembled, why each
part exists, how a customer moves through it, and how to run and verify it.

## 1. The starting problem

The app's entry point, [`App.tsx`](../App.tsx), was changed to import a cart
provider and a root navigator. However, the files those imports pointed to (and
the other planned files under `src/`) were empty on disk. The app therefore had
no actual screens or cart implementation to render.

The first repair was to put a real screen behind the app entry point. That
confirmed the simulator could display the project, but it was only a menu
mock-up: adding a dish just incremented a number. It did not represent separate
foods, calculate prices, or complete an order.

The implementation was then extended into the ordering flow described below.
This history matters because it distinguishes the initial launch fix from the
features that make the app usable as an ordering prototype.

## 2. What the app can do now

The current app lets a customer:

1. Browse a sample menu of nine dishes.
2. Search dish names and descriptions, or filter by category.
3. Open an item to see its description and price.
4. Add dishes to a shared cart, change quantities, or remove dishes.
5. Review the subtotal, delivery fee, and total.
6. Enter a name and delivery address, choose a payment-on-delivery option,
   and place an order.
7. See an order confirmation and view orders in the Orders tab.

This is a frontend prototype. The menu, cart, and order history live in app
memory; there is no restaurant server, account system, live delivery tracking,
or payment processing yet.

## 3. How the code is organized

```text
App.tsx
└── CartProvider
    └── RootNavigator
        ├── Main tabs: Menu, My orders, Cart
        └── Stack screens: Item details, Checkout, Order success

src/
├── components/     Reusable menu cards and price-summary rows
├── context/        Shared cart and in-memory order state
├── data/           Sample menu
├── navigation/     Typed stack and tab navigation
├── screens/        Customer-facing screens
├── theme/          Shared color palette
├── types/          Menu, cart, order, and route types
└── utils/          Price formatting and totals
```

The intended dependency direction is simple: screens display data and call
actions; the cart context owns mutable cart/order state; shared types, menu data,
theme colors, and price helpers are reused by the screens.

## 4. Build-up from app startup to ordering

### Step 1 — Register the app

[`index.js`](../index.js) is the React Native entry point. It registers `App`
with `AppRegistry` using the name in [`app.json`](../app.json). The native iOS
or Android app starts here, so this file connects the platform launcher to the
JavaScript component tree.

### Step 2 — Set up providers in `App.tsx`

[`App.tsx`](../App.tsx) wraps the application in:

- `SafeAreaProvider`, which makes device safe-area measurements available so
  content avoids the status bar and screen edges.
- `CartProvider`, which makes the same cart and order state available to all
  screens.
- `RootNavigator`, which decides which screen to show and how screens connect.

The provider order is intentional: navigation screens are children of the cart
provider, so they can all use the cart hook.

### Step 3 — Define data and types

- [`src/types/index.ts`](../src/types/index.ts) defines `MenuItem`, `CartLine`,
  and `Order`, plus TypeScript route parameter lists. These shapes help catch
  mistakes at build time—for example, navigating to an item detail without its
  required item ID.
- [`src/data/menu.ts`](../src/data/menu.ts) contains the sample menu. Every dish
  has a stable `id`, name, description, category, numeric price, and emoji.
  Stable IDs let the cart update or remove a dish without confusing it with a
  different item.
- [`src/theme/theme.ts`](../src/theme/theme.ts) is the shared color palette.
  Putting colors in one place keeps screens visually consistent and makes a
  later theme change easier.

The menu is currently local, static data. A future API can replace this module
without changing the meaning of `MenuItem`.

### Step 4 — Centralize cart and order state

[`src/context/CartContext.tsx`](../src/context/CartContext.tsx) owns the shared
cart and order history:

- `addItem(item)` adds a new cart line or increments the existing line for that
  dish.
- `setQuantity(itemId, quantity)` changes the quantity; zero or less removes
  that line.
- `removeItem(itemId)` removes a line directly.
- `itemCount` totals quantities, which drives the cart badge.
- `placeOrder(...)` copies the current lines into an order, adds customer and
  delivery details, records the selected payment option and timestamp, adds the
  order to the in-memory history, and clears the cart.
- `useCart()` lets screens access this shared state. It throws a clear error if
  used outside `CartProvider`, rather than silently hiding a provider bug.

React state is used instead of separate cart state inside every screen. This
means adding a dish on the menu is immediately reflected in the Cart tab and
badge. State is not persisted: restarting or reloading the app clears it.

### Step 5 — Add navigation

[`src/navigation/RootNavigator.tsx`](../src/navigation/RootNavigator.tsx)
combines two navigation patterns:

- A bottom-tab navigator keeps Menu, My orders, and Cart easy to reach.
- A stack navigator opens item details and checkout above those tabs, then
  displays the order confirmation.

The route types in `src/types/index.ts` make navigation parameters explicit.
For example, `Detail` requires an `itemId`, and `OrderSuccess` requires an
`orderId`. The cart count is passed to the tab options so the badge follows
cart state.

### Step 6 — Build the menu

[`src/screens/HomeScreen.tsx`](../src/screens/HomeScreen.tsx) displays the
welcome and delivery information, search field, category filters, and menu
cards. Search/category state is local to the menu screen. A memoized filter
matches the selected category and the search text against each dish's name and
description.

[`src/components/FoodCard.tsx`](../src/components/FoodCard.tsx) is reused for
each dish. It accepts an item and two callbacks: one opens its detail screen,
and the other adds it to the cart. Keeping this card reusable avoids
reimplementing the same row for every dish.

The menu uses a vertical `ScrollView` for the complete page and a nested
horizontal `ScrollView` for categories. `flex: 1` on the scroll region gives it
the available screen height; `flexGrow: 1` on its content lets short results
fill the screen while long menus can scroll. The tab bar is outside this
scroll view, so swiping should happen over the menu content, not the tabs.

### Step 7 — Show item details

[`src/screens/DetailScreen.tsx`](../src/screens/DetailScreen.tsx) receives an
item ID from navigation, finds that item in the sample menu, and displays its
category, description, preparation information, and price. Its Add to cart
button calls the shared `addItem` action, so the item appears in the same cart
used by the tabs and checkout.

### Step 8 — Calculate prices

[`src/utils/pricing.ts`](../src/utils/pricing.ts) keeps price calculations out
of the UI:

- `formatPrice` displays a number as a two-decimal dollar amount.
- `getSubtotal` sums each item's price multiplied by its quantity.
- `getDeliveryFee` charges the configured flat fee only for a non-empty cart.
- `getTotal` combines the subtotal and delivery fee.

[`src/components/SummaryRow.tsx`](../src/components/SummaryRow.tsx) renders a
consistent label/value row in cart and checkout summaries.

### Step 9 — Review and edit the cart

[`src/screens/CartScreen.tsx`](../src/screens/CartScreen.tsx) handles both an
empty-cart state and a populated cart. For each line, the customer can increase
or decrease its quantity or remove it. The summary is recalculated from the
current shared cart state, and Continue to checkout opens the checkout route.
The cart has a vertical scroll region so the totals and checkout button remain
reachable when there are many different dishes.

### Step 10 — Collect delivery details and place the order

[`src/screens/CheckoutScreen.tsx`](../src/screens/CheckoutScreen.tsx) collects
a name, address, and payment-on-delivery choice. It checks that name and address
are not blank before submitting. It also shows the current items and total so
the customer can review the order before placing it.

The form is inside a scroll view, which can be important on shorter devices or
when the keyboard is open. `KeyboardAvoidingView` adjusts the layout for the
keyboard; dragging the form dismisses the keyboard.

The payment labels are choices recorded for the prototype only. In particular,
“Card on delivery” does not charge a card.

### Step 11 — Confirm the order and show history

- [`src/screens/OrderSuccessScreen.tsx`](../src/screens/OrderSuccessScreen.tsx)
  looks up the newly created order by ID and displays its confirmation details.
  Its actions return the customer to the menu or order history.
- [`src/screens/OrdersScreen.tsx`](../src/screens/OrdersScreen.tsx) lists
  orders currently held in the shared provider state, including their items,
  status, date, address, payment choice, and total. It provides an empty state
  before the first order.

Because orders are in memory, this history is only for the current running app
session. Persistent history requires a database or backend.

## 5. What happens when a customer places an order

```text
Menu
  ├── Tap a dish → Item details → Add to cart
  └── Tap + on a dish → Add directly to cart
                                ↓
                         Shared cart state
                                ↓
                      Cart tab → edit quantities
                                ↓
                    Review subtotal + delivery
                                ↓
           Checkout → validate name and address
                                ↓
                         Place order
                    ├── copy cart into order
                    ├── add it to order history
                    └── clear the cart
                                ↓
                       Order confirmation
                                ↓
                           My orders
```

## 6. Tests and quality checks

- [`__tests__/App.test.tsx`](../__tests__/App.test.tsx) checks that the root app
  renders.
- [`__tests__/CartContext.test.tsx`](../__tests__/CartContext.test.tsx) checks
  adding a dish, changing its quantity, placing an order, and clearing the cart.
- [`jest.config.js`](../jest.config.js) configures Jest to transform the
  JavaScript modules used by React Navigation and React Native. Without this,
  Jest can fail while parsing navigation's ES module exports.

From the project root, run:

```sh
npx tsc --noEmit
npx eslint App.tsx src __tests__
npm test -- --runInBand
```

For iOS development, start Metro in one terminal and launch the app from another:

```sh
npm start
npm run ios
```

For Android, use `npm run android` with an Android emulator or device available.
Follow the React Native environment setup instructions for the required native
toolchains. The current Metro server and simulator processes may already be
running in a developer session.

## 7. Known limitations and sensible next steps

This is an interactive frontend prototype, not a production restaurant
ordering system:

- **No backend:** menu and orders are hard-coded or held in memory; no order is
  transmitted to a restaurant.
- **No persistence or accounts:** closing/reloading the app clears the cart and
  order history.
- **No real payments:** the payment selection is informational only.
- **No live order status:** new orders start as `Preparing`; no courier or
  restaurant updates the status.
- **No production delivery rules:** address validation, delivery zones, taxes,
  fees, inventory, and business hours are not implemented.

A production roadmap would be: define the restaurant/order API; add secure
authentication if needed; load menu and pricing from the server; create orders
server-side with server-validated totals; integrate a payment provider without
handling raw card details in the app; persist order history; then add status
updates and tests for API failures and checkout edge cases.

