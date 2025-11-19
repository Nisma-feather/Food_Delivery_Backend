const mongoose = require("mongoose");
const FoodItem = require("./models/FoodItem");
require('dotenv').config()
mongoose.connect(process.env.MONGODB_URI).then(()=>{
    console.log("mongo connected");
    
}).catch((e)=>console.log(e));


const dummyFoods = [
  {
    name: "Veg Biriyani",
    description: "Fragrant rice with mixed vegetables",
    price: 150,
    image: "veg-biriyani.jpg",
    categories: ["690ecae52b6d5ef6f9234687", "690ec97d2b6d5ef6f923467c"],
  },
  {
    name: "Paneer Butter Masala",
    description: "Creamy paneer curry with tomato gravy",
    price: 180,
    image: "paneer.jpg",
    categories: ["690ec97d2b6d5ef6f923467c", "6914906e17541b7b4e5d4c44"], // Veg, Fast Food
  },
  {
    name: "Butter Chicken",
    description: "Rich tomato-based chicken curry",
    price: 210,
    image: "butter-chicken.jpg",
    categories: ["6914903d17541b7b4e5d4c3b"],
  },
  {
    name: "Chicken Curry",
    description: "Spicy and flavorful chicken curry",
    price: 180,
    image: "chicken-curry.jpg",
    categories: ["6914903d17541b7b4e5d4c3b"],
  },
  {
    name: "Masala Dosa",
    description:
      "Crispy dosa stuffed with spiced potato filling, served with chutney and sambar.",
    price: 80,
    image: "https://example.com/masala-dosa.jpg",
    categories: ["690ec97d2b6d5ef6f923467c", "6914906e17541b7b4e5d4c44"],
  },
  {
    name: "Chicken Chettinad",
    description:
      "Spicy Chettinad-style chicken curry rich in aromatic masalas.",
    price: 180,
    image: "https://example.com/chicken-chettinad.jpg",
    categories: ["6914903d17541b7b4e5d4c3b"],
  },
  {
    name: "Mutton Sukka",
    description: "Dry-fried mutton pieces cooked with spices and curry leaves.",
    price: 220,
    image: "https://example.com/mutton-sukka.jpg",
    categories: ["6914903d17541b7b4e5d4c3b"],
  },
  {
    name: "Fish Fry",
    description: "Marinated seer fish shallow fried till crispy golden.",
    price: 200,
    image: "https://example.com/fish-fry.jpg",
    categories: ["6914903d17541b7b4e5d4c3b", "6914905717541b7b4e5d4c3e"],
  },
  {
    name: "Prawn Curry",
    description:
      "Juicy prawns cooked in coconut milk gravy with South Indian spices.",
    price: 230,
    image: "https://example.com/prawn-curry.jpg",
    categories: ["6914905717541b7b4e5d4c3e", "6914903d17541b7b4e5d4c3b"],
  },
  {
    name: "Vegetable Kurma",
    description: "Mixed vegetables cooked in creamy coconut gravy.",
    price: 120,
    image: "https://example.com/veg-kurma.jpg",
    categories: ["690ec97d2b6d5ef6f923467c"],
  },
  {
    name: "Chicken Biriyani (Malabar Style)",
    description:
      "Fragrant biriyani made with tender chicken and aromatic spices.",
    price: 190,
    image: "https://example.com/malabar-biriyani.jpg",
    categories: ["690ecae52b6d5ef6f9234687", "6914903d17541b7b4e5d4c3b"],
  },
  {
    name: "Mutton Biriyani (Thalassery)",
    description:
      "Classic Kerala-style biriyani made with short-grain rice and mutton.",
    price: 220,
    image: "https://example.com/thalassery-biriyani.jpg",
    categories: ["690ecae52b6d5ef6f9234687", "6914903d17541b7b4e5d4c3b"],
  },
  {
    name: "Appam with Stew",
    description:
      "Soft appams served with mildly spiced coconut-based vegetable stew.",
    price: 100,
    image: "https://example.com/appam-stew.jpg",
    categories: ["690ec97d2b6d5ef6f923467c"],
  },
  {
    name: "Kothu Parotta",
    description: "Shredded parotta stir-fried with eggs, chicken, and spices.",
    price: 140,
    image: "https://example.com/kothu-parotta.jpg",
    categories: ["6914906e17541b7b4e5d4c44", "6914903d17541b7b4e5d4c3b"],
  },
  {
    name: "Egg Curry",
    description: "Boiled eggs simmered in flavorful curry sauce.",
    price: 110,
    image: "https://example.com/egg-curry.jpg",
    categories: ["6914903d17541b7b4e5d4c3b"],
  },
  {
    name: "Poori Masala",
    description: "Deep-fried poori served with mildly spiced potato curry.",
    price: 90,
    image: "https://example.com/poori-masala.jpg",
    categories: ["690ec97d2b6d5ef6f923467c", "6914906e17541b7b4e5d4c44"],
  },

  {
    name: "Payasam",
    description: "Sweet milk-based dessert with vermicelli or rice.",
    price: 100,
    image: "https://example.com/payasam.jpg",
    categories: ["6914906117541b7b4e5d4c41"],
  },
  {
    name: "Idiyappam with Egg Curry",
    description: "String hoppers served with spicy egg curry.",
    price: 130,
    image: "https://example.com/idiyappam-egg-curry.jpg",
    categories: ["6914903d17541b7b4e5d4c3b"],
  },
  {
    name: "Puttu and Kadala Curry",
    description: "Steamed rice cake with spicy black chickpea curry.",
    price: 100,
    image: "https://example.com/puttu-kadala.jpg",
    categories: ["690ec97d2b6d5ef6f923467c"],
  },
  {
    name: "Kerala Parotta with Beef Curry",
    description: "Layered parotta served with spicy Kerala-style beef curry.",
    price: 200,
    image: "https://example.com/beef-curry.jpg",
    categories: ["6914903d17541b7b4e5d4c3b"],
  },
  {
    name: "Mango Smoothie",
    description: "Refreshing mango yogurt smoothie",
    price: 100,
    image: "mango-smoothie.jpg",
    categories: ["6914908017541b7b4e5d4c47", "6914906117541b7b4e5d4c41"],
  },
  {
    name: "Watermelon Juice",
    description: "Fresh and hydrating watermelon juice",
    price: 80,
    image: "watermelon.jpg",
    categories: ["6914908017541b7b4e5d4c47"],
  },
];

FoodItem.insertMany(dummyFoods)
  .then(() =>
    console.log("✅ South Indian dummy food items added successfully")
  )
  .catch((err) => console.log(err))
  .finally(() => mongoose.connection.close());
