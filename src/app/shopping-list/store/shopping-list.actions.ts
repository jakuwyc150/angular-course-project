import { Action } from "@ngrx/store";
import { Ingredient } from "src/app/shared/ingredient.model";

export const ADD_INGREDIENT = '[SHOPPING LIST] ADD_INGREDIENT';
export const ADD_INGREDIENTS = '[SHOPPING LIST] ADD_INGREDIENTS';
export const UPDATE_INGREDIENT = '[SHOPPING LIST] UPDATE_INGREDIENT';
export const DELETE_INGREDIENT = '[SHOPPING LIST] DELETE_INGREDIENT';
export const START_EDIT = '[SHOPPING LIST] START_EDIT';
export const STOP_EDIT = '[SHOPPING LIST] STOP_EDIT';

export class AddIngredient implements Action {
  readonly type: string = ADD_INGREDIENT;

  constructor(
    public payload: Ingredient
  ) {}
}

export class AddIngredients implements Action {
  readonly type: string = ADD_INGREDIENTS;

  constructor(
    public payload: Ingredient[]
  ) {}
}

export class UpdateIngredient implements Action {
  readonly type: string = UPDATE_INGREDIENT;

  constructor(
    public payload: Ingredient
  ) {}
}

export class DeleteIngredient implements Action {
  readonly type: string = DELETE_INGREDIENT;
}

export class StartEdit implements Action {
  readonly type: string = START_EDIT;

  constructor(
    public payload: number
  ) {}
}

export class StopEdit implements Action {
  readonly type: string = STOP_EDIT;
}

export type ShoppingListActions =
  AddIngredient |
  AddIngredients |
  UpdateIngredient |
  DeleteIngredient |
  StartEdit |
  StopEdit;