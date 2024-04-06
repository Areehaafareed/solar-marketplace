// Sample data for products
export const solarProducts = [
  {
    id: 1,
    category: "Solar Panels",
    name: "High Efficiency Solar Panel",
    description:
      "High-efficiency solar panel for residential and commercial use. Generate clean energy and reduce your carbon footprint.",
    image_URL: "../Assets/solarpanel.jpg",

    shop: {
      name: "Dawson Electrics",
      shop_avatar: {
        public_id: "solar-tech-avatar",
        url: "/Assets/dawson.jpg",
      },
      ratings: 4.5,
    },
    price: 39.99,
    discount_price: 35.99,
    rating: 4.5,
    total_sell: 50,
    stock: 20,
  },
  {
    id: 2,
    category: "Solar Inverters",
    name: "Smart Solar Inverter",
    description:
      "Smart solar inverter with real-time monitoring. Efficiently convert solar energy into usable electricity.",
    image_URL: "../Assets/inverter.jpg",
    shop: {
      name: "Smart Solarz Solutions",
      shop_avatar: {
        public_id: "green-power-avatar",
        url: "/Assets/smart.png",
      },
      ratings: 4.2,
    },
    price: 59.99,
    discount_price: 54.99,
    rating: 4.2,
    total_sell: 30,
    stock: 15,
  },
  {
    id: 3,
    category: "Solar Batteries",
    name: "Long Life Solar Battery",
    description:
      "Long-lasting lithium-ion battery for solar storage. Store excess energy during the day for use during the night or cloudy days.",
    image_URL: "/Assets/battery.jpg",
    shop: {
      name: "Electronics Hub",
      shop_avatar: {
        public_id: "eco-storage-avatar",
        url: "/Assets/hub.jpg",
      },
      ratings: 4.0,
    },
    price: 79.99,
    discount_price: 74.99,
    rating: 4.0,
    total_sell: 25,
    stock: 12,
  },
  {
    id: 4,
    category: "Solar Lights",
    name: "Outdoor Solar Lights Set",
    description:
      "Illuminate your outdoor space with this set of energy-efficient solar lights. Ideal for gardens, pathways, and outdoor decor.",
    image_URL: "../Assets/outdoor.png",
    shop: {
      name: "Amazon",
      shop_avatar: {
        public_id: "sunshine-lighting-avatar",
        url: "/Assets/ama.png",
      },
      ratings: 4.8,
    },
    price: 49.99,
    discount_price: 39.99,
    rating: 4.8,
    total_sell: 40,
    stock: 18,
  },
  {
    id: 5,
    category: "Solar Chargers",
    name: "Portable Solar Charger",
    description:
      "Stay charged on the go with this portable solar phone charger. Perfect for camping, hiking, and outdoor adventures.",
    image_URL: "../Assets/portable.jpg",
    shop: {
      name: "Daraz",
      shop_avatar: {
        public_id: "solar-gadget-avatar",
        url: "/Assets/daraz.png",
      },
      ratings: 4.5,
    },
    price: 30.99,
    discount_price: 24.99,
    rating: 4.5,
    total_sell: 35,
    stock: 3,
  },
  {
    id: 6,
    category: "Solar Water Heaters",
    name: "Compact Water Heater",
    description:
      "Efficient and compact solar water heater for eco-friendly hot water solutions.",
    image_URL: "/Assets/water.jpg",
    shop: {
      name: "Honey's Air & Solar",
      shop_avatar: {
        public_id: "solar-fan-avatar",
        url: "/Assets/target.png",
      },
      ratings: 4.4,
    },
    price: 27.99,
    discount_price: 25.99,
    rating: 4.7,
    total_sell: 30,
    stock: 20,
  },
  {
    id: 7,
    category: "Solar Chargers",
    name: "Foldable Solar Charger",
    description:
      "Charge your devices on the go with this foldable solar phone charger.",
    image_URL: "/Assets/folder.jpg",
    shop: {
      name: "Shopping Express",
      shop_avatar: {
        public_id: "solar-charger-avatar",
        url: "/Assets/bestbuy.png",
      },
      ratings: 4.6,
    },
    price: 49.99,
    discount_price: 44.99,
    rating: 4.6,
    total_sell: 45,
    stock: 4,
  },
  {
    id: 8,
    category: "Solar Fans",
    name: "Quiet Solar Powered Fan",
    description:
      "Stay cool with this quiet and energy-efficient solar-powered fan for your home or office.",
    image_URL: "/Assets/fan.jpg",
    shop: {
      name: "Honey's Air & Solar",
      shop_avatar: {
        public_id: "solar-fan-avatar",
        url: "/Assets/target.png",
      },
      ratings: 4.4,
    },
    price: 79.99,
    discount_price: 69.99,
    rating: 4.4,
    total_sell: 35,
    stock: 9,
  },
  {
    id: 9,
    category: "Solar Garden Lights",
    name: " Solar Garden Lights",
    description:
      "Enhance your garden with these decorative solar-powered LED lights for a magical ambiance.",
    image_URL: "/Assets/garden.jpg",
    shop: {
      name: "Kohl's",
      shop_avatar: {
        public_id: "solar-garden-lights-avatar",
        url: "/Assets/kohls.png",
      },
      ratings: 4.6,
    },
    price: 29.99,
    discount_price: 24.99,
    rating: 4.6,
    total_sell: 30,
    stock: 12,
  },
];

// navigation Data
export const navItems = [
  {
    title: "Home",
    url: "/",
  },
  {
    title: "Solar Packages",
    url: "/solarPackages",
  },
  {
    title: "Products",
    url: "/products",
  },
  {
    title: "Contact Us",
    url: "/contactUs",
  },
  {
    title: "FAQ",
    url: "/faq",
  },
];

// branding data
export const brandingData = [
  {
    id: 1,
    title: "Free Shipping",
    Description: "From all orders over 100$",
    icon: (
      <svg
        width="30"
        height="30"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1 1H5.63636V24.1818H35"
          stroke="#FFBB38"
          stroke-width="2"
          stroke-miterlimit="10"
          stroke-linecap="square"
        ></path>
        <path
          d="M8.72763 35.0002C10.4347 35.0002 11.8185 33.6163 11.8185 31.9093C11.8185 30.2022 10.4347 28.8184 8.72763 28.8184C7.02057 28.8184 5.63672 30.2022 5.63672 31.9093C5.63672 33.6163 7.02057 35.0002 8.72763 35.0002Z"
          stroke="#FFBB38"
          stroke-width="2"
          stroke-miterlimit="10"
          stroke-linecap="square"
        ></path>
        <path
          d="M31.9073 35.0002C33.6144 35.0002 34.9982 33.6163 34.9982 31.9093C34.9982 30.2022 33.6144 28.8184 31.9073 28.8184C30.2003 28.8184 28.8164 30.2022 28.8164 31.9093C28.8164 33.6163 30.2003 35.0002 31.9073 35.0002Z"
          stroke="#FFBB38"
          stroke-width="2"
          stroke-miterlimit="10"
          stroke-linecap="square"
        ></path>
        <path
          d="M34.9982 1H11.8164V18H34.9982V1Z"
          stroke="#FFBB38"
          stroke-width="2"
          stroke-miterlimit="10"
          stroke-linecap="square"
        ></path>
        <path
          d="M11.8164 7.18164H34.9982"
          stroke="#FFBB38"
          stroke-width="2"
          stroke-miterlimit="10"
          stroke-linecap="square"
        ></path>
      </svg>
    ),
  },
  {
    id: 2,
    title: "Solar Discounts",
    Description: "Save up to 25% off",
    icon: (
      <svg
        width="30"
        height="30"
        viewBox="0 0 32 34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M31 17.4502C31 25.7002 24.25 32.4502 16 32.4502C7.75 32.4502 1 25.7002 1 17.4502C1 9.2002 7.75 2.4502 16 2.4502C21.85 2.4502 26.95 5.7502 29.35 10.7002"
          stroke="#FFBB38"
          stroke-width="2"
          stroke-miterlimit="10"
        ></path>
        <path
          d="M30.7 2L29.5 10.85L20.5 9.65"
          stroke="#FFBB38"
          stroke-width="2"
          stroke-miterlimit="10"
          stroke-linecap="square"
        ></path>
      </svg>
    ),
  },
  {
    id: 3,
    title: "Cost-Effective Solutions",
    Description: "Budget-friendly solar options",
    icon: (
      <svg
        width="30"
        height="30"
        viewBox="0 0 32 35"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7 13H5.5C2.95 13 1 11.05 1 8.5V1H7"
          stroke="#FFBB38"
          stroke-width="2"
          stroke-miterlimit="10"
        ></path>
        <path
          d="M25 13H26.5C29.05 13 31 11.05 31 8.5V1H25"
          stroke="#FFBB38"
          stroke-width="2"
          stroke-miterlimit="10"
        ></path>
        <path
          d="M16 28V22"
          stroke="#FFBB38"
          stroke-width="2"
          stroke-miterlimit="10"
        ></path>
        <path
          d="M16 22C11.05 22 7 17.95 7 13V1H25V13C25 17.95 20.95 22 16 22Z"
          stroke="#FFBB38"
          stroke-width="2"
          stroke-miterlimit="10"
          stroke-linecap="square"
        ></path>
        <path
          d="M25 34H7C7 30.7 9.7 28 13 28H19C22.3 28 25 30.7 25 34Z"
          stroke="#FFBB38"
          stroke-width="2"
          stroke-miterlimit="10"
          stroke-linecap="square"
        ></path>
      </svg>
    ),
  },
  {
    id: 4,
    title: "Secure Solar Financing",
    Description: "Flexible and secure payment plans",
    icon: (
      <svg
        width="30"
        height="30"
        viewBox="0 0 32 38"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M22.6654 18.667H9.33203V27.0003H22.6654V18.667Z"
          stroke="#FFBB38"
          stroke-width="2"
          stroke-miterlimit="10"
          stroke-linecap="square"
        ></path>
        <path
          d="M12.668 18.6663V13.6663C12.668 11.833 14.168 10.333 16.0013 10.333C17.8346 10.333 19.3346 11.833 19.3346 13.6663V18.6663"
          stroke="#FFBB38"
          stroke-width="2"
          stroke-miterlimit="10"
          stroke-linecap="square"
        ></path>
        <path
          d="M31 22C31 30.3333 24.3333 37 16 37C7.66667 37 1 30.3333 1 22V5.33333L16 2L31 5.33333V22Z"
          stroke="#FFBB38"
          stroke-width="2"
          stroke-miterlimit="10"
          stroke-linecap="square"
        ></path>
      </svg>
    ),
  },
];

export const footerProductLinks = [
  {
    name: "About us",
    link: "/about",
  },
  {
    name: "Join Our Team",
    link: "/careers",
  },
  {
    name: "Our Locations",
  },
  {
    name: "Our Blog",
  },
  {
    name: "Reviews",
    link: "/review",
  },
];

export const footerCompanyLinks = [
  {
    name: "Solar Panels",
  },
  {
    name: "Inverters & Batteries",
  },
  {
    name: "Energy Monitoring",
  },
  {
    name: "Smart Home Solutions",
  },
  {
    name: "Vendor Events",
  },
];

export const footerSupportLinks = [
  {
    name: "FAQ",
    link: "/faq",
  },
  {
    name: "Reviews",
  },
  {
    name: "Contact Us",
    link: "/contactUs",
  },
  {
    name: "Shipping",
  },
  {
    name: "Live chat",
  },
];

// solar packages
export const solarPackagesData = [
  {
    id: 1,
    name: "Standard Solar Package",
    description:
      "Basic solar package for small households. This package includes everything you need to start harnessing solar energy for your home. Enjoy energy savings and environmental benefits with our energy-efficient panels. With easy installation and smart monitoring, managing your energy usage has never been easier.",
    image_URL: "/Assets/solar4.jpg",
    price: 1999.99,
    discount_price: 1876.99,
    capacity: "5 kW",
    warranty: "5 years",
    features: ["Energy-efficient", "Easy installation", "Smart monitoring"],
    shop: {
      name: "Honey's Air & Solar",
      shop_avatar: {
        public_id: "solar-fan-avatar",
        url: "/Assets/target.png",
      },
      ratings: 4.4,
    },
  },
  {
    id: 2,
    name: "Premium Solar Package",
    description:
      "Advanced solar package for larger energy needs. Upgrade to our premium solar package and experience superior performance and reliability. Our high-efficiency panels and remote monitoring capabilities ensure optimal energy production and management. With battery backup for uninterrupted power supply, you can stay powered even during outages.",
    image_URL: "/Assets/premium.png",
    price: 2999.99,
    discount_price: 2742.99,
    capacity: "5.22 kW",
    warranty: "10 years",
    features: ["High efficiency", "Remote monitoring", "Battery backup"],
    shop: {
      name: "Kohl's",
      shop_avatar: {
        public_id: "solar-garden-lights-avatar",
        url: "/Assets/kohls.png",
      },
      ratings: 4.6,
    },
  },
  {
    id: 3,
    name: "Eco-Friendly Solar Bundle",
    description:
      "Go green with our environmentally friendly solar bundle. Reduce your carbon footprint and contribute to a sustainable future with our renewable energy solutions. Our eco-friendly materials ensure minimal environmental impact while providing reliable energy generation. Invest in the future with Smart Solarz Solutions.",
    image_URL: "/Assets/eco.jpg",
    price: 2499.99,
    discount_price: 2000.99,
    capacity: "8 kW",
    warranty: "7 years",
    features: [
      "Renewable energy",
      "Sustainable materials",
      "Low carbon footprint",
    ],
    shop: {
      name: "Smart Solarz Solutions",
      shop_avatar: {
        public_id: "green-power-avatar",
        url: "/Assets/smart.png",
      },
      ratings: 4.2,
    },
  },
  {
    id: 4,
    name: "Smart Home Solar Solution",
    description:
      "Make your home smarter with our integrated solar solution. Take control of your energy usage with our smart home features. From home automation to energy optimization, our solution offers convenience and efficiency. Experience the power of solar with Daraz.",
    image_URL: "/Assets/home.jpg",
    price: 3499.99,
    discount_price: 2566.99,
    capacity: "12 kW",
    warranty: "8 years",
    features: ["Home automation", "Energy optimization", "Voice control"],
    shop: {
      name: "Daraz",
      shop_avatar: {
        public_id: "solar-gadget-avatar",
        url: "/Assets/daraz.png",
      },
      ratings: 4.5,
    },
  },
  {
    id: 5,
    name: "Off-Grid Solar Power System",
    description:
      "Gain independence with our off-grid solar power system. Ideal for remote locations or those seeking energy self-sufficiency, our off-grid system provides reliable power wherever you are. With battery storage and long-term durability, Dawson Electrics offers a solution you can trust.",
    image_URL: "/Assets/offgrid.jpg",
    price: 3999.99,
    discount_price: 3455.99,
    capacity: "15 kW",
    warranty: "12 years",
    features: [
      "Energy self-sufficiency",
      "Battery storage",
      "Remote locations",
    ],
    shop: {
      name: "Dawson Electrics",
      shop_avatar: {
        public_id: "solar-tech-avatar",
        url: "/Assets/dawson.jpg",
      },
      ratings: 4.5,
    },
  },
  {
    id: 6,
    name: "Compact Solar Starter Kit",
    description:
      "Start your solar journey with our compact starter kit. Perfect for small spaces or those new to solar, our starter kit provides an affordable entry point. With easy setup and reliable performance, Dawson Electrics offers a solution tailored to your needs.",
    image_URL: "/Assets/kit.jpg",
    price: 1799.99,
    discount_price: 1500.89,
    capacity: "3 kW",
    warranty: "5 years",
    features: ["Affordable", "Easy setup", "Ideal for small spaces"],
    shop: {
      name: "Dawson Electrics",
      shop_avatar: {
        public_id: "solar-tech-avatar",
        url: "/Assets/dawson.jpg",
      },
      ratings: 4.5,
    },
  },
  {
    id: 7,
    name: "Industrial Solar Power Solution",
    description:
      "Power your industrial operations with our robust solar solution. Designed for heavy-duty performance, our industrial solar solution offers customizable configurations to meet your specific requirements. With industrial-grade components and reliable performance, Amazon provides a solution you can depend on.",
    image_URL: "/Assets/power.jpg",
    price: 5999.99,
    discount_price: 4000.99,
    capacity: "20 kW",
    warranty: "15 years",
    features: [
      "Heavy-duty performance",
      "Customizable configurations",
      "Industrial-grade components",
    ],
    shop: {
      name: "Amazon",
      shop_avatar: {
        public_id: "sunshine-lighting-avatar",
        url: "/Assets/ama.png",
      },
      ratings: 4.8,
    },
  },
];

// categories data
const categoriesData = [
  {
    id: 1,
    title: "Residential Solar Solutions",
    subTitle: "Rooftop solar panels, energy storage, water heaters",
    image_Url: "../Assets/residentialSolarImage.jpg",
  },
  {
    id: 2,
    title: "Community Solar Projects",
    subTitle: "Community-based initiatives, shared solar projects",
    image_Url: "../Assets/community.jpg",
  },

  {
    id: 3,
    title: "Industrial Solar Solutions",
    subTitle:
      "Large-scale installations, industrial processes, energy management",
    image_Url: "../Assets/industrial-solar-image-url.jpg",
  },
  {
    id: 4,
    title: "Agricultural Solar Solutions",
    subTitle: "Solar-powered irrigation, water pumps, farm solutions",
    image_Url: "../Assets/agricultural.jpg",
  },
  {
    id: 5,
    title: "Solar Energy Storage",
    subTitle: "Battery solutions, off-grid systems, backup power",
    image_Url: "../Assets/solarenergy.jpg",
  },
  {
    id: 6,
    title: "Commercial Solar Solutions",
    subTitle: "Solar installations, financing, energy-efficient solutions",
    image_Url: "/Assets/commercialSolarImage.jpg",
  },

  // {
  //   id: 7,
  //   title: "Solar Maintenance and Support",
  //   subTitle: "Maintenance services, troubleshooting, customer support",
  //   image_Url: "solar-maintenance-image-url.jpg",
  // },
];

// Sample data for vendors
const vendors = [
  {
    id: 1,
    companyName: "SunPower Solar Solutions",
    logo: "sunpower-logo.png",
    contactPerson: "John Doe",
    email: "john.doe@sunpower.com",
    phoneNumber: "123-456-7890",
    address: "123 Solar Street, Sunny City",
    businessLicense: "business-license-sunpower.pdf",
    vatNumber: "VAT123456",
  },
  {
    id: 2,
    companyName: "EcoSolar Technologies",
    logo: "ecosolar-logo.png",
    contactPerson: "Jane Smith",
    email: "jane.smith@ecosolar.com",
    phoneNumber: "987-654-3210",
    address: "456 Renewable Avenue, Green Town",
    businessLicense: "business-license-ecosolar.pdf",
    vatNumber: "VAT789012",
  },
  // Add more vendor entries as needed
];

// Sample data for user
const user = {
  id: 1,
  fullName: "Alice Smith",
  email: "alice.smith@gmail.com",
  // Add more user details as needed
};

// Sample data for cart and wishlist
const cart = [
  {
    productId: 1,
    quantity: 2,
  },
  {
    productId: 3,
    quantity: 1,
  },
  // Add more cart entries as needed
];

const wishlist = [
  {
    productId: 2,
  },
  {
    productId: 3,
  },
  // Add more wishlist entries as needed
];

// Sample data for orders
const orders = [
  {
    id: 1,
    products: [
      {
        productId: 1,
        quantity: 1,
      },
      {
        productId: 3,
        quantity: 2,
      },
      // Add more product entries as needed
    ],
    totalPrice: 1400,
    orderDate: "2024-03-01",
    status: "Delivered",
  },
  {
    id: 2,
    products: [
      {
        productId: 2,
        quantity: 1,
      },
      // Add more product entries as needed
    ],
    totalPrice: 500,
    orderDate: "2024-03-05",
    status: "Shipped",
  },
  // Add more order entries as needed
];

export { vendors, user, cart, wishlist, orders, categoriesData };
