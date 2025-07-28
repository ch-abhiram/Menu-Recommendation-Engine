const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const masterMenu = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'master-menu.json'), 'utf8'));

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function getDayBasedTasteProfile(day) {
    const dayProfiles = {
        'Monday': 'sweet',
        'Tuesday': 'savory',
        'Wednesday': 'savory',
        'Thursday': 'mix-and-match',
        'Friday': 'spicy',
        'Saturday': 'mix-and-match',
        'Sunday': 'sweet'
    };
    return dayProfiles[day] || 'mix-and-match';
}

function determineComboTasteProfile(mainCourse, sideDish, drink, dayProfile) {
    const profiles = [mainCourse.tasteProfile, sideDish.tasteProfile, drink.tasteProfile];
    
    if (dayProfile === 'mix-and-match') {
        const uniqueProfiles = [...new Set(profiles)];
        if (uniqueProfiles.length === 1) {
            return uniqueProfiles[0];
        } else {
            return 'mix-and-match';
        }
    } else {
        const matchingProfiles = profiles.filter(p => p === dayProfile);
        if (matchingProfiles.length >= 2) {
            return dayProfile;
        } else {
            return 'mix-and-match';
        }
    }
}

function generateComboRemarks(mainCourse, sideDish, drink, comboProfile) {
    const remarks = [];
    
    if (comboProfile === 'sweet') {
        remarks.push("A delightful sweet combination perfect for those with a sweet tooth.");
    } else if (comboProfile === 'savory') {
        remarks.push("A rich savory combination that satisfies hearty appetites.");
    } else if (comboProfile === 'spicy') {
        remarks.push("A bold spicy combination for those who love heat and flavor.");
    } else {
        remarks.push("A balanced mix-and-match combination offering diverse flavors.");
    }
    
    remarks.push(`Features ${mainCourse.name} with ${sideDish.name} and ${drink.name}.`);
    return remarks.join(' ');
}

function isComboUnique(combo, allCombos) {
    const comboSignature = `${combo.mainCourse.id}-${combo.sideDish.id}-${combo.drink.id}`;
    return !allCombos.some(existingCombo => 
        `${existingCombo.mainCourse.id}-${existingCombo.sideDish.id}-${existingCombo.drink.id}` === comboSignature
    );
}

function areItemsUniqueWithinDay(combo, dayCombos) {
    const usedItems = new Set();
    
    for (const existingCombo of dayCombos) {
        usedItems.add(existingCombo.mainCourse.id);
        usedItems.add(existingCombo.sideDish.id);
        usedItems.add(existingCombo.drink.id);
    }
    
    return !usedItems.has(combo.mainCourse.id) && 
           !usedItems.has(combo.sideDish.id) && 
           !usedItems.has(combo.drink.id);
}

function isPopularityBalanced(combo, allCombos) {
    const currentPopularity = combo.mainCourse.popularityScore + combo.sideDish.popularityScore + combo.drink.popularityScore;
    
    if (allCombos.length === 0) return true;
    
    const avgPopularity = allCombos.reduce((sum, c) => 
        sum + c.mainCourse.popularityScore + c.sideDish.popularityScore + c.drink.popularityScore, 0
    ) / allCombos.length;
    
    const deviation = Math.abs(currentPopularity - avgPopularity) / avgPopularity;
    return deviation <= 0.25;
}

function generateDayCombos(selectedMains, selectedSides, selectedDrinks, dayProfile, allCombos) {
    const dayCombos = [];
    const maxAttempts = 3000;
    let attempts = 0;
    
    console.log(`Generating combos for ${dayProfile} profile`);
    console.log(`Selected items: ${selectedMains.length} mains, ${selectedSides.length} sides, ${selectedDrinks.length} drinks`);
    
    while (dayCombos.length < 3 && attempts < maxAttempts) {
        attempts++;
        
        const mainCourse = selectedMains[Math.floor(Math.random() * selectedMains.length)];
        const sideDish = selectedSides[Math.floor(Math.random() * selectedSides.length)];
        const drink = selectedDrinks[Math.floor(Math.random() * selectedDrinks.length)];
        
        const totalCalories = mainCourse.calories + sideDish.calories + drink.calories;
        
        if (totalCalories < 450 || totalCalories > 900) {
            attempts++;
            continue;
        }
        
        const combo = {
            mainCourse,
            sideDish,
            drink,
            totalCalories,
            popularityScore: mainCourse.popularityScore + sideDish.popularityScore + drink.popularityScore
        };
        
        if (!areItemsUniqueWithinDay(combo, dayCombos)) {
            attempts++;
            continue;
        }
        
        const comboProfile = determineComboTasteProfile(mainCourse, sideDish, drink, dayProfile);
        combo.tasteProfile = comboProfile;
        combo.remarks = generateComboRemarks(mainCourse, sideDish, drink, comboProfile);
        
        dayCombos.push(combo);
        console.log(`✅ Generated combo ${dayCombos.length}: ${combo.mainCourse.name} + ${combo.sideDish.name} + ${combo.drink.name} (${combo.totalCalories} cal)`);
    }
    
    if (dayCombos.length < 3) {
        console.log(`⚠️  Warning: Only generated ${dayCombos.length} combos after ${attempts} attempts`);
        console.log('Trying with relaxed constraints...');
        
        while (dayCombos.length < 3 && attempts < maxAttempts * 2) {
            attempts++;
            
            const mainCourse = selectedMains[Math.floor(Math.random() * selectedMains.length)];
            const sideDish = selectedSides[Math.floor(Math.random() * selectedSides.length)];
            const drink = selectedDrinks[Math.floor(Math.random() * selectedDrinks.length)];
            
            const totalCalories = mainCourse.calories + sideDish.calories + drink.calories;
            
            if (totalCalories < 450 || totalCalories > 900) {
                continue;
            }
            
            const combo = {
                mainCourse,
                sideDish,
                drink,
                totalCalories,
                popularityScore: mainCourse.popularityScore + sideDish.popularityScore + drink.popularityScore
            };
            
            if (!areItemsUniqueWithinDay(combo, dayCombos)) {
                continue;
            }
            
            const comboProfile = determineComboTasteProfile(mainCourse, sideDish, drink, dayProfile);
            combo.tasteProfile = comboProfile;
            combo.remarks = generateComboRemarks(mainCourse, sideDish, drink, comboProfile);
            
            dayCombos.push(combo);
            console.log(`✅ Generated fallback combo ${dayCombos.length}: ${combo.mainCourse.name} + ${combo.sideDish.name} + ${combo.drink.name} (${combo.totalCalories} cal)`);
        }
    }
    
    return dayCombos;
}

app.post('/api/recommendations', (req, res) => {
    try {
        console.log('Received recommendation request:', req.body);
        
        const { currentDay } = req.body;
        
        if (!currentDay) {
            console.log('Error: No current day provided');
            return res.status(400).json({ error: 'Current day is required' });
        }
        
        const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        if (!validDays.includes(currentDay)) {
            console.log('Error: Invalid day provided:', currentDay);
            return res.status(400).json({ error: 'Invalid day. Please use: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday' });
        }
        
        const dayProfile = getDayBasedTasteProfile(currentDay);
        
        const recommendations = [];
        const allCombos = [];
        
        for (let i = 0; i < 7; i++) {
            const dayIndex = (validDays.indexOf(currentDay) + i) % 7;
            const dayName = validDays[dayIndex];
            const dayProfileForDay = getDayBasedTasteProfile(dayName);
            
            const shuffledMains = shuffleArray(masterMenu.mainCourses);
            const shuffledSides = shuffleArray(masterMenu.sideDishes);
            const shuffledDrinks = shuffleArray(masterMenu.drinks);
            
            const selectedMains = shuffledMains.slice(0, 5);
            const selectedSides = shuffledSides.slice(0, 4);
            const selectedDrinks = shuffledDrinks.slice(0, 4);
            
            const dayCombos = generateDayCombos(selectedMains, selectedSides, selectedDrinks, dayProfileForDay, allCombos);
            
            if (dayCombos.length < 3) {
                return res.status(500).json({ 
                    error: `Unable to generate 3 unique combos for ${dayName}. Please try again.` 
                });
            }
            
            allCombos.push(...dayCombos);
            
            recommendations.push({
                day: dayName,
                tasteProfile: dayProfileForDay,
                combos: dayCombos.map((combo, index) => ({
                    comboId: `Meal ${index + 1}`,
                    mainCourse: {
                        name: combo.mainCourse.name,
                        calories: combo.mainCourse.calories,
                        tasteProfile: combo.mainCourse.tasteProfile,
                        popularityScore: combo.mainCourse.popularityScore,
                        remarks: combo.mainCourse.remarks
                    },
                    sideDish: {
                        name: combo.sideDish.name,
                        calories: combo.sideDish.calories,
                        tasteProfile: combo.sideDish.tasteProfile,
                        popularityScore: combo.sideDish.popularityScore,
                        remarks: combo.sideDish.remarks
                    },
                    drink: {
                        name: combo.drink.name,
                        calories: combo.drink.calories,
                        tasteProfile: combo.drink.tasteProfile,
                        popularityScore: combo.drink.popularityScore,
                        remarks: combo.drink.remarks
                    },
                    totalCalories: combo.totalCalories,
                    totalPopularityScore: combo.popularityScore,
                    comboTasteProfile: combo.tasteProfile,
                    comboRemarks: combo.remarks
                }))
            });
        }
        
        console.log('Successfully generated recommendations for:', currentDay);
        res.json({
            success: true,
            inputDay: currentDay,
            recommendations: recommendations,
            generatedAt: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Error generating recommendations:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ 
            error: 'Internal server error',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

app.get('/api/menu', (req, res) => {
    res.json(masterMenu);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Menu Recommendation Engine running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to use the application`);
}); 