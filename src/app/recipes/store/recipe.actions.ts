import { Action } from "@ngrx/store";
import { Recipe } from "../recipe.model";

export const ADD_RECIPE = '[RECIPES] ADD_RECIPE';
export const DELETE_RECIPE = '[RECIPES] DELETE_RECIPE';
export const FETCH_RECIPES = '[RECIPES] FETCH RECIPES';
export const SET_RECIPES = '[RECIPES] SET_RECIPES';
export const UPDATE_RECIPE = '[RECIPES] UPDATE_RECIPE';

export class AddRecipe implements Action {
  readonly type: string = ADD_RECIPE;

  constructor(public payload: Recipe) {}
}

export class DeleteRecipe implements Action {
  readonly type: string = DELETE_RECIPE;

  constructor(public payload: number) {}
}

export class FetchRecipes implements Action {
  readonly type: string = FETCH_RECIPES;
}

export class SetRecipes implements Action {
  readonly type: string = SET_RECIPES;

  constructor(public payload: Recipe[]) {}
}

export class UpdateRecipe implements Action {
  readonly type: string = UPDATE_RECIPE;
  
  constructor(public payload: {
    index: number,
    newRecipe: Recipe
  }) {}
}

export type RecipesActions =
  AddRecipe |
  DeleteRecipe |
  FetchRecipes |
  SetRecipes |
  UpdateRecipe;