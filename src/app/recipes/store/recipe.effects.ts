import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { map, switchMap, withLatestFrom } from "rxjs/operators";
import { Recipe } from "../recipe.model";
import * as RecipeActions from './recipe.actions';
import * as fromRoot from "src/app/store/app.reducer";

@Injectable()
export class RecipeEffects {
  @Effect()
  fetchRecipes = this.actions$.pipe(
    ofType(RecipeActions.FETCH_RECIPES),

    switchMap(fetchAction => {
      return this.http.get<Recipe[]>('https://angular-course-project-db-default-rtdb.europe-west1.firebasedatabase.app/recipes.json').pipe(
        map(recipes => {
          return recipes.map(recipe => {
            return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : []
            };
          });
        }),

        map(recipes => {
          return new RecipeActions.SetRecipes(recipes);
        })
      );
    })
  );

  @Effect({
    dispatch: false
  })
  storeRecipes = this.actions$.pipe(
    ofType(RecipeActions.STORE_RECIPES),

    withLatestFrom(this.store.select('recipes')),

    switchMap(([actionData, recipesState]) => {
      return this.http.put('https://angular-course-project-db-default-rtdb.europe-west1.firebasedatabase.app/recipes.json', recipesState.recipes)
    })
  );

  constructor(private actions$: Actions, private http: HttpClient, private store: Store<fromRoot.AppState>) {}
}