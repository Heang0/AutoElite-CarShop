export interface NotificationItem {
  id: number;
  title: string;
  description: string;
  time: string;
  icon: string;
  details: string;
}

export const NOTIFICATION_ITEMS: NotificationItem[] = [
  {
    id: 1,
    title: 'New offer on BMW M5',
    description: 'Price lowered by 3% for a limited time.',
    time: '2m ago',
    icon: 'diamond-outline'
    ,
    details: 'We just dropped the price to $112,000 for the M5 Competition. Limited stock, reserve by today.'
  },
  {
    id: 2,
    title: 'Tesla Model S plaid',
    description: 'Arrived in-store with fresh photos.',
    time: '15m ago',
    icon: 'flash-outline'
    ,
    details: 'Fresh photos uploaded to the gallery along with a 360° interior tour.'
  },
  {
    id: 3,
    title: 'Service reminder',
    description: 'Your favorited car is due for maintenance.',
    time: '1h ago',
    icon: 'car-sport-outline'
    ,
    details: 'Schedule your complimentary service before the APR promo ends.'
  },
  {
    id: 4,
    title: 'New comment on Mercedes',
    description: 'A customer asked about delivery timelines.',
    time: '3h ago',
    icon: 'star'
    ,
    details: 'Customer is asking about delivery times for Mercedes-Benz S-Class, follow up today.'
  }
];
