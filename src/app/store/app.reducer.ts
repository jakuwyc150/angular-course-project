import { ActionReducerMap } from '@ngrx/store';
import * as fromAuth from '../auth/auth/store/auth.reducer';
import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer';
import * as fromRecipes from '../recipes/store/recipe.reducer';

export interface AppState {
  auth: fromAuth.State;
  recipes: fromRecipes.State;
  shoppingList: fromShoppingList.State;
}

export const appReducer: ActionReducerMap<AppState> = {
  auth: fromAuth.authReducer,
  recipes: fromRecipes.recipeReducer,
  shoppingList: fromShoppingList.shoppingListReducer
};