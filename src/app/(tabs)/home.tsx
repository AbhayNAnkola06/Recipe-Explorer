
import { useEffect, useState } from 'react';

import RecentlyViewed from '../../components/recently-viewed';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Pressable,
  RefreshControl,
  Image
} from 'react-native';

import { router } from 'expo-router';

import type { Recipe } from '../../types/recipe';

import {
  getRecipes,
  getRandomRecipe
} from '../../services/recipe-api';

export default function HomeScreen() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [randomRecipe, setRandomRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadRecipes();
  }, []);

  async function loadRecipes(isRefresh = false) {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError('');

      const data = await getRecipes();
      const random = await getRandomRecipe();

      setRecipes(data);
      setRandomRecipe(random);
    } catch (err) {
      setError('Unable to load recipes. Please check your internet connection.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  function openRecipe(id: string) {
    router.push(`/recipe/${id}`);
  }

  function openSearch() {
    router.push('/search');
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => loadRecipes(true)}
          tintColor="#E87932"
          colors={['#E87932']}
        />
      }
    >
    
      <View style={styles.page}>

        {/* HEADER */}

        <View style={styles.header}>
          <Text style={styles.greeting}>
            HELLO, FOOD LOVER 👋
          </Text>

          <Text style={styles.headerTitle}>
            What shall we{'\n'}cook today?
          </Text>

          <Text style={styles.headerSubtitle}>
            Discover something delicious today.
          </Text>
        </View>

        {/* SEARCH BAR */}

        <Pressable
          style={styles.searchBar}
          onPress={openSearch}
        >
          <Text style={styles.searchIcon}>⌕</Text>

          <Text style={styles.searchText}>
            Search recipes, ingredients...
          </Text>

          <View style={styles.searchButton}>
            <Text style={styles.searchButtonText}>
              Search
            </Text>
          </View>
        </Pressable>

        {/* HERO BANNER */}

        <View style={styles.hero}>
          <View style={styles.heroCircle} />
          <View style={styles.heroCircleSmall} />

          <View style={styles.heroContent}>
            <Text style={styles.heroTag}>
              YOUR DAILY FOOD INSPIRATION
            </Text>

            <Text style={styles.heroTitle}>
              Make every meal{'\n'}a little special.
            </Text>

            <Text style={styles.heroSubtitle}>
              Discover delicious recipes from around the world.
            </Text>

            <Pressable
              style={styles.heroButton}
              onPress={openSearch}
            >
              <Text style={styles.heroButtonText}>
                Explore Recipes  →
              </Text>
            </Pressable>
          </View>
        </View>

        {/* POPULAR RECIPES */}

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Popular Recipes
            </Text>

           

            <Text style={styles.sectionSubtitle}>
              Dishes worth trying
            </Text>
          </View>

          <Pressable onPress={openSearch}>
            <Text style={styles.seeAll}>
              See all →
            </Text>
          </Pressable>
        </View>

        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator
              size="large"
              color="#E87932"
            />

            <Text style={styles.loadingText}>
              Preparing something delicious...
            </Text>
          </View>
        ) : error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorEmoji}>🍽️</Text>

            <Text style={styles.errorText}>
              {error}
            </Text>

            <Pressable
              style={styles.retryButton}
              onPress={() => loadRecipes()}
            >
              <Text style={styles.retryText}>
                Try Again
              </Text>
            </Pressable>
          </View>
        ) : recipes.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>
              No recipes found right now.
            </Text>

            <Pressable onPress={() => loadRecipes()}>
              <Text style={styles.seeAll}>
                Try Again
              </Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={recipes}
            horizontal
            nestedScrollEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.idMeal}
            contentContainerStyle={styles.recipeList}
            renderItem={({ item }) => (
              <Pressable
                style={styles.recipeCard}
                onPress={() => openRecipe(item.idMeal)}
              >
                <View>
                  <Image
                    source={{ uri: item.strMealThumb }}
                    style={styles.recipeImage}
                  />

                  <View style={styles.imageLabel}>
                    <Text style={styles.imageLabelText}>
                      {item.strCategory || 'RECIPE'}
                    </Text>
                  </View>
                </View>

                <View style={styles.recipeDetails}>
                  <Text
                    style={styles.recipeName}
                    numberOfLines={2}
                  >
                    {item.strMeal}
                  </Text>

                  <Text style={styles.recipeArea}>
                    {item.strArea || 'Explore this dish'}
                  </Text>

                  <Text style={styles.recipeLink}>
                    View Recipe  →
                  </Text>
                </View>
              </Pressable>
            )}
          />
        )}

        {/* RECENTLY VIEWED */}
<RecentlyViewed />

        {/* TODAY'S INSPIRATION */}

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Today's Inspiration
            </Text>

            <Text style={styles.sectionSubtitle}>
              A special dish picked for you
            </Text>
          </View>
        </View>

        

        {randomRecipe && (
          <Pressable
            style={styles.featuredCard}
            onPress={() => openRecipe(randomRecipe.idMeal)}
          >
            <Image
              source={{ uri: randomRecipe.strMealThumb }}
              style={styles.featuredImage}
            />

            <View style={styles.featuredDetails}>
              <View style={styles.featuredTag}>
                <Text style={styles.featuredTagText}>
                  ✦ TODAY'S PICK
                </Text>
              </View>

              <Text style={styles.featuredName}>
                {randomRecipe.strMeal}
              </Text>

              <Text style={styles.featuredArea}>
                {randomRecipe.strArea || 'A delicious recipe awaits'}
              </Text>

              <View style={styles.featuredButton}>
                <Text style={styles.featuredButtonText}>
                  Discover Recipe  →
                </Text>
              </View>
            </View>
          </Pressable>
        )}

        {/* BOTTOM MESSAGE */}

        <View style={styles.bottomBanner}>
          <Text style={styles.bottomEmoji}>🥗</Text>

          <View style={{ flex: 1 }}>
            <Text style={styles.bottomTitle}>
              Good food, good mood!
            </Text>

            <Text style={styles.bottomSubtitle}>
              Find inspiration for your next meal.
            </Text>
          </View>
        </View>

        <Text style={styles.footer}>
          MADE WITH ♥ FOR FOOD LOVERS
        </Text>

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
    paddingBottom: 20
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 22
  },
  greeting: {
    color: '#A18F7E',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1.5
  },
  headerTitle: {
    color: '#302820',
    fontSize: 30,
    fontWeight: 'bold',
    lineHeight: 38,
    marginTop: 10
  },
  headerSubtitle: {
    color: '#95877B',
    fontSize: 13,
    marginTop: 8
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 22,
    padding: 9,
    paddingLeft: 16,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#F0E5D9',
    elevation: 2
  },
  searchIcon: {
    fontSize: 27,
    color: '#E87932',
    marginRight: 10
  },
  searchText: {
    flex: 1,
    color: '#A99B8E',
    fontSize: 13
  },
  searchButton: {
    backgroundColor: '#E87932',
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 11
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12
  },
  hero: {
    backgroundColor: '#E87932',
    marginHorizontal: 20,
    marginTop: 25,
    borderRadius: 24,
    padding: 25,
    overflow: 'hidden',
    minHeight: 235,
    justifyContent: 'center'
  },
  heroContent: {
    maxWidth: 420,
    zIndex: 2
  },
  heroTag: {
    color: '#FFE3CB',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1.3
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 29,
    lineHeight: 37,
    fontWeight: 'bold',
    marginTop: 15
  },
  heroSubtitle: {
    color: '#FFF1E5',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 10
  },
  heroButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderRadius: 11,
    alignSelf: 'flex-start',
    marginTop: 19
  },
  heroButtonText: {
    color: '#D96927',
    fontSize: 12,
    fontWeight: 'bold'
  },
  heroCircle: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#F69B61',
    right: -75,
    top: -90,
    opacity: 0.55
  },
  heroCircleSmall: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 70,
    backgroundColor: '#D96729',
    right: 25,
    bottom: -75,
    opacity: 0.45
  },
  sectionHeader: {
    marginHorizontal: 23,
    marginTop: 33,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  sectionTitle: {
    color: '#302820',
    fontSize: 21,
    fontWeight: 'bold'
  },
  sectionSubtitle: {
    color: '#9A8D81',
    fontSize: 12,
    marginTop: 5
  },
  seeAll: {
    color: '#E87932',
    fontSize: 13,
    fontWeight: 'bold'
  },
  recipeList: {
    paddingHorizontal: 20,
    paddingBottom: 8
  },
  recipeCard: {
    width: 235,
    backgroundColor: '#FFFFFF',
    borderRadius: 19,
    overflow: 'hidden',
    marginRight: 16,
    elevation: 3
  },
  recipeImage: {
    width: '100%',
    height: 155
  },
  imageLabel: {
    position: 'absolute',
    left: 11,
    top: 11,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8
  },
  imageLabelText: {
    color: '#E87932',
    fontSize: 9,
    fontWeight: 'bold'
  },
  recipeDetails: {
    padding: 15
  },
  recipeName: {
    color: '#302820',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 22,
    minHeight: 44
  },
  recipeArea: {
    color: '#95877B',
    fontSize: 12,
    marginTop: 7
  },
  recipeLink: {
    color: '#E87932',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 13
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
  errorBox: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 22,
    padding: 25,
    borderRadius: 18,
    alignItems: 'center'
  },
  errorEmoji: {
    fontSize: 35
  },
  errorText: {
    color: '#B84B3B',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 13
  },
  retryButton: {
    backgroundColor: '#E87932',
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 15
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: 'bold'
  },
  emptyBox: {
    alignItems: 'center',
    padding: 25
  },
  emptyText: {
    color: '#8A8178',
    marginBottom: 12
  },
  featuredCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 3
  },
  featuredImage: {
    width: '100%',
    height: 230
  },
  featuredDetails: {
    padding: 18
  },
  featuredTag: {
    backgroundColor: '#FFF0E4',
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 8,
    alignSelf: 'flex-start'
  },
  featuredTagText: {
    color: '#E87932',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.7
  },
  featuredName: {
    color: '#302820',
    fontSize: 21,
    fontWeight: 'bold',
    marginTop: 13
  },
  featuredArea: {
    color: '#95877B',
    fontSize: 13,
    marginTop: 6
  },
  featuredButton: {
    backgroundColor: '#E87932',
    padding: 13,
    borderRadius: 11,
    alignItems: 'center',
    marginTop: 17
  },
  featuredButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13
  },
  bottomBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5EBDD',
    marginHorizontal: 20,
    marginTop: 28,
    padding: 18,
    borderRadius: 17
  },
  bottomEmoji: {
    fontSize: 35,
    marginRight: 15
  },
  bottomTitle: {
    color: '#302820',
    fontSize: 15,
    fontWeight: 'bold'
  },
  bottomSubtitle: {
    color: '#8A8178',
    fontSize: 12,
    marginTop: 5
  },
  footer: {
    textAlign: 'center',
    color: '#B2A394',
    fontSize: 9,
    letterSpacing: 2,
    marginTop: 25
  },
  bottomSpace: {
    height: 25
  }
});
