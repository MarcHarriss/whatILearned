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

### Pipes

Pipes are used to transform data, when we only need that data transformed in a template.
If we need the data transformed generally we would implement it in our model, for example we
have a number 1234.56 and want to display it as a currency such as $1,234.56.
We could convert the number into a string and store that string in the model but if the only place
we want to show that number is in a view we can use a pipe instead.
We use a pipe with the | syntax in the template, the | character is called the pipe character, like so:

```javascript
{{ 1234.56 | currency: 'USD' | lowercase }} // yes we can chain pipes
```

### Async Pipes

With AsyncPipe we can use promises and observables directly in our template, without having to store the result on an intermediate property or variable.
AsyncPipe accepts as argument an observable or a promise, calls subcribe or attaches a then handler, then waits for the asynchronous result before passing it through to the caller.

> let's create a component with a promise property

```javascript
@component({
    selector: 'async-pipe',
    template: `
<div class="card card-block">
<h4 class="card-title">AsyncPipe</h4>
<p class="card-text" ngNonBindable>{{ promiseData }}</p> 1 <p class="card-text">{{ promiseData }}</p> 2
</div> `
})
class AsyncPipeComponent {
  promiseData: string;
  constructor() {
  this.getPromise().then(v => this.promiseData = v); 3 }
  getPromise() { 4
  return new Promise((resolve, reject) => {
       setTimeout(() => resolve("Promise complete!"), 3000);
     });
  }
}
```

We use ngNonBindable so we can render out {{ promiseData }} as is without trying to bind to to the property promiseData
2 We bind to the property promiseData
3 When the promise resolves we store the data onto the promiseData property
4 getPromise returns a promise which 3 seconds later resolves with the value "Promise complete!"
In the constructor we wait for the promise to resolve and store the result on a property called promiseData on our component and then bind to that property in the template.

> To save time we can use the async pipe in the template and bind to the promise directly, like so:

```javascript
@component({
    selector: 'async-pipe',
    template: `
<div class="card card-block">
<h4 class="card-title">AsyncPipe</h4>
<p class="card-text" ngNonBindable>{{ promise }}</p> <p class="card-text">{{ promise | async }}</p> 1
</div> `
  })
  class AsyncPipeComponent {
    promise: Promise<string>;
    constructor() {
    this.promise = this.getPromise(); 2 }
    getPromise() {
       return new Promise((resolve, reject) => {
         setTimeout(() => resolve("Promise complete!"), 3000);
       });
} }
```

We pipe the output of our promise to the async pipe.
2 The property promise is the actual unresolved promise that gets returned from getPromise
without then being called on it.
The above results in the same behaviour as before, we just saved ourselves from writing a then
callback and storing intermediate data on the component.

### Custom pipes

> To create a new pipe, follow this code

```javascript
import { Pipe } from '@angular/core';
  .
  .
  .
  @Pipe({
    name:"default"
  })
  class DefaultPipe { }
```

> The actual logic for the pipe is put in a function called transform on the class, like so:

```javascript
class DefaultPipe {
 transform(value: string, fallback: string): string {
   let image = "";
   if (value) {
     image = value;
   } else {
     image = fallback;
   }
    return image;
 }
}
```

The first argument to the transform function is the value that is passed into the pipe, i.e. the thing that goes before the | in the expression.
The second parameter to the transform function is the first param we pass into our pipe, i.e. the thing that goes after the : in the expression.

> Specifically with this example:

```javascript
@Component({
   selector: 'app',
   template: `
   <img [src]="imageUrl |
 default:'http://s3.amazonaws.com/uifaces/faces/twitter/sillyleo/128.jpg'"/>
  `
 })
 class AppComponent {
   imageUrl: string = "";
 }
```

## Forms   

In this chapter we will cover both the template driven and model driven approach to creating forms in Angular.
We are going to create a signup form with a first name, last name, email, password and language select box.
We’ll be using the twitter bootstrap UI framework so the HTML markup and classes will match the layout and styles needed for bootstrap.
We will add visual feedback to the users so they know if the individual form fields contain valid values or not. If they are invalid we’ll also show the user helpful validation error messages so they can fix their inputs.
Although the template driven approach is simpler, behind the scenes it’s actually the model driven approach with the models automatically creating for you.
So we’ll first explain the model driven approach, then the template driven approach and finally we’ll show a method of implementing a reactive model driven form with RxJS.

### Model driven forms

First, create your form

> create form html

```html
<!-- novalidate allows us to handle the form instead of the browser -->
<form novalidate>
 <fieldset>
   <div class="form-group">
     <label>First Name</label>
     <input type="text"
            class="form-control">
   </div>
   <div class="form-group">
     <label>Last Name</label>
     <input type="text"
            class="form-control">
   </div>
</fieldset>
 <div class="form-group">
   <label>Email</label>
   <input type="email"
          class="form-control">
 </div>
 <div class="form-group">
   <label>Password</label>
   <input type="password"
          class="form-control">
 </div>
 <div class="form-group">
   <label>Language</label>
   <select class="form-control">
     <option value="">Please select a language</option>
   </select>
 </div>
</form>
```

> We add dynamic select controls by creating an array of langs on the component

```javascript
langs: string[] = [
  'English',
  'French',
  'German',
]
```

> Use Ngfor loop to show them as options

```html  
<select class="form-control">
       <option value="">Please select a language</option>
       <option *ngFor="let lang of langs"
[value]="lang"> 1
{{lang}} 2 </option>
</select>
```

> We represent the form as a model composed of instances of FormGroups and FormControls. Lets create the model for our form on our component, like so:

```javascript
import { FormGroup, FormControl } from '@angular/forms';
.
.
.
class ModelFormComponent implements OnInit { myform: FormGroup; 1
 ngOnInit() {
    myform = new FormGroup({
      name: new FormGroup({ 2
        firstName: new FormControl(), 3
        lastName: new FormControl(),
       }),
       email: new FormControl(),
       password: new FormControl(),
       language: new FormControl()
  });
  }
}

// 1 myform is an instance of FormGroup and represents the form itself.
// 2 FormGroups can nest inside other FormGroups.
// 3 We create a FormControl for each template form control.
```
> We now need to link for HTML form, and our component form

```javascript
  import { ReactiveFormsModule } from '@angular/forms';
```

> Firstly we bind the `form` element to our top level myform property using the formGroup directive, like so:

```html  
<form [formGroup]="myform"> ... </form>
```

Now we’ve linked the myform model to the form template we have access to our myform model in our template.
The value property of the myform model returns the values of all of the controls as an object.

> We can use that with the json pipe to output some useful debug information about our form, like so:

```html
<pre>{{myform.value | json}}</pre>
```

Initially this seems quite exciting but as we enter values into each of the input fields in our form we would see that the model isn’t getting updated, the values remain null.
That’s because although we’ve linked the form element to the myform model this doesn’t automatically link each form control in the model with each form control in the template, we need to do this explicitly with the formControlName and formGroupName directives

> We use the formControlName directive to map each form control in the template with a named form control in the model, like so:

```html
<div class="form-group">
    <label>Email</label>
    <input type="email"
    class="form-control" formControlName="email" 1 required>
</div>
```

We can also associate a group of template form controls to an instance of a form group on our model using formGroupName directive.
Since our firstName and lastName controls are grouped under a form group called name we’ll do just that.

> We then associate the fieldset element with the form group called name in our model like so:

```html
<fieldset formGroupName="name"> ... </fieldset>
```

Then inside our fieldset element we again use the formControlName directive to map individual form controls in the template to form controls under the form group name in our model.

> In the end the template should look like this:

```html
<form [formGroup]="myform"> 1
<fieldset formGroupName="name"> 2 <div class="form-group">
           <label>First Name</label>
           <input type="text"
class="form-control" formControlName="firstName" 3 required>
</div>
       <div class="form-group">
           <label>Last Name</label>
           <input type="text"
class="form-control" formControlName="lastName" 3 required>
       </div>
   </fieldset>
   <div class="form-group">
       <label>Email</label>
       <input type="email"
class="form-control" formControlName="email" 4 required>
</div>
   <div class="form-group">
       <label>Password</label>
       <input type="password"
class="form-control" formControlName="password" 4 required>
</div>
   <div class="form-group">
       <label>Language</label>
       <select class="form-control"
formControlName="language" 4
<option value="">Please select a language</option> <option *ngFor="let lang of langs"
                   [value]="lang">{{lang}}
           </option>
       </select>
   </div>
   <pre>{{myform.value | json}}</pre>
</form>

<!--
1 Use formGroup to bind the form to an instance of FormGroup on our component.
2 Use formGroupName to map to a child FormGroup of myform.
3 Use formControlName to bind to an instance of a FormControl, since these form controls are under a formGroupName of name, Angular will try and find the control in under myform['name'].
4 Use formControlName to bind to an instance of a FormControl directly under myform.
-->

```

### Model driven form validation


Carrying on from the model driven form we started in the previous lecture.
Our form is valid all the time, regardless of what input the user types into the controls.
Validators are rules which an input control has to follow. If the input doesn’t match the rule then the control is said to be invalid.
Since it’s a signup form most of the fields should be required and I would want to specify some more complex validators on the password field to make sure the user is entering a good strong password.
We can apply validators either by adding attributes to the template or by defining them on our FormControls in our model.
To stick to the theme of being model driven we are going to add validators to the form model directly.
Angular comes with a small set of pre-built validators to match the ones we can define via standard HTML5 attributes, namely required, minlegth, maxlength and pattern which we can access from the Validators module.
The first parameter of a FormControl constructor is the initial value of the control, we’ll leave that as empty string. The second parameter contains either a single validator if we only want to apply one, or a list of validators if we want to apply multiple validators to a single control.
Our model then looks something like this:

```javascript
import { FormGroup, FormControl, Validators } from '@angular/forms';
.
.
.
class ModelFormComponent implements OnInit {
   myform: FormGroup;
   ngOnInit() {
     myform = new FormGroup({
      name: new FormGroup({
      firstName: new FormControl('', Validators.required), 1 lastName: new FormControl('', Validators.required),
      }),
      email: new FormControl('', [ 2
                 Validators.required,
      Validators.pattern("[^ @]*@[^ @]*") 3 ]),
      password: new FormControl('', [ Validators.minLength(8), 4 Validators.required
      ]),
      language: new FormControl() 5 });
  }
}

// 1 We add a single required validator to mark this control as required.
// 2 We can also provide an array of validators.
// 3 We specify a pattern validator which checks whether the email contains a @ character.
// 4 The minlength validator checks to see if the password is a minimum of 8 characters long.
// 5 We don’t add any validators to the language select box.
```

### Form control state

The form control instance on our model encapsulates state about the control itself, such as if it is currently valid or if it’s been touched.
Dirty & Pristine
We can get a reference to these form control instances in our template through the controls property of our myform model, for example we can print out the the dirty state of the email field like so:

```html
  <pre>Dirty? {{ myform.controls.email.dirty }}</pre>
```

> dirty is true if the user has changed the value of the control.

> The opposite of dirty is pristine so if we wrote:

```html
<pre>Pristine? {{ myform.controls.email.pristine }}</pre>
```

### Touched & Untouched

A controls is said to be touched if the the user focused on the control and then focused on something else. For example by clicking into the control and then pressing tab or clicking on another control in the form.
The difference between touched and dirty is that with touched the user doesn’t need to actually change the value of the input control.

```html
  <pre>Touched? {{ myform.controls.email.touched }}</pre>

  <!-- touched is true of the field has been touched by the user, otherwise it’s false.
   The opposite of touched is the property untouched. -->
```

### Valid & Invalid

> We can also check the valid state of the control with:

```html
<pre>Valid? {{ myform.controls.email.valid }}</pre>

<!-- valid is true of the field doesn’t have any validators or if all the validators are passing.
Again the opposite of valid is invalid, so we could write: -->

<pre>Invalid? {{ myform.controls.email.invalid }}</pre>

<!-- This would be true if the control was invalid and false if it was valid. -->
```

### Validation styling

Bootstrap has classes for showing visual feedback for form controls when they are invalid.
For instance if we add the has-danger class to the parent div of the input control with the class of
form-group it adds a red border.
Conversely if we add the has-success class it adds a green border.

> We can combine bootstrap classes with dirty and invalid FormControl properties and the ngClass directive to give the user some nice visual feedback, like so:

```html
  <div class="form-group" [ngClass]="{
    'has-danger': myform.controls.email.invalid && myform.controls.email.dirty, 1
    'has-success': myform.controls.email.valid && myform.controls.email.dirty 2
  }">

<!--
1 If the email is invalid and it’s been touched by the user then we add the has-danger class giving the control a red border.
2 If the email is valid and it’s been touched by the user then we add the has-success class giving the control a red border. -->
```

`   <div class="form-group"
         [ngClass]="{
          'has-danger': myform.controls.name.controls.firstName.invalid && myform.controls.name.controls.firstName.dirty,
          'has-success': myform.controls.name.controls.firstName.valid && myform.controls.name.controls.firstName.dirty
  }">
`

The length of the expression quickly becomes unwieldy.
> We can help ourselves here by creating local properties on our component to reflect the individual FormControls and binding directly to them in our template, like so:

```typescript
class ModelFormComponent implements OnInit {
   langs: string[] = [
     'English',
     'French',
     'German',
  ];
  myform: FormGroup; firstName: FormControl; 1 lastName: FormControl; email: FormControl; password: FormControl; language: FormControl;
   ngOnInit() {
     this.createFormControls();
     this.createForm();
  }
  createFormControls() { 2
  this.firstName = new FormControl('', Validators.required); this.lastName = new FormControl('', Validators.required); this.email = new FormControl('', [
       Validators.required,
       Validators.pattern("[^ @]*@[^ @]*")
     ]);
     this.password = new FormControl('', [
       Validators.required,
       Validators.minLength(8)
  ]);
     this.language = new FormControl('', Validators.required);
   }
  createForm() { 3
  this.myform = new FormGroup({
       name: new FormGroup({
         firstName: this.firstName,
         lastName: this.lastName,
       }),
       email: this.email,
       password: this.password,
       language: this.language
  });
  }
}

// 1 We declare the FormControls as properties of our component. So we can bind to them directly in our tempalte without having to go through the top level myform model.
// 2 We first create the FormControls.
// 3 We then construct the myform model from the form controls we created previously and stored as properties on our component.
```

Now we can bind directly to our individual form controls in our template without having to traverse the tree from the myform instance.
> We can therefore re-write the wordy firstName ngClass expression to something much more succinct, like so:

```typescript
<div class="form-group"
   [ngClass]="{
    'has-danger': firstName.invalid && firstName.dirty,
    'has-success': firstName.valid && firstName.dirty
  }">
```

### Validation messages

As well as styling a form when it’s invalid it’s also useful to show the user error messages with helpful hints about how they can make the form valid again.
Taking what we have learnt about form validation styling we can apply the same method to conditionally show or hide an error message.
Bootstrap conveniently has some markup and classes for form controls which we can use to show these error messages,

> lets add them to our password form control, like so:

```html

  <div class="form-group">
    <label>Password</label>
    <input type="password"
          class="form-control"
          formControlName="password"> <div class="form-control-feedback" 1
          *ngIf="password.invalid && password.dirty"> 2 Field is invalid
    </div>
  </div>

<!--
1. The class form-control-feedback shows a message in red if the parent form-group div also has the has-danger class, i.e. when the field is invalid any text under this div will show as red.
2. We only show the message when the password field is both invalid and dirty. -->
```

How to do we show a separate validation error message for each of the validators? We can do that by checking another property on our form control called errors.
This is an object which has one entry per validator, the key is the name of the validator and if the value is not null then the validator is failing.

> like so:

```typescript
<div class="form-control-feedback" *ngIf="password.errors && (password.dirty ||
  password.touched)">
    <p *ngIf="password.errors.required">Password is required</p>
    <p *ngIf="password.errors.minlength">Password must be 8 characters long</p>
  </div>
```

Digging a bit deeper into the errors property. The value can contain useful bits of information which we can show the user, for example the minlength validator gives us the requiredLength and actualLength properties.

```json
{
    "minlength": {
      "requiredLength": 8,
      "actualLength": 1
    }
}
```

```typescript
<div class="form-control-feedback"
       *ngIf="password.errors && (password.dirty || password.touched)">
    <p *ngIf="password.errors.required">Password is required</p>
    <p *ngIf="password.errors.minlength">Password must be 8 characters long, we need
      another {{password.errors.minlength.requiredLength -
      password.errors.minlength.actualLength}} characters
    </p>
</div>
```

### Submitting

To submit a form in Angular we need a button with a type of submit in our form markup in between the `form` ... </form> tags, like so:

```html
<form> .
    .
    .
    <button type="submit" class="btn btn-primary" >Submit</button>
</form>
```

When we press this submit button this triggers the normal HTML5 form submission mechanism, so it tries to POST the form to the current URL.
However instead of issuing a standard POST we want to call a function on our component instead, to do that we use the ngSubmit directive and add it to the form element, like so:

```html
<form (ngSubmit)="onSubmit()">
    .
    .
    .
    <button type="submit" class="btn btn-primary" >Submit</button>
</form>
```

This hijacks the normal form submission mechanism and instead calls the function onSubmit() on our component. Let’s implement onSubmit() with a simple console.log line like so:

```typescript
onSubmit() {
    if (this.myform.valid) {
      console.log("Form Submitted!");
    }
}
```

### Resetting

In a model driven form to reset the form we just need to call the function reset() on our myform model.

> For our sample form lets reset the form in the onSubmit() function, like so:

```typescript
onSubmit() {
    if (this.myform.valid) {
      console.log("Form Submitted!");
      this.myform.reset();
    }
}

// The form now resets, all the input fields go back to their initial state and any valid, touched or dirty properties are also reset to their starting values.

```

### Reactive Model Form Learning Objectives

Both FormControls and FormGroups expose an observable called valuesChanged. By subscribing to this observable we can react in real-time to changing values of an individual form control, or a group of form controls.
One use case could be implementing a search field in an application, as the user types into the search field we may want to call an API.
Since calling an API is relatively expensive we want to limit the number of API calls to only when absolutely necessary.

> Our component might have a template like so:

```html
<input type="search"
         class="form-control"
         placeholder="Please enter search term">
  <hr/>
  <ul>
    <li *ngFor="let search of searches">{{ search }}</li>
</ul>
```

Just a single search input field and then underneath that we render out a list of search terms from an array called searches.

> The initial component class for the above template looks like so:

```typescript
class ReactiveModelFormComponent implements OnInit { searchField: FormControl; 1
searches: string[] = []; 2
    ngOnInit() {
      this.searchField = new FormControl();
} }

// 1 We declare a searchField property which is a FormControl, we initialise this later in our ngOnInit function.
// 2 We declare an array of searches, as we perform searches we’ll push the individual search terms onto this array so we can see them printed out on the page.
```

> To link our searchField FormControl to our template form control we use another directive called formControl, like so:

```html
<input type="search"
         class="form-control"
         placeholder="Please enter search term"
[formControl]="searchField"> 1 <hr/>
  <ul>
    <li *ngFor="let search of searches">{{ search }}</li>
</ul>

// 1 We use the formControl directive to link the searchField FormControl to the template form control.
```

### React to changes in our form

> To react to changes on this form we need to subscribe to the valueChanges observable on our searchField, like so:

```typescript
ngOnInit() {
      this.searchField = new FormControl();
      this.searchField.valueChanges
          .subscribe(term => {
            this.searches.push(term);
}); }
```

### Template Driven Forms

The key in understanding the template driven approach is that it still uses the same models as the model driven approach. In the template driven approach Angular creates the models, the FormGroups and FormControls, for us via directives we add to the template.
That’s why in this course we teach the model driven approach first. So you’ll have a good knowledge of the underlying model structure that is still present in template driven forms.

We create a basic form component, exactly the same as the model form component we started with in this section, with a basic form template, a dynamic select box and a simple component like so:

```typescript
@Component({
      selector: 'template-form',
      templateUrl: `
  <form novalidate>
    <fieldset>
      <div class="form-group">
        <label>First Name</label>
        <input type="text"
               class="form-control">
      </div>
      <div class="form-group">
        <label>Last Name</label>
        <input type="text"
             class="form-control">
    </div>
  </fieldset>
  <div class="form-group">
    <label>Email</label>
    <input type="email"
           class="form-control">
  </div>
  <div class="form-group">
    <label>Password</label>
    <input type="password"
           class="form-control">
  </div>
  <div class="form-group">
    <label>Language</label>
    <select class="form-control">
      <option value="">Please select a language</option>
      <option *ngFor="let lang of langs"
              [value]="lang">
              {{lang}}
      </option>
    </select>
  </div>
</form>
`
})
class TemplateFormComponent implements OnInit {
    langs:string[] = [
        'English',
'French',
'German', ];
ngOnInit() {
} }
```

<aside class="notice">
Remove all the formGroup, formGroupName, formControl and formControlName directives from our template, these are from the ReactiveFormsModule and used for model driven forms.
</aside>

The directives we need to build template driven forms are in the FormsModule not the
ReactiveFormsModule, so lets import that and add it to our NgModule as an import and remove the ReactiveFormsModule.
Remove all the formGroup, formGroupName, formControl and formControlName directives from our template, these are from the ReactiveFormsModule and used for model driven forms

> we only need the Formsmodule

```typescript
import {FormsModule} from '@angular/forms';
```

One of the directives pulled in via the FormsModule is called NgForm. This directive has a selector which matches the `form` tag.
So just by adding FormsModule to our NgModule imports our template form is already associated wth an instance of the NgForm directive.
This instance of ngForm is hidden but we can expose it with a local template reference variable attached to the form element, like so:

`<form #f="ngForm"> ... </form>`

Now we can use the variable f in our template and it will point to our instance of the ngForm directive.
One of the things the ngForm directive does is create a top level FormGroup and lets us call functions as if it was an instance of a FormGroup.
If you remember one of the properties on a FormGroup was value, this is an object representation of all the forms controls.
So just like model driven forms we can output that to screen simply with a pre tag and the json pipe, like so:

`<pre>{{f.value | json}}</pre>`

If you ran this code now all that would get printed out is {}. The forms value is an empty object, even if you started typing into the input fields the value would not update.
This is because the ngForm directive doesn’t automatically detect all the controls that exist inside the `form` tag it’s linked to. So although it’s created a top level FormGroup, it’s empty.
We need go through and explicitly register each template control with the ngForm directive. ngForm will then create a FormControl instance and map that to the FormGroup.
In model driven forms we added formControlName directives to map template form controls to existing model form controls on the component.
In template driven forms we need Angular to create the model form controls for us for each template form control. To do that we need to do two things to each template form control:

1. Add the NgModel directive
2. Add the name attribute.
The NgModel directive creates the FormControl instance to manage the template form control and the name attribute tells the NgModel directive what key to store that FormControl under in the parent FormGroup, like so:

`<input name="foo" ngModel>`

is equivalent to:

`let model = new FormGroup({
    "foo": new FormControl()
});`

> After adding ngModel to our template email input control, like so:

```html
<div class="form-group">
    <label>Email</label>
    <input type="email"
           class="form-control"
           name="email"
           ngModel>
</div>

<!-- We can also see that f.value now shows the value of the email field, like so: -->

{
    "email": "asim@codecraft.tv"
}

<!-- If we now added the name attribute and ngModel directive to all of our template form controls we would see f.value print out: -->

{
    "firstName": "",
    "lastName": "",
    "email": "",
    "password": "",
    "language": ""
}

```

This isn’t exactly the same as before, in our model driven form we wanted to group firstName and lastName into a nested FormGroup called name.
We can do the same in template driven forms with the ngModelGroup directive, lets add that to the parent fieldset element of our firstName and lastName template form controls, like so:

`<fieldset ngModelGroup="name"> ... </fieldset>`

> We can now see that the output of f.value matches what we have before

```json
{
    "name": {
      "firstName": "",
      "lastName": ""
    },
    "email": "",
    "password": "",
    "language": ""
}
```

### Two way data binding

Another feature of the ngModel directive is that it lets us setup two way data binding between a template form control and a variable on our component.
So when the user changes the value in the template form control the value of the variable on the component automatically updates and when we change the variable on the component the template form control automatically updates.
The syntax for using the ngModel directive in this way is a little bit different, let’s set this up for our email field. First we add a string property called email on our component so we have somewhere to store the email, like so:

```typescript
class TemplateFormComponent implements OnInit {
  email: string; 1
  langs:string[] = [
            'English',
            'French',
            'German',
  ];
  ngOnInit() {
  }
}
```

1 We add an email property so we can store the email the user enters on the component.

> Then we setup two way data binding by changing our email ngModel directive to:

```typescript
 <input ... [(ngModel)]="email" >
```

### Domain model

In Angular we typically won’t data bind to a simple string or object on our component but a domain model we’ve defined via a class, lets create one for our Signup form called Signup.

```typescript
class Signup {
   constructor(public firstName:string = '',
               public lastName:string = '',
               public email:string = '',
               public password:string = '',
               public language:string = '') {
} }
```

Then on our component we replace our email property with:

`model: Signup = new Signup();`

Now lets bind all our input controls to our model directly, like so:

`<input ... [(ngModel)]="model.email" >`

### Validation messages

In the model driven approach we defined the validators via code in the component.
In the template driven approach we define the validators via directives and HTML5 attributes in our template itself, lets add validators to our form template.
All the fields apart from the language were required, so we’ll just add the required attribute to those input fields, like so:

> validate forms via html5

```html

  <input type="email"
       class="form-control"
       name="email"
       [(ngModel)]="model.email"
       required
       pattern="[^ @]*@[^ @]*">
 <input type="password"
          class="form-control"
          name="password"
          [(ngModel)]="model.password"
          required
          minlength="8">
```

### Validation styling

Similar to model driven forms we can access each model form controls state by going through the top level form group.
The ngForm directive makes the top level FormGroup available to us via the .form property, so we can show the valid, dirty or touched state of our email field like so:

```html
<pre>Valid? {{f.form.controls.email?.valid}}</pre>
  <pre>Dirty? {{f.form.controls.email?.dirty}}</pre>
  <pre>Touched? {{f.form.controls.email?.touched}}</pre>
```

```html

  <div class="form-group"
       [ngClass]="{
        'has-danger': f.form.controls.email?.invalid && (f.form.controls.email?.dirty ||
  f.form.controls.email?.touched),
        'has-success': f.form.controls.email?.valid && (f.form.controls.email?.dirty ||
  f.form.controls.email?.touched)
   }">
    <label>Email</label>
    <input type="email"
           class="form-control"
           name="email"
           [(ngModel)]="model.email"
           required
           pattern="[^ @]*@[^ @]*">
  </div>
```

### Writing shorter validation expressions

The NgForm directive does provide us with a shortcut to the controls property so we can write f.controls.email?.valid instead of f.form.controls.email?.valid.
But both are still pretty wordy, and if we wanted to get access to a nested form control like firstName it can become even more cumbersome, f.controls.name.firstName?.valid.
Using the ngModel directive however provides us with a much shorter alternative.
We can get access to the instance of our ngModel directive by using a local template reference
variable, like so:

`<input ... [(ngModel)]="model.email" #email="ngModel"> </input>`

Then in our template we can use our local variable email.
Since NgModel created the FormControl instance to manage the template form control in the first place, it stored a reference to that FormControl in its control property which we can now access in the template like so email.control.touched. This is such a common use case that the ngModel directive provides us a shortcut to the control property, so we can just type email.touched instead.
We can then shorten our validation class expression and re-write the template for our email control like so:

```html
<div class="form-group"
       [ngClass]="{
'has-danger': email.invalid && (email.dirty || email.touched), 1
        'has-success': email.valid && (email.dirty || email.touched)
   }">
    <label>Email</label>
    <input type="email"
           class="form-control"
           name="email"
           [(ngModel)]="model.email"
           required
           pattern="[^ @]*@[^ @]*"
#email="ngModel"> 2 </div>

<!-- 1 We can now access the form control directly through the template local variable called email.
2 We create a template local variable pointing to the instance of the ngModel directive on this
input control. -->
```

### Validation messages

```html
<div class="form-control-feedback"
       *ngIf="email.errors && (email.dirty || email.touched)">
    <p *ngIf="email.errors.required">Email is required</p>
    <p *ngIf="email.errors.minlength">Email must contain at least the @ character</p>
  </div>
```

### Submitting the form

We need a submit button, this is just button with a type="submit" somewhere between the opening
and closing form tags.

```html
<form> .
    .
    .
    <button type="submit" class="btn btn-primary" >Submit</button>
</form>


```

By default this would just try to post the form to the current URL in the address bar, to hijack this process and call a function on our component instead we use the ngSubmit directive (which comes from the FormsModule).

`<form (ngSubmit)="onSubmit()">...</form>`

This is an output event binding which calls a function on our component called onSubmit when the user clicks the submit button.
However, we don’t want the form submitted when the form is invalid. We can easily disable the submit button when the form is invalid, like so:

`<button type="submit" class="btn btn-primary" [disabled]="f.invalid">Submit</button>`

### Resetting the form

In the model driven approach we reset the form by calling the function reset() on our myform model.

We need to do the same in our template driven approach but we don’t have access to the underlying form model in our component. We only have access to it in our template via our local reference variable f.form
However, we can get a reference to the ngForm instance in our component code by using a ViewChild decorator which we covered in the section on components earlier on in this course.
This decorator gives us a reference in our component to something in our template. First we create a property on our component to hold an instance of NgForm, like so:

`form: any;`

Then we import the ViewChild decorator from @angular/core, like so:

`import { ViewChild } from '@angular/core';`

Finally we decorate our property with the ViewChild decorator. We pass to ViewChild the name of the local reference variable we want to link to, like so:

`@ViewChild('f') form: any;`

And then in our onSubmit() function we can just call form.reset() like we did in the model driven approach.

> The full listing for our component is now

```typescript
class TemplateFormComponent {
    model: Signup = new Signup();
    @ViewChild('f') form: any;
    langs: string[] = [
      'English',
      'French',
      'German',
];
    onSubmit() {
      if (this.form.valid) {
        console.log("Form Submitted!");
        this.form.reset();
      }
} }
```

## Dependency Injection & Providers

As our application grows beyond one module then we need to deal with the issue of dependencies.

*What is a dependency?*
When module A in an application needs module B to run, then module B is a dependency of module A.

Realistically when writing applications we can’t get away from building numerous dependencies between parts of our code.

### DI Components

`Token`
This uniquely identifies something that we want injected. A dependancy of our code.
`Dependancy`
The actual code we want injected.
`Provider`
This is a map between a token and a list of dependancies.
`Injector`
This is a function which when passed a token returns a dependancy (or a list of dependencies) === Summary

### Injectors

At the core of the DI framework is an injector.
An injector is passed a token and returns a dependency (or list of).
We say that an injector resolves a token into a dependency.
Normally we never need to implement an injector. Angular handles low level injectable implementation details for us and typically we just configure it to give us to behaviour we want.

> However to explain how injectors work we will implement some injectable code, like so:

```typescript
import { ReflectiveInjector } from '@angular/core'; 1
class MandrillService {}; 2
class SendGridService {};
let injector = ReflectiveInjector.resolveAndCreate([ 3
  MandrillService,
  SendGridService
]);
let emailService = injector.get(MandrillService); 4
console.log(emailService);

// 1 We import our injector class.
// 2 We create two service classes, a MandrillService which sends email via the Mandrill platform
// and the SendGridService which sends email via the SendGrid platform.
// 3 We configure our injector by providing an array of classes.
// 4 We pass in a token, the class name, into our injector and ask it to resolve to a dependency. In this case it simply returns an instance of MandrillService.

```

<aside class="notice">
The injector doesn’t return the class, but an instance of the class instantiated with new, like so:
`emailService = new MandrillService()`
</aside>

### Dependency caching

>The dependencies returned from injectors are cached. So multiple calls to the same injector for the same token will return the same instance,  like so:

```typescript
let emailService1 = injector.get(MandrillService);
let emailService2 = injector.get(MandrillService);
console.log(emailService1 === emailService2); // true
```

> emailService1 and emailService2 point to exactly the same thing, therefore we can share state between two different parts of our application by injecting the same dependency, like so:

```typescript
let emailService1 = injector.get(MandrillService);
  emailService1.foo = "moo";
let emailService2 = injector.get(MandrillService); console.log(emailService2.foo); // moo 1

// 1 Since emailService1 and emailService2 are the same instance,
// setting a property on one will mean it can be read from the other and vice versa.
```

### Child Injectors

Injectors can have one or more child injectors. These behave just like the parent injector with a few additions.

> A. Each injector creates it’s own instance of a dependency

```typescript
import { ReflectiveInjector } from '@angular/core';
  class EmailService {}
let injector = ReflectiveInjector.resolveAndCreate([EmailService]); 1
let childInjector = injector.resolveAndCreateChild([EmailService]);
  console.log(injector.get(EmailService) === childInjector.get(EmailService)); // false
2

// 1 The childInjector and parent injector are both configured with the same providers.
// 2 The childInjector resolves to a different instance of the dependency compared to the parent injector.
```

> B. Child injectors forward requests to their parent injector if they can’t resolve the token locally.

```typescript
import { ReflectiveInjector } from '@angular/core';
  class EmailService {}
let injector = ReflectiveInjector.resolveAndCreate([EmailService]); 1
let childInjector = injector.resolveAndCreateChild([]); 2
  console.log(injector.get(EmailService) === childInjector.get(EmailService)); // true
3

// 1 We configure a parent injector with EmailService.
// 2 We create a child injector from the parent injector, this child injector is not configured with any providers.
// 3 The parent and child injectors resolve the same token and both return the same instance of the dependency.
```

We request the token EmailService from the childInjector, it can’t find that token locally so it asks it’s parent injector which returns the instance it had cached from a previous direct reqeust.
Therefore the dependency returned by the child and the parent is exactly the same instance .

*Summary*
We configure injectors with providers.
We pass to injectors a token and then resolve this into a dependancy.
Injectors cache dependancies, so multiple calls result in the same instance being returned.
Different injectors hold different caches, so resolving the same token from a different injector will return a different instance.
We create child injectors from parent injectors.
A child injector will forward a request to their parent if it can’t resolve the token itself.
So far we’ve only covered providers that provide classes providers can provide other types of dependencies which is the topic of the next lecture.

### Providers

As mentioned in the previous lecture we can configure injectors with providers and a provider links a token to a dependency.

> But so far we seem to be configuring our injector with just a list of classes, like so:

```typescript
let injector = ReflectiveInjector.resolveAndCreate([
    MandrillService,
    SendGridService
]);

// this is actually short for

let injector = ReflectiveInjector.resolveAndCreate([
    { provide: MandrillService, useClass: MandrillService },
    { provide: SendGridService, useClass: SendGridService },
]);
```

The real configuration for a provider is an object which describes a token and configuration for how to create the associated dependency.
The provide property is the token and can either be a type, a string or an instance of something called an InjectionToken.
The other properties of the provider configuration object depend on the kind of dependency we are configuring, since we are configuring classes in this instance we the useClass property.

### Switching dependencies


















## RxJS & Angular

### Angular observables

There are a few places in Angular where reactive programming and observables are in use.
EventEmitter - Under the hood this works via Observables.
HTTP - We’ve not covered this yet but HTTP requests in Angular are all handled via Observables.
Forms - Reactive forms in Angular expose an observable, a stream of all the input fields in the form combined.

### React Forms

Building the component looks like this

```javascript
import 'rxjs/Rx'; 1 .
.
.
class FormAppComponent {
    form: FormGroup; 2
    comment = new FormControl("", Validators.required); 3
    name = new FormControl("", Validators.required); 3
    email = new FormControl("", [ 3
      Validators.required,
      Validators.pattern("[^ @]*@[^ @]*")
    ]);
constructor(fb: FormBuilder) { this.form = fb.group({ 4
        "comment": this.comment,
        "name": this.name,
        "email": this.email
}); }
    onSubmit() {
      console.log("Form submitted!");
} }
```

1 We import the full RxJS library into our application (this import includes all the operators).
2 We create a form property which will hold a representation of our form so we can interact with it from code.
3 We create individual instances of controls and rules for when user input is valid or invalid.
4 We then link our form with the controls we created in the constructor using something called a FormBuilder
We create a form instance on our component, this instance exposes an observable, a stream of all the input fields combined into a object, via it’s valueChanges property.
We can subscribe to that observable and print our the current value of the form, like so:

```javascript
constructor(fb: FormBuilder) {
  this.form = fb.group({
    "comment": this.comment,
    "name": this.name,
    "email": this.email
  });
  this.form.valueChanges
      .subscribe( data => console.log(JSON.stringify(data)));
}
```

> as we type into the form, this gets printed

```javascript
  {"comment":"f","name":"","email":""}
  {"comment":"fo","name":"","email":""}
  {"comment":"foo","name":"","email":""}
  {"comment":"foo","name":"a","email":""}
  {"comment":"foo","name":"as","email":""}
  {"comment":"foo","name":"asi","email":""}
  {"comment":"foo","name":"asim","email":""}
  {"comment":"foo","name":"asim","email":"a"}
  {"comment":"foo","name":"asim","email":"as"}
  {"comment":"foo","name":"asim","email":"asi"}
  {"comment":"foo","name":"asim","email":"asim"}
  {"comment":"foo","name":"asim","email":"asim@"}
```

### Processing only valid form values

Looking at the stream above we can see that most of the stream items are for invalid forms; comment, name and email are required so any form without a value for those is invalid. Also we have some special validation logic for the email field, it’s only valid if it contains an @ character.
In fact the only valid stream item is the last one {"comment":"foo","name":"asim","email":"asim@"}. That’s a common issue when dealing with forms, we only want to bother processing the results of a
valid form, there really isn’t any point processing invalid form entries.
We can solve this by using another RxJS operator called filter. filter accepts a function and passes to it each item in the stream, if the function returns true filter publishes the input item to the output stream.

```javascript
constructor(fb: FormBuilder) {
      this.form = fb.group({
        "comment": this.comment,
        "name": this.name,
        "email": this.email
      });
      this.form.valueChanges
          .filter(data => this.form.valid)
          .subscribe( data => console.log(JSON.stringify(data)));
    }
```

this.form.valid is true when the whole form is valid. So while the form is invalid .filter(data ⇒ this.form.valid) doesn’t push items to the output stream, when the form is valid it does start pushing items to the output stream.
The end result of the above is that when we type into the form the same data as before, the only item that gets published in our subscribe callback is:

`{"comment":"foo","name":"Asim","email":"asim@"}`

### Cleaning form data

A comment input box is a dangerous place, hackers try to input things like `script` tags and if we are not careful we open ourselves to the possibility of hackers gaming our applications.
So one common safety measure for comment forms is to strip our app html tags from the message before we post it anywhere.
We can solve that again via. a simple map operator on our form processing stream.

```javascript   
constructor(fb: FormBuilder) {
      this.form = fb.group({
        "comment": this.comment,
        "name": this.name,
        "email": this.email
      });
      this.form.valueChanges
          .filter(data => this.form.valid)
          .map(data => {
            data.comment = data.comment.replace(/<(?:.|\n)*?>/gm, '');
            return data
          })
          .subscribe( data => console.log(JSON.stringify(data)));
    }
```

We added this after the filter operator, so this map operator only gets called when the previous filter operator publishes to it’s output stream. To put it another way, this map operator only gets called on valid form values.
