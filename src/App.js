import React from 'react';
import AppShell from './layout/AppShell';
import { OrderProvider } from './context/OrderProvider';
import { ProductProvider } from './context/ProductProvider';
function App() {

  return (
    <>
    <ProductProvider>
      <OrderProvider>
        <AppShell/>
      </OrderProvider>
    </ProductProvider>
    </>
  );
}

export default App;
