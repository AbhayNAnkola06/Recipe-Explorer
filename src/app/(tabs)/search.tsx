
import { useEffect, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Image,
  ActivityIndicator
} from 'react-native';

import { router } from 'expo-router';

import type { Recipe } from '../../types/recipe';

import {
  searchRecipes,
  searchByIngredient,
  getCategories,
  getAreas,
  getRecipesByCategory,
  getRecipesByArea
} from '../../services/recipe-api';

type SearchMode = 'name' | 'ingredient';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<SearchMode>('name');

  const [categories, setCategories] = useState<string[]>([]);
  const [areas, setAreas] = useState<string[]>([]);

  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedArea, setSelectedArea] = useState('');

  useEffect(() => {
    loadSearchOptions();
  }, []);

  async function loadSearchOptions() {
  try {
    setListLoading(true);

    const categoryData = await getCategories();
    const areaData = await getAreas();

    setCategories([...new Set(categoryData)]);
    setAreas([...new Set(areaData)]);
  } catch (err) {
    setError('Unable to load categories. Please try again.');
  } finally {
    setListLoading(false);
  }
}

  async function handleSearch() {
    if (!query.trim()) {
      setError('Please enter a recipe name or ingredient.');
      setRecipes([]);
      setHasSearched(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSelectedCategory('');
      setSelectedArea('');

      let results: Recipe[] = [];

      if (mode === 'name') {
        results = await searchRecipes(query.trim());
      } else {
        results = await searchByIngredient(query.trim());
      }

      setRecipes(results);
      setHasSearched(true);

      if (results.length === 0) {
        setError('No recipes found. Try another search.');
      }
    } catch (err) {
      setError('Search failed. Please check your internet connection.');
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  }

  async function selectCategory(category: string) {
    try {
      setSelectedCategory(category);
      setSelectedArea('');
      setQuery('');
      setError('');
      setLoading(true);
      setHasSearched(true);

      const results = await getRecipesByCategory(category);
      setRecipes(results);

      if (results.length === 0) {
        setError('No recipes found in this category.');
      }
    } catch (err) {
      setError('Unable to load this category.');
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  }

  async function selectArea(area: string) {
    try {
      setSelectedArea(area);
      setSelectedCategory('');
      setQuery('');
      setError('');
      setLoading(true);
      setHasSearched(true);

      const results = await getRecipesByArea(area);
      setRecipes(results);

     if (results.length === 0) {
  setError(
    `No ${area} recipes are currently available in TheMealDB. Try another cuisine.`
  );
}
    } catch (err) {
      setError('Unable to load this cuisine.');
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  }

  function openRecipe(id: string) {
    router.push(`/recipe/${id}`);
  }

  function clearSearch() {
    setQuery('');
    setRecipes([]);
    setError('');
    setHasSearched(false);
    setSelectedCategory('');
    setSelectedArea('');
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.page}>

        {/* HEADER */}

        <View style={styles.header}>
          <Text style={styles.smallHeading}>
            FIND YOUR NEXT FAVOURITE
          </Text>

          <Text style={styles.title}>
            Explore Recipes
          </Text>

          <Text style={styles.subtitle}>
            Search, discover and get inspired.
          </Text>
        </View>

        {/* SEARCH BOX */}

        <View style={styles.searchCard}>
          <Text style={styles.searchLabel}>
            What are you looking for?
          </Text>

          <View style={styles.modeContainer}>
            <Pressable
              style={[
                styles.modeButton,
                mode === 'name' && styles.activeMode
              ]}
              onPress={() => {
                setMode('name');
                setError('');
              }}
            >
              <Text
                style={[
                  styles.modeText,
                  mode === 'name' && styles.activeModeText
                ]}
              >
                Recipe Name
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.modeButton,
                mode === 'ingredient' && styles.activeMode
              ]}
              onPress={() => {
                setMode('ingredient');
                setError('');
              }}
            >
              <Text
                style={[
                  styles.modeText,
                  mode === 'ingredient' && styles.activeModeText
                ]}
              >
                Ingredient
              </Text>
            </Pressable>
          </View>

          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder={
                mode === 'name'
                  ? 'Try Chicken Curry or Pasta...'
                  : 'Try chicken, potato or cheese...'
              }
              placeholderTextColor="#A99B8E"
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />

            {query.length > 0 && (
              <Pressable onPress={() => setQuery('')}>
                <Text style={styles.clearInput}>×</Text>
              </Pressable>
            )}
          </View>

          <Pressable
            style={styles.searchButton}
            onPress={handleSearch}
            disabled={loading}
          >
            <Text style={styles.searchButtonText}>
              Search Recipes  →
            </Text>
          </Pressable>
        </View>

        {/* CATEGORY SECTION */}

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Browse Categories
            </Text>

            <Text style={styles.sectionSubtitle}>
              Find food by category
            </Text>
          </View>
        </View>

        {listLoading ? (
          <ActivityIndicator
            color="#E87932"
            style={styles.listLoader}
          />
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipList}
          >
            {categories.map((category, index) => (
  <Pressable
    key={`${category}-${index}`}
                style={[
                  styles.categoryChip,
                  selectedCategory === category &&
                    styles.selectedChip
                ]}
                onPress={() => selectCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category &&
                      styles.selectedChipText
                  ]}
                >
                  {category}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        )}

        {/* CUISINE SECTION */}

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Explore Cuisines
            </Text>

            <Text style={styles.sectionSubtitle}>
              Recipes from around the world
            </Text>
          </View>
        </View>

        {listLoading ? (
          <ActivityIndicator
            color="#E87932"
            style={styles.listLoader}
          />
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipList}
          >
            {areas.map((area, index) => (
  <Pressable
    key={`${area}-${index}`}
                style={[
                  styles.cuisineChip,
                  selectedArea === area &&
                    styles.selectedCuisine
                ]}
                onPress={() => selectArea(area)}
              >
                <Text
                  style={[
                    styles.cuisineText,
                    selectedArea === area &&
                      styles.selectedChipText
                  ]}
                >
                  {area}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        )}

        {/* RESULTS */}

        <View style={styles.resultsHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              {selectedCategory
                ? selectedCategory
                : selectedArea
                  ? `${selectedArea} Cuisine`
                  : hasSearched
                    ? 'Search Results'
                    : 'Discover Something Delicious'}
            </Text>

            <Text style={styles.sectionSubtitle}>
              {hasSearched
                ? `${recipes.length} recipe(s) found`
                : 'Your next favourite meal is waiting'}
            </Text>
          </View>

          {hasSearched && (
            <Pressable onPress={clearSearch}>
              <Text style={styles.clearButton}>
                Clear ×
              </Text>
            </Pressable>
          )}
        </View>

        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator
              size="large"
              color="#E87932"
            />

            <Text style={styles.loadingText}>
              Finding delicious recipes...
            </Text>
          </View>
        ) : error ? (
          <View style={styles.messageBox}>
            <Text style={styles.messageText}>
              {error}
            </Text>
          </View>
        ) : hasSearched && recipes.length > 0 ? (
          <View style={styles.resultsGrid}>
            {recipes.map((item) => (
              <Pressable
                key={item.idMeal}
                style={styles.resultCard}
                onPress={() => openRecipe(item.idMeal)}
              >
                <Image
                  source={{ uri: item.strMealThumb }}
                  style={styles.resultImage}
                />

                <View style={styles.resultDetails}>
                  <Text
                    style={styles.resultName}
                    numberOfLines={2}
                  >
                    {item.strMeal}
                  </Text>

                  <Text style={styles.resultLink}>
                    View Recipe →
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        ) : (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyEmoji}>🍴</Text>

            <Text style={styles.emptyTitle}>
              Let's find something tasty!
            </Text>

            <Text style={styles.emptySubtitle}>
              Search for a dish, choose a category or explore a cuisine.
            </Text>
          </View>
        )}

        <View style={styles.bottomSpace} />

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F2'
  },
  page: {
    width: '100%',
    maxWidth: 1100,
    alignSelf: 'center',
    paddingBottom: 25
  },
  header: {
    paddingHorizontal: 23,
    paddingTop: 30,
    paddingBottom: 22
  },
  smallHeading: {
    color: '#A18F7E',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1.5
  },
  title: {
    color: '#302820',
    fontSize: 29,
    fontWeight: 'bold',
    marginTop: 9
  },
  subtitle: {
    color: '#95877B',
    fontSize: 13,
    marginTop: 7
  },
  searchCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    padding: 18,
    borderRadius: 19,
    elevation: 2
  },
  searchLabel: {
    color: '#302820',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 14
  },
  modeContainer: {
    flexDirection: 'row',
    backgroundColor: '#F7F0E8',
    borderRadius: 11,
    padding: 4,
    marginBottom: 15
  },
  modeButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 9
  },
  activeMode: {
    backgroundColor: '#E87932'
  },
  modeText: {
    color: '#88796C',
    fontSize: 12,
    fontWeight: 'bold'
  },
  activeModeText: {
    color: '#FFFFFF'
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EDE1D5',
    borderRadius: 12,
    paddingHorizontal: 12
  },
  input: {
    flex: 1,
    height: 48,
    color: '#302820',
    fontSize: 13,
    outlineStyle: 'none'
  } as any,
  clearInput: {
    color: '#A18F7E',
    fontSize: 24,
    paddingHorizontal: 5
  },
  searchButton: {
    backgroundColor: '#E87932',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 11,
    marginTop: 13
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13
  },
  sectionHeader: {
    marginHorizontal: 23,
    marginTop: 30,
    marginBottom: 14
  },
  sectionTitle: {
    color: '#302820',
    fontSize: 20,
    fontWeight: 'bold'
  },
  sectionSubtitle: {
    color: '#9A8D81',
    fontSize: 12,
    marginTop: 5
  },
  listLoader: {
    marginVertical: 18
  },
  chipList: {
    paddingHorizontal: 20,
    paddingBottom: 5
  },
  categoryChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0E2D4',
    paddingHorizontal: 17,
    paddingVertical: 11,
    borderRadius: 22,
    marginRight: 9
  },
  selectedChip: {
    backgroundColor: '#E87932',
    borderColor: '#E87932'
  },
  categoryText: {
    color: '#65584D',
    fontSize: 12,
    fontWeight: '600'
  },
  selectedChipText: {
    color: '#FFFFFF'
  },
  cuisineChip: {
    backgroundColor: '#F5EBDD',
    paddingHorizontal: 17,
    paddingVertical: 11,
    borderRadius: 22,
    marginRight: 9
  },
  selectedCuisine: {
    backgroundColor: '#6B8E65'
  },
  cuisineText: {
    color: '#526D4D',
    fontSize: 12,
    fontWeight: '600'
  },
  resultsHeader: {
    marginHorizontal: 23,
    marginTop: 30,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  clearButton: {
    color: '#E87932',
    fontSize: 13,
    fontWeight: 'bold'
  },
  loadingBox: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    color: '#8A8178',
    fontSize: 13,
    marginTop: 12
  },
  messageBox: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 14
  },
  messageText: {
    color: '#B84B3B',
    fontSize: 13,
    textAlign: 'center'
  },
  resultsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    rowGap: 15
  },
  resultCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2
  },
  resultImage: {
    width: '100%',
    height: 125
  },
  resultDetails: {
    padding: 12
  },
  resultName: {
    color: '#302820',
    fontSize: 14,
    fontWeight: 'bold',
    minHeight: 38
  },
  resultLink: {
    color: '#E87932',
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 9
  },
  emptyBox: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    padding: 27,
    borderRadius: 18,
    alignItems: 'center'
  },
  emptyEmoji: {
    fontSize: 40
  },
  emptyTitle: {
    color: '#302820',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12
  },
  emptySubtitle: {
    color: '#95877B',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 19,
    marginTop: 7
  },
  bottomSpace: {
    height: 30
  }
});
