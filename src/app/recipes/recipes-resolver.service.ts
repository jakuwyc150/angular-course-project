import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { Recipe } from "./recipe.model";
import { Actions, ofType } from "@ngrx/effects";
import * as fromRoot from "../store/app.reducer";
import * as RecipeActions from '../recipes/store/recipe.actions';
import { take } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class RecipesResolverService implements Resolve<Recipe[]> {
  constructor(
    private store: Store<fromRoot.AppState>,
    private actions$: Actions
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Recipe[] | Observable<Recipe[]> | Promise<Recipe[]> {
    this.store.dispatch(new RecipeActions.FetchRecipes());
    
    return this.actions$.pipe(
      ofType(RecipeActions.SET_RECIPES),
      take(1)
    );
  }
}