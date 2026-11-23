
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Recipe } from '../types/recipe';

const RECENT_KEY = 'recently_viewed_recipes';
const MAX_RECENT = 10;

export async function getRecentRecipes(): Promise<Recipe[]> {
  try {
    const saved = await AsyncStorage.getItem(RECENT_KEY);
    return saved ? JSON.parse(saved) as Recipe[] : [];
  } catch (error) {
    console.log('Error loading recent recipes:', error);
    return [];
  }
}

export async function addRecentRecipe(recipe: Recipe): Promise<void> {
  try {
    const oldRecipes = await getRecentRecipes();

    const updatedRecipes = [
      recipe,
      ...oldRecipes.filter(item => item.idMeal !== recipe.idMeal)
    ].slice(0, MAX_RECENT);

    await AsyncStorage.setItem(
      RECENT_KEY,
      JSON.stringify(updatedRecipes)
    );
  } catch (error) {
    console.log('Error saving recent recipe:', error);
  }
}

export async function clearRecentRecipes(): Promise<void> {
  await AsyncStorage.removeItem(RECENT_KEY);
}
