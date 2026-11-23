
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { Recipe } from '../types/recipe';

type Props = {
  recipe: Recipe;
  onPress: () => void;
};

export default function RecipeCard({ recipe, onPress }: Props) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Image
        source={{ uri: recipe.strMealThumb }}
        style={styles.image}
      />

      <View style={styles.details}>
        <Text style={styles.category}>
          {recipe.strCategory || 'DELICIOUS RECIPE'}
        </Text>

        <Text style={styles.name} numberOfLines={2}>
          {recipe.strMeal}
        </Text>

        <Text style={styles.area}>
          {recipe.strArea || 'Explore this recipe'}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 220,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    marginRight: 15,
    elevation: 3
  },
  image: {
    width: '100%',
    height: 145
  },
  details: {
    padding: 13
  },
  category: {
    color: '#E87932',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1
  },
  name: {
    color: '#302820',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 7
  },
  area: {
    color: '#8A8178',
    fontSize: 12,
    marginTop: 7
  }
});
