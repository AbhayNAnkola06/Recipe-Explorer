
import { useEffect, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  ActivityIndicator
} from 'react-native';

import { router } from 'expo-router';

import {
  listenToFavourites,
  removeFavourite
} from '../../services/favourites';

import type { Recipe } from '../../types/recipe';

export default function FavouritesScreen() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = listenToFavourites(
      (data) => {
        setRecipes(data);
        setLoading(false);
        setError('');
      },
      () => {
        setError('Unable to load favourites.');
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  async function handleRemove(id: string) {
    try {
      await removeFavourite(id);
    } catch {
      setError('Could not remove this recipe.');
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.smallTitle}>YOUR COLLECTION</Text>
        <Text style={styles.title}>Favourites</Text>
        <Text style={styles.subtitle}>
          Your favourite dishes, all in one place.
        </Text>

        <View style={styles.countBox}>
          <Text style={styles.count}>{recipes.length}</Text>
          <Text style={styles.countLabel}>SAVED RECIPES</Text>
        </View>
      </View>

      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#29443A"
            style={{ marginTop: 50 }}
          />
        ) : error ? (
          <Text style={styles.error}>{error}</Text>
        ) : recipes.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>♡</Text>
            <Text style={styles.emptyTitle}>
              Nothing saved yet
            </Text>
            <Text style={styles.emptyText}>
              Explore recipes and save the ones you love.
            </Text>

            <Pressable
              style={styles.exploreButton}
              onPress={() => router.push('/search')}
            >
              <Text style={styles.exploreText}>
                Explore Recipes
              </Text>
            </Pressable>
          </View>
        ) : (
          recipes.map((recipe) => (
            <View
              style={styles.recipeCard}
              key={recipe.idMeal}
            >
              <Pressable
                style={styles.recipeMain}
                onPress={() =>
                  router.push(`/recipe/${recipe.idMeal}`)
                }
              >
                <Image
                  source={{ uri: recipe.strMealThumb }}
                  style={styles.recipeImage}
                />

                <View style={styles.recipeInfo}>
                  <Text style={styles.category}>
                    {recipe.strCategory || 'RECIPE'}
                  </Text>

                  <Text
                    style={styles.recipeName}
                    numberOfLines={2}
                  >
                    {recipe.strMeal}
                  </Text>

                  <Text style={styles.area}>
                    {recipe.strArea || 'World Cuisine'}
                  </Text>

                  <Text style={styles.viewText}>
                    VIEW RECIPE →
                  </Text>
                </View>
              </Pressable>

              <Pressable
                style={styles.removeButton}
                onPress={() => handleRemove(recipe.idMeal)}
              >
                <Text style={styles.removeIcon}>♥</Text>
              </Pressable>
            </View>
          ))
        )}
      </View>

      <Text style={styles.footer}>
        MADE WITH LOVE AND GOOD FOOD
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F5EF'
  },
  header: {
    backgroundColor: '#29443A',
    paddingTop: 55,
    paddingHorizontal: 24,
    paddingBottom: 35,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28
  },
  smallTitle: {
    color: '#D6A85F',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 2
  },
  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 10
  },
  subtitle: {
    color: '#DCE6DE',
    fontSize: 13,
    marginTop: 7
  },
  countBox: {
    marginTop: 25,
    backgroundColor: '#3B574B',
    padding: 16,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  count: {
    color: '#D6A85F',
    fontSize: 28,
    fontWeight: 'bold'
  },
  countLabel: {
    color: '#FFFFFF',
    fontSize: 11,
    letterSpacing: 1.5
  },
  content: {
    padding: 20
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 65
  },
  emptyEmoji: {
    fontSize: 65,
    color: '#78947A'
  },
  emptyTitle: {
    color: '#29443A',
    fontSize: 21,
    fontWeight: 'bold',
    marginTop: 15
  },
  emptyText: {
    color: '#8A938A',
    textAlign: 'center',
    fontSize: 13,
    marginTop: 9,
    lineHeight: 20
  },
  exploreButton: {
    backgroundColor: '#29443A',
    paddingHorizontal: 25,
    paddingVertical: 13,
    borderRadius: 12,
    marginTop: 22
  },
  exploreText: {
    color: '#FFFFFF',
    fontWeight: 'bold'
  },
  recipeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    padding: 11,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center'
  },
  recipeMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  recipeImage: {
    width: 105,
    height: 110,
    borderRadius: 13,
    backgroundColor: '#E8EDE6'
  },
  recipeInfo: {
    flex: 1,
    paddingLeft: 13
  },
  category: {
    color: '#78947A',
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 1
  },
  recipeName: {
    color: '#29443A',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 6
  },
  area: {
    color: '#999D94',
    fontSize: 11,
    marginTop: 5
  },
  viewText: {
    color: '#B18A43',
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 10
  },
  removeButton: {
    padding: 9
  },
  removeIcon: {
    color: '#B96A59',
    fontSize: 22
  },
  error: {
    color: '#B84B3B',
    textAlign: 'center',
    marginTop: 40
  },
  footer: {
    textAlign: 'center',
    color: '#A3A99F',
    fontSize: 9,
    letterSpacing: 2,
    marginVertical: 25
  }
});
