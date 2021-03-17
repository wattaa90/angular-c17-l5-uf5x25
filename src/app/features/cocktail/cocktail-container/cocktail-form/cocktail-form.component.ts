import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { first } from "rxjs/operators";
import { Cocktail } from "../../../../shared/interfaces/cocktail.interface";
import { CocktailService } from "../../../../shared/services/cocktail.service";

@Component({
  selector: "app-cocktail-form",
  templateUrl: "./cocktail-form.component.html",
  styleUrls: ["./cocktail-form.component.scss"]
})
export class CocktailFormComponent implements OnInit {
  public cocktailForm: FormGroup;
  public cocktail: Cocktail;

  public get ingredients() {
    return this.cocktailForm.get("ingredients") as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private cocktailService: CocktailService,
    public router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      const index = paramMap.get("index");
      if (index !== null) {
        this.cocktailService
          .getCocktail(Number(index))
          .pipe(first())
          .subscribe((cocktail: Cocktail) => {
            this.cocktail = cocktail;
            this.initForm(this.cocktail);
          });
      } else {
        this.initForm();
      }
    });
  }

  private initForm(
    cocktail: Cocktail = { name: "", description: "", img: "", ingredients: [] }
  ): void {
    this.cocktailForm = this.fb.group({
      name: [cocktail.name, Validators.required],
      img: [cocktail.img, Validators.required],
      description: [cocktail.description, Validators.required],
      ingredients: this.fb.array(
        cocktail.ingredients.map(ingredient =>
          this.fb.group({
            name: [ingredient.name, Validators.required],
            quantity: [ingredient.quantity, Validators.required]
          })
        ),
        Validators.required
      )
    });
  }

  public addIngredient(): void {
    this.ingredients.push(
      this.fb.group({
        name: ["", Validators.required],
        quantity: [0, Validators.required]
      })
    );
  }

  public submit(): void {
    if (this.cocktail) {
      this.cocktailService
        .editCocktail(this.cocktail._id, this.cocktailForm.value)
        .subscribe();
    } else {
      this.cocktailService.addCocktail(this.cocktailForm.value).subscribe();
    }
    this.router.navigate([".."], { relativeTo: this.activatedRoute });
  }
}
