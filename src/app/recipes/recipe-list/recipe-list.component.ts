import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import * as fromRoot from 'src/app/store/app.reducer';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[];
  subscription: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<fromRoot.AppState>
  ) {}

  ngOnInit(): void {
    // this.recipes = this.recipeService.getRecipes();

    this.subscription = this.store.select('recipes').pipe(
      map(recipeState => recipeState.recipes)
    ).subscribe(recipes => {
      this.recipes = recipes;
    });
  }

  onNewRecipe() {
    this.router.navigate(['new'], {
      relativeTo: this.route
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
