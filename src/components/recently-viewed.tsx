
import { useCallback, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  StyleSheet
} from 'react-native';
import { useFocusEffect, router } from 'expo-router';
import { getRecentRecipes } from '../services/recent-recipes';
import type { Recipe } from '../types/recipe';

export default function RecentlyViewed() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      async function load() {
        const data = await getRecentRecipes();
        if (active) setRecipes(data);
      }

      load();

      return () => {
        active = false;
      };
    }, [])
  );

  if (recipes.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <View>
          <Text style={styles.title}>Recently Viewed</Text>
          <Text style={styles.subtitle}>Your browsing history</Text>
        </View>
        <Text style={styles.count}>{recipes.length}</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {recipes.map(recipe => (
          <Pressable
            key={recipe.idMeal}
            style={styles.card}
            onPress={() => router.push(`/recipe/${recipe.idMeal}`)}
          >
            <Image
              source={{ uri: recipe.strMealThumb }}
              style={styles.image}
            />
            <View style={styles.details}>
              <Text style={styles.name} numberOfLines={2}>
                {recipe.strMeal}
              </Text>
              <Text style={styles.category} numberOfLines={1}>
                {recipe.strArea || recipe.strCategory || 'Recipe'}
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 25,
    marginBottom: 10
  },
  heading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 22,
    marginBottom: 14
  },
  title: {
    color: '#302820',
    fontSize: 21,
    fontWeight: 'bold'
  },
  subtitle: {
    color: '#9A8D81',
    fontSize: 12,
    marginTop: 5
  },
  count: {
    backgroundColor: '#F5EBDD',
    color: '#E87932',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    fontWeight: 'bold'
  },
  list: {
    paddingHorizontal: 20,
    gap: 14
  },
  card: {
    width: 165,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F0E5D9'
  },
  image: {
    width: '100%',
    height: 110,
    backgroundColor: '#F5EBDD'
  },
  details: {
    padding: 11
  },
  name: {
    color: '#302820',
    fontSize: 14,
    fontWeight: 'bold',
    minHeight: 38
  },
  category: {
    color: '#95877B',
    fontSize: 11,
    marginTop: 7
  }
});
