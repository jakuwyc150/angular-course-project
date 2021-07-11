import { Action } from "@ngrx/store";
import { Recipe } from "../recipe.model";

export const SET_RECIPES = '[RECIPES] SET_RECIPES';
export const FETCH_RECIPES = '[RECIPES] FETCH RECIPES';

export class SetRecipes implements Action {
  readonly type: string = SET_RECIPES;

  constructor(public payload: Recipe[]) {}
}

export class FetchRecipes implements Action {
  readonly type: string = FETCH_RECIPES;
}

export type RecipesActions = SetRecipes;