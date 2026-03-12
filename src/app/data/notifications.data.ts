export interface NotificationItem {
  id: string | number;
  title: string;
  description: string;
  time: string;
  icon: string;
  details: string;
  route?: string;
}
