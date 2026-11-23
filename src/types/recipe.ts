
export type Recipe = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
  strArea?: string;
  strInstructions?: string;
  strTags?: string;
  strYoutube?: string;
  strSource?: string;
  [key: string]: any;
};

export type RecipeResponse = {
  meals: Recipe[] | null;
};
