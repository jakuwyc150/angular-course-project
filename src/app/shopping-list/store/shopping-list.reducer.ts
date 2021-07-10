import { Ingredient } from "../../shared/ingredient.model";
import * as ShoppingListActions from "./shopping-list.actions";

export interface AppState {
  shoppingList: State
}

export interface State {
  editedIngredient: Ingredient,
  editedIngredientIndex: number,
  ingredients: Ingredient[]
}

const initialState: State = {
  editedIngredient: null,
  editedIngredientIndex: -1,

  ingredients: [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatos', 10)
  ]
};

export function shoppingListReducer(state: State = initialState, action: ShoppingListActions.ShoppingListActions): State {
  switch (action.type) {
    case ShoppingListActions.ADD_INGREDIENT: {
      return {
        ...state,
        ingredients: [
          ...state.ingredients,
          (action as ShoppingListActions.AddIngredient).payload
        ]
      };
    }

    case ShoppingListActions.ADD_INGREDIENTS: {
      return {
        ...state,
        ingredients: [
          ...state.ingredients,
          ...(action as ShoppingListActions.AddIngredients).payload
        ]
      };
    }

    case ShoppingListActions.UPDATE_INGREDIENT: {
      const ingredient = state.ingredients[state.editedIngredientIndex];
      const updatedIngredient = { ...ingredient, ...(action as ShoppingListActions.UpdateIngredient).payload };
      const updatedIngredients = [...state.ingredients];

      updatedIngredients[state.editedIngredientIndex] = updatedIngredient;

      return {
        ...state,
        ingredients: updatedIngredients,
        editedIngredient: null,
        editedIngredientIndex: -1
      };
    }

    case ShoppingListActions.DELETE_INGREDIENT: {
      return {
        ...state,
        ingredients: state.ingredients.filter((ingredient, index) => index !== state.editedIngredientIndex),
        editedIngredient: null,
        editedIngredientIndex: -1
      };
    }

    case ShoppingListActions.START_EDIT: {
      return {
        ...state,
        editedIngredientIndex: (action as ShoppingListActions.StartEdit).payload,
        editedIngredient: { ...state.ingredients[(action as ShoppingListActions.StartEdit).payload] }
      };
    }

    case ShoppingListActions.STOP_EDIT: {
      return {
        ...state,
        editedIngredient: null,
        editedIngredientIndex: -1
      };
    }

    default: return state;
  }
}