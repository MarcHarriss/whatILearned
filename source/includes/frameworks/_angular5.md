# Angular 5

## Angular basics

### Custom directives

> It is recommended to use Directives as attributes

```html
<!-- ccCardHover is the directive -->
<div class="card" ccCardHover></div>

```

> We now create the directive by annotating a class with the directive decorator.

```javascript
// need to import it from core
import { Directive } from '@angular/core';
// decorate the class with a directive
@Directive({
  selector: [ccCardHover]
})
class cardHoverDirective {

}
// need to declare our directives in the NgModule
@NgModule({
  imports: ...,
  declarations: [
    AppComponent,
    cardhoverDirective
  ],
  bootstrap: [AppComponent]
})
```

Directive selectors are wrapped in [] for a reason. The selector attribute uses CSS matching rules to match a component or a directive to an html element. In CSS to match a specific element we would just type in the name of the element.
