import {
  ShoppingBag,
  Forklift,
  LayoutDashboard,
  ChartBar,
  Banknote,
  Gauge,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Dashboards",
    items: [
      {
        title: "Home",
        url: "/dashboard/default",
        icon: LayoutDashboard,
      },
      {
        title: "Products",
        url: "/dashboard/default/products",
        icon: ChartBar,
      },
      {
        title: "Orders",
        url: "/dashboard/default/orders",
        icon: Banknote,
      },
      {
        title: "Announcements",
        url: "/dashboard/default/announcements",
        icon: Gauge,
      },
      {
        title: "Countdown",
        url: "/dashboard/default/countdowns",
        icon: ShoppingBag,
      },
      {
        title: "Videos",
        url: "/dashboard/default/videos",
        icon: ShoppingBag,
      },
    ],
  },
];
