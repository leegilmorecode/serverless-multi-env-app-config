export interface Order {
  id: string;
  created: string;
  updated: string;
  orderDate: string;
  customer: {
    customerId: string;
    name: string;
    phone?: string;
    email?: string;
    address: {
      street: string;
      city: string;
      state: string;
      zip: string;
    };
  };
  items: Array<{
    itemId: string;
    name: string;
    quantity: number;
    price: number;
    customizations?: Array<{
      type: string;
      price?: number;
    }>;
  }>;
  totalAmount: number;
  payment: {
    method: 'credit_card' | 'debit_card' | 'cash' | 'digital_wallet';
    transactionId?: string;
    status: 'pending' | 'completed' | 'failed';
  };
  status:
    | 'received'
    | 'preparing'
    | 'ready'
    | 'out_for_delivery'
    | 'delivered'
    | 'cancelled';
  deliveryType: 'delivery' | 'pickup';
}
