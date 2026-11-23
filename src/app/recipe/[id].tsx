
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { getRecipeById } from '../../services/recipe-api';
import {
  saveFavourite,
  removeFavourite,
  listenToFavourites
} from '../../services/favourites';
import { addRecentRecipe } from '../../services/recent-recipes';

import type { Recipe } from '../../types/recipe';

export default function RecipeDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavourite, setIsFavourite] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadRecipe() {
      try {
        setLoading(true);
        setError('');

        const data = await getRecipeById(id);

        if (!active) return;

        if (data) {
          setRecipe(data);
          await addRecentRecipe(data);
        } else {
          setError('Recipe not found.');
        }
      } catch (err) {
        console.log('Recipe loading error:', err);
        if (active) {
          setError('Unable to load recipe. Please try again.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    if (id) {
      loadRecipe();
    }

    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    try {
      unsubscribe = listenToFavourites(
        (recipes) => {
          setIsFavourite(
            recipes.some(item => item.idMeal === id)
          );
        },
        (err) => {
          console.log('Favourite listener error:', err);
        }
      );
    } catch (err) {
      console.log('Favourite listener:', err);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [id]);

  async function handleFavourite() {
    if (!recipe || saving) return;

    try {
      setSaving(true);
      setError('');

      if (isFavourite) {
        await removeFavourite(recipe.idMeal);
        setIsFavourite(false);
      } else {
        await saveFavourite(recipe);
        setIsFavourite(true);
      }
    } catch (err) {
      console.log('Favourite error:', err);
      setError('Please login to save your favourite recipes.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#29443A" />
        <Text style={styles.loadingText}>Loading recipe...</Text>
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={styles.center}>
        <Ionicons
          name="restaurant-outline"
          size={55}
          color="#29443A"
        />

        <Text style={styles.errorTitle}>Recipe unavailable</Text>
        <Text style={styles.errorText}>
          {error || 'We could not find this recipe.'}
        </Text>

        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}` as keyof Recipe];
    const measure = recipe[`strMeasure${i}` as keyof Recipe];

    if (
      typeof ingredient === 'string' &&
      ingredient.trim() !== ''
    ) {
      ingredients.push({
        name: ingredient.trim(),
        measure:
          typeof measure === 'string' ? measure.trim() : ''
      });
    }
  }

  const instructions = recipe.strInstructions
    ? recipe.strInstructions
        .split(/\r?\n/)
        .filter(item => item.trim() !== '')
    : [];

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: recipe.strMealThumb }}
          style={styles.mainImage}
        />

        <Pressable
          style={styles.backIcon}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={23} color="#29443A" />
        </Pressable>

        <Pressable
          style={styles.favouriteIcon}
          onPress={handleFavourite}
          disabled={saving}
        >
          <Ionicons
            name={isFavourite ? 'heart' : 'heart-outline'}
            size={25}
            color={isFavourite ? '#D95B45' : '#29443A'}
          />
        </Pressable>
      </View>

      <View style={styles.content}>
        <View style={styles.categoryRow}>
          <Text style={styles.category}>
            {recipe.strCategory || 'Recipe'}
          </Text>

          {recipe.strArea ? (
            <Text style={styles.area}>
              {recipe.strArea}
            </Text>
          ) : null}
        </View>

        <Text style={styles.title}>
          {recipe.strMeal}
        </Text>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons
              name="restaurant-outline"
              size={19}
              color="#B18A43"
            />
            <Text style={styles.infoText}>
              {ingredients.length} Ingredients
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Ionicons
              name="globe-outline"
              size={19}
              color="#B18A43"
            />
            <Text style={styles.infoText}>
              {recipe.strArea || 'International'}
            </Text>
          </View>
        </View>

        {error ? (
          <Text style={styles.errorMessage}>{error}</Text>
        ) : null}

        <View style={styles.section}>
          <View style={styles.sectionHeading}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            <Text style={styles.sectionCount}>
              {ingredients.length} items
            </Text>
          </View>

          {ingredients.length > 0 ? (
            ingredients.map((item, index) => (
              <View key={index} style={styles.ingredientRow}>
                <View style={styles.ingredientDot} />

                <Text style={styles.ingredientName}>
                  {item.name}
                </Text>

                <Text style={styles.measure}>
                  {item.measure}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>
              Ingredient information is unavailable.
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructions</Text>

          {instructions.length > 0 ? (
            instructions.map((step, index) => (
              <View key={index} style={styles.stepRow}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>
                    {index + 1}
                  </Text>
                </View>

                <Text style={styles.stepText}>
                  {step.trim()}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>
              Instructions are unavailable.
            </Text>
          )}
        </View>

        {recipe.strTags ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tags</Text>

            <View style={styles.tagsContainer}>
              {recipe.strTags.split(',').map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>
                    {tag.trim()}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        <Pressable
          style={styles.saveButton}
          onPress={handleFavourite}
          disabled={saving}
        >
          <Ionicons
            name={isFavourite ? 'heart' : 'heart-outline'}
            size={21}
            color="#FFFFFF"
          />

          <Text style={styles.saveButtonText}>
            {saving
              ? 'Please wait...'
              : isFavourite
              ? 'Remove from Favourites'
              : 'Save to Favourites'}
          </Text>
        </Pressable>

        {recipe.strSource ? (
          <Text style={styles.footerText}>
            Recipe information provided by TheMealDB
          </Text>
        ) : (
          <Text style={styles.footerText}>
            Explore more recipes with Recipe Explorer
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F5EF'
  },
  center: {
    flex: 1,
    backgroundColor: '#F7F5EF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25
  },
  loadingText: {
    marginTop: 12,
    color: '#29443A',
    fontSize: 15
  },
  errorTitle: {
    fontSize: 21,
    fontWeight: '700',
    color: '#29443A',
    marginTop: 15
  },
  errorText: {
    fontSize: 14,
    color: '#777',
    marginTop: 8,
    textAlign: 'center'
  },
  backButton: {
    backgroundColor: '#29443A',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 20
  },
  backButtonText: {
    color: '#FFFFFF',
    fontWeight: '700'
  },
  imageContainer: {
    width: '100%',
    height: 310,
    position: 'relative'
  },
  mainImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E9E6D9'
  },
  backIcon: {
    position: 'absolute',
    top: 48,
    left: 20,
    width: 43,
    height: 43,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center'
  },
  favouriteIcon: {
    position: 'absolute',
    top: 48,
    right: 20,
    width: 43,
    height: 43,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center'
  },
  content: {
    padding: 20,
    paddingBottom: 35
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12
  },
  category: {
    color: '#FFFFFF',
    backgroundColor: '#29443A',
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: '600'
  },
  area: {
    color: '#B18A43',
    fontSize: 13,
    fontWeight: '600'
  },
  title: {
    fontSize: 29,
    fontWeight: '800',
    color: '#29443A',
    lineHeight: 36
  },
  infoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    marginTop: 18,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E6E2D7'
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7
  },
  infoText: {
    color: '#77786F',
    fontSize: 13
  },
  errorMessage: {
    color: '#C94D40',
    marginTop: 12,
    fontSize: 13
  },
  section: {
    marginTop: 27
  },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14
  },
  sectionTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: '#29443A',
    marginBottom: 14
  },
  sectionCount: {
    color: '#A18B62',
    fontSize: 12,
    fontWeight: '600'
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#EAE7DE'
  },
  ingredientDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#B18A43',
    marginRight: 12
  },
  ingredientName: {
    flex: 1,
    color: '#42483F',
    fontSize: 15,
    fontWeight: '500'
  },
  measure: {
    color: '#89877D',
    fontSize: 13,
    marginLeft: 10
  },
  emptyText: {
    color: '#888',
    fontSize: 14
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 19
  },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E9E6D9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  stepNumberText: {
    color: '#29443A',
    fontWeight: '800',
    fontSize: 13
  },
  stepText: {
    flex: 1,
    color: '#55584F',
    fontSize: 14,
    lineHeight: 23
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9
  },
  tag: {
    backgroundColor: '#E9E6D9',
    borderRadius: 18,
    paddingHorizontal: 13,
    paddingVertical: 7
  },
  tagText: {
    color: '#29443A',
    fontSize: 12,
    fontWeight: '600'
  },
  saveButton: {
    backgroundColor: '#29443A',
    borderRadius: 14,
    padding: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 30
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700'
  },
  footerText: {
    color: '#99968B',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 22
  }
});
