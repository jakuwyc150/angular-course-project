import { Recipe } from "../recipe.model";
import * as RecipesActions from "./recipe.actions";

export interface State {
  recipes: Recipe[]
}

const initialState: State = {
  recipes: []
}

export function recipeReducer(state = initialState, action: RecipesActions.RecipesActions): State {
  switch (action.type) {
    case RecipesActions.ADD_RECIPE: return {
      ...state,
      recipes: [...state.recipes, (action as RecipesActions.AddRecipe).payload]
    };

    case RecipesActions.DELETE_RECIPE: return {
      ...state,
      recipes: state.recipes.filter((recipe, index) => index !== (action as RecipesActions.DeleteRecipe).payload)
    }

    case RecipesActions.SET_RECIPES: return {
      ...state,
      recipes: [...(action as RecipesActions.SetRecipes).payload]
    }

    case RecipesActions.UPDATE_RECIPE: {
      const updatedRecipe: Recipe = {
        ...state.recipes[(action as RecipesActions.UpdateRecipe).payload.index],
        ...(action as RecipesActions.UpdateRecipe).payload.newRecipe
      };

      const updatedRecipes = [ ...state.recipes ];
      updatedRecipes[(action as RecipesActions.UpdateRecipe).payload.index] = updatedRecipe;

      return {
        ...state,
        recipes: updatedRecipes
      };
    }

    default: return state;
  }
}