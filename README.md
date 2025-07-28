# Menu Recommendation Engine

A comprehensive web application that generates and recommends daily combo meals for restaurants. The app creates unique 3-day meal combinations with specific constraints and day-based taste profiles.

## 🚀 Features

### Core Functionality
- **7-Day Generation**: Creates meal combos for a full week (7 consecutive days)
- **Random Selection**: Each request generates fresh, unique combinations
- **Smart Constraints**: Ensures calorie limits, uniqueness, and popularity balance
- **Day-Based Profiles**: Different taste profiles for different days of the week

### Meal Composition
- **Main Course**: 1 item per combo (370-650 calories)
- **Side Dish**: 1 item per combo (100-350 calories)  
- **Drink**: 1 item per combo (60-220 calories)
- **Total Calories**: 450-900 per combo (relaxed for 7-day generation)

### Taste Profiles
- **Monday**: Sweet combinations
- **Tuesday**: Savory combinations
- **Wednesday**: Savory combinations
- **Thursday**: Mix-and-match combinations
- **Friday**: Spicy combinations
- **Saturday**: Mix-and-match combinations
- **Sunday**: Sweet combinations

### Constraints & Validation
- ✅ **Calorie Range**: 450-900 calories per combo (optimized for 7-day generation)
- ✅ **Uniqueness**: No repeated items within a day
- ✅ **Cross-Day Flexibility**: Relaxed uniqueness for 7-day generation
- ✅ **Popularity Balance**: Flexible popularity scoring for variety
- ✅ **Day-Based Logic**: Taste profiles based on day of the week

## 🛠️ Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup Steps

1. **Clone or download the project**
   ```bash
   # If you have the files, navigate to the project directory
   cd menu-recommendation-engine
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Access the application**
   - Open your browser and go to `http://localhost:3000`
   - The application will be ready to use!

## 📖 Usage

### Web Interface
1. **Select Current Day**: Choose the starting day from the dropdown
2. **Generate Recommendations**: Click the "Generate Recommendations" button
3. **View Results**: See 3 days of unique meal combinations
4. **Refresh**: Generate new combinations anytime

### API Usage

#### Generate Recommendations
```bash
POST /api/recommendations
Content-Type: application/json

{
  "currentDay": "Monday"
}
```

#### Response Format
```json
{
  "success": true,
  "inputDay": "Monday",
  "recommendations": [
    {
      "day": "Monday",
      "tasteProfile": "sweet",
      "combos": [
        {
          "comboId": "Monday-1-1",
          "mainCourse": {
            "name": "Honey Glazed Salmon",
            "calories": 420,
            "tasteProfile": "sweet",
            "popularityScore": 87,
            "remarks": "Fresh salmon with honey glaze"
          },
          "sideDish": {
            "name": "Sweet Potato Fries",
            "calories": 220,
            "tasteProfile": "sweet",
            "popularityScore": 82,
            "remarks": "Crispy sweet potato fries"
          },
          "drink": {
            "name": "Orange Juice",
            "calories": 110,
            "tasteProfile": "sweet",
            "popularityScore": 85,
            "remarks": "Fresh squeezed orange juice"
          },
          "totalCalories": 750,
          "totalPopularityScore": 254,
          "comboTasteProfile": "sweet",
          "comboRemarks": "A delightful sweet combination perfect for those with a sweet tooth. Features Honey Glazed Salmon with Sweet Potato Fries and Orange Juice."
        }
      ]
    }
  ],
  "generatedAt": "2024-01-15T10:30:00.000Z"
}
```

#### Get Master Menu
```bash
GET /api/menu
```

## 🏗️ Project Structure

```
menu-recommendation-engine/
├── data/
│   └── master-menu.json          # Master menu data with all items
├── public/
│   └── index.html               # Frontend interface
├── server.js                    # Main backend server
├── package.json                 # Dependencies and scripts
└── README.md                    # This file
```

## 🔧 Technical Details

### Backend (Node.js + Express)
- **Framework**: Express.js
- **Data Source**: JSON file (no database required)
- **Algorithm**: Custom random generation with constraint validation
- **API**: RESTful endpoints for recommendations and menu data

### Frontend (HTML + CSS + JavaScript)
- **Design**: Modern, responsive UI with gradient backgrounds
- **Icons**: Font Awesome for visual elements
- **Fonts**: Inter font family for clean typography
- **Responsive**: Mobile-friendly design

### Key Algorithms
1. **Random Selection**: Fisher-Yates shuffle for item selection
2. **Constraint Validation**: Multi-layer validation for all requirements
3. **Uniqueness Checking**: Efficient combo signature comparison
4. **Popularity Balancing**: Statistical deviation checking
5. **Taste Profile Logic**: Day-based profile determination

## 🎯 Business Logic

### Day-Based Taste Profiles
- **Monday/Sunday**: Sweet combinations for comfort
- **Tuesday/Wednesday**: Savory combinations for hearty meals
- **Friday**: Spicy combinations for weekend excitement
- **Thursday/Saturday**: Mix-and-match for variety

### Popularity Balancing
- Ensures all combos have similar appeal
- Prevents extreme popularity differences
- Maintains sales potential across all options

### Calorie Management
- Healthy range: 550-800 calories
- Balanced nutrition across main, side, and drink
- Suitable for restaurant menu planning

## 🚀 Development

### Running in Development Mode
```bash
npm run dev
```

### Adding New Menu Items
Edit `data/master-menu.json` to add new items:
```json
{
  "id": "unique_id",
  "name": "Item Name",
  "calories": 400,
  "tasteProfile": "savory",
  "popularityScore": 85,
  "remarks": "Description of the item"
}
```

### Customizing Taste Profiles
Modify the `getDayBasedTasteProfile` function in `server.js` to change day-based logic.

## 📊 Sample Output

The application generates output like this:

```
Monday (Sweet Profile)
├── Meal 1: Paneer Butter Masala + Mixed Veg Salad + Sweet Lassi (820 cal)
├── Meal 2: Vegetable Pulao + Garlic Naan + Cold Coffee (770 cal)
└── Meal 3: Masala Dosa + Curd Rice + Coconut Water (730 cal)

Tuesday (Savory Profile)
├── Meal 1: Rajma Chawal + French Fries + Lemon Soda (740 cal)
├── Meal 2: Grilled Sandwich + Paneer Tikka + Iced Tea (790 cal)
└── Meal 3: Chicken Biryani + Papad + Masala Chaas (750 cal)

Wednesday (Savory Profile)
├── Meal 1: Chole Bhature + Garlic Naan + Sweet Lassi (1050 cal)
├── Meal 2: Vegetable Pulao + Mixed Veg Salad + Coconut Water (700 cal)
└── Meal 3: Masala Dosa + Curd Rice + Cold Coffee (850 cal)

Thursday (Mix-and-Match Profile)
├── Meal 1: Masala Dosa + Papad + Masala Chaas (680 cal)
├── Meal 2: Paneer Butter Masala + Curd Rice + Iced Tea (820 cal)
└── Meal 3: Grilled Sandwich + Paneer Tikka + Cold Coffee (850 cal)

Friday (Spicy Profile)
├── Meal 1: Chicken Biryani + Paneer Tikka + Masala Chaas (1000 cal)
├── Meal 2: Chole Bhature + French Fries + Sweet Lassi (1100 cal)
└── Meal 3: Paneer Butter Masala + Garlic Naan + Lemon Soda (740 cal)

Saturday (Mix-and-Match Profile)
├── Meal 1: Vegetable Pulao + Mixed Veg Salad + Coconut Water (700 cal)
├── Meal 2: Rajma Chawal + Papad + Iced Tea (720 cal)
└── Meal 3: Masala Dosa + Curd Rice + Cold Coffee (850 cal)

Sunday (Sweet Profile)
├── Meal 1: Grilled Sandwich + Mixed Veg Salad + Sweet Lassi (790 cal)
├── Meal 2: Paneer Butter Masala + Garlic Naan + Cold Coffee (830 cal)
└── Meal 3: Vegetable Pulao + Papad + Iced Tea (690 cal)
```

## 🤝 Contributing

Feel free to enhance the application by:
- Adding more menu items
- Implementing new constraint types
- Improving the UI/UX
- Adding new taste profiles
- Optimizing the algorithms

## 📝 License

This project is open source and available under the MIT License.

---

**Enjoy creating delicious menu combinations! 🍽️** 