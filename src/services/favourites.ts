
    import {
    collection,
    doc,
    setDoc,
    deleteDoc,
    onSnapshot,
    serverTimestamp
    } from 'firebase/firestore';

    import { auth, db } from './firebase';
    import type { Recipe } from '../types/recipe';

    function getFavouriteCollection() {
    const user = auth.currentUser;

    if (!user) {
        throw new Error('Please login first.');
    }

    return collection(db, 'users', user.uid, 'favourites');
    }

    export async function saveFavourite(recipe: Recipe) {
    const user = auth.currentUser;

    if (!user) {
        throw new Error('Please login first.');
    }

    await setDoc(
        doc(db, 'users', user.uid, 'favourites', recipe.idMeal),
        {
        idMeal: recipe.idMeal,
        strMeal: recipe.strMeal,
        strMealThumb: recipe.strMealThumb,
        strCategory: recipe.strCategory || '',
        strArea: recipe.strArea || '',
        savedAt: serverTimestamp()
        }
    );
    }

    export async function removeFavourite(id: string) {
    const user = auth.currentUser;

    if (!user) {
        throw new Error('Please login first.');
    }

    await deleteDoc(
        doc(db, 'users', user.uid, 'favourites', id)
    );
    }

    export function listenToFavourites(
    callback: (recipes: Recipe[]) => void,
    onError?: (error: Error) => void
    ) {
    return onSnapshot(
        getFavouriteCollection(),
        (snapshot) => {
        const recipes = snapshot.docs.map((item) => ({
            ...item.data(),
            idMeal: item.id
        } as Recipe));

        callback(recipes);
        },
        (error) => {
        onError?.(error);
        }
    );
    }
