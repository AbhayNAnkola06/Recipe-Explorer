
import axios from 'axios';
import type { Recipe, RecipeResponse } from '../types/recipe';

const API_URL = 'https://www.themealdb.com/api/json/v1/1';

export async function getRecipes(): Promise<Recipe[]> {
  const response = await axios.get<RecipeResponse>(
    `${API_URL}/search.php?s=chicken`
  );

  return response.data.meals || [];
}

export async function searchRecipes(query: string): Promise<Recipe[]> {
  const response = await axios.get<RecipeResponse>(
    `${API_URL}/search.php?s=${encodeURIComponent(query)}`
  );

  return response.data.meals || [];
}

export async function getRecipeById(id: string): Promise<Recipe | null> {
  const response = await axios.get<RecipeResponse>(
    `${API_URL}/lookup.php?i=${id}`
  );

  return response.data.meals?.[0] || null;
}

export async function getRandomRecipe(): Promise<Recipe | null> {
  const response = await axios.get<RecipeResponse>(
    `${API_URL}/random.php`
  );

  return response.data.meals?.[0] || null;
}

export async function getCategories(): Promise<string[]> {
  const response = await axios.get(
    `${API_URL}/list.php?c=list`
  );

  return (response.data.meals || []).map(
    (item: { strCategory: string }) => item.strCategory
  );
}

export async function getAreas(): Promise<string[]> {
  const response = await axios.get(
    `${API_URL}/list.php?a=list`
  );

  return (response.data.meals || []).map(
    (item: { strArea: string }) => item.strArea
  );
}

export async function getRecipesByCategory(
  category: string
): Promise<Recipe[]> {
  const response = await axios.get<RecipeResponse>(
    `${API_URL}/filter.php?c=${encodeURIComponent(category)}`
  );

  return response.data.meals || [];
}

export async function getRecipesByArea(
  area: string
): Promise<Recipe[]> {
  const response = await axios.get<RecipeResponse>(
    `${API_URL}/filter.php?a=${encodeURIComponent(area)}`
  );

  return response.data.meals || [];
}

export async function searchByIngredient(
  ingredient: string
): Promise<Recipe[]> {
  const response = await axios.get<RecipeResponse>(
    `${API_URL}/filter.php?i=${encodeURIComponent(ingredient)}`
  );

  return response.data.meals || [];
}
