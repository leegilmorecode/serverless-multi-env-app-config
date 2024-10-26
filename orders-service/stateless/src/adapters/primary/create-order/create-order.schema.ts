export const schema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'FastFoodOrder',
  description: 'A schema representing a fast food order',
  type: 'object',
  properties: {
    orderDate: {
      type: 'string',
      format: 'date-time',
      description: 'Date and time the order was placed',
    },
    customer: {
      type: 'object',
      properties: {
        customerId: {
          type: 'string',
          description: 'Unique identifier for the customer',
        },
        name: {
          type: 'string',
          description: 'Name of the customer',
        },
        phone: {
          type: 'string',
          description: "Customer's contact number",
        },
        email: {
          type: 'string',
          format: 'email',
          description: "Customer's email address",
        },
        address: {
          type: 'object',
          properties: {
            street: { type: 'string' },
            city: { type: 'string' },
            state: { type: 'string' },
            zip: { type: 'string' },
          },
          required: ['street', 'city', 'state', 'zip'],
          description: "Customer's delivery address",
        },
      },
      required: ['customerId', 'name'],
    },
    items: {
      type: 'array',
      description: 'List of items in the order',
      items: {
        type: 'object',
        properties: {
          itemId: {
            type: 'string',
            description: 'Unique identifier for the item',
          },
          name: {
            type: 'string',
            description: 'Name of the item',
          },
          quantity: {
            type: 'integer',
            minimum: 1,
            description: 'Quantity of the item',
          },
          price: {
            type: 'number',
            minimum: 0,
            description: 'Price per unit of the item',
          },
          customizations: {
            type: 'array',
            description: 'List of customizations for the item',
            items: {
              type: 'object',
              properties: {
                type: {
                  type: 'string',
                  description:
                    "Type of customization, e.g., 'extra cheese', 'no onions'",
                },
                price: {
                  type: 'number',
                  minimum: 0,
                  description: 'Additional cost for this customization',
                },
              },
            },
          },
        },
        required: ['itemId', 'name', 'quantity', 'price'],
      },
    },
    totalAmount: {
      type: 'number',
      minimum: 0,
      description:
        'Total amount for the order including all items and customizations',
    },
    payment: {
      type: 'object',
      properties: {
        method: {
          type: 'string',
          enum: ['credit_card', 'debit_card', 'cash', 'digital_wallet'],
          description: 'Payment method used',
        },
        transactionId: {
          type: 'string',
          description: 'Transaction ID if payment is not cash',
        },
        status: {
          type: 'string',
          enum: ['pending', 'completed', 'failed'],
          description: 'Status of the payment',
        },
      },
      required: ['method', 'status'],
    },
    status: {
      type: 'string',
      enum: [
        'received',
        'preparing',
        'ready',
        'out_for_delivery',
        'delivered',
        'cancelled',
      ],
      description: 'Current status of the order',
    },
    deliveryType: {
      type: 'string',
      enum: ['delivery', 'pickup'],
      description: 'Whether the order is for delivery or pickup',
    },
  },
  required: [
    'orderDate',
    'customer',
    'items',
    'totalAmount',
    'payment',
    'status',
    'deliveryType',
  ],
};
