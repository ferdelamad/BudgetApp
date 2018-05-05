
//BUDGET CONTROLLER
var budgetController = (function () {

  //create an obj constructor with a description, value and ID
  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  }

  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  }

  //You need to store your incomes and expeses somewhere!
  var data = {
    ids: 0,
    allItems: {
      inc: [],
      exp: []
    },
    totals: {
      inc: 0,
      exp: 0
    }
  }

  return {
    addItem: function(type, desc, val) {
      var newItem, id;

      // CREATE A NEW ID -- ID = last element ID + 1
      //id = data.allItems[type][data.allItems[type].length-1].id + 1;

      // Create a new item based if its an Expense or Income
      id = data.ids;
      if (type === 'inc') {
        newItem = new Income(id, desc, val);
        data.ids++;
      } else if (type === 'exp') {
        newItem = new Expense(id, desc, val);
        data.ids++;
      }

      //Push it into our data structure
      //you can do [type] because the data obj has the same property
      //as the type value you are passing to the function
      data.allItems[type].push(newItem);

      //give access to newItem to the module that calls this method
      return newItem;
    },
    testing: function() {
      console.log(data);
    }
  };

})();


//UI CONTROLLER
var uiController = (function(){

  var domStrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesCotainer: '.expenses__list',
    descriptionInput: '.add__description',
    valueInput: '.add__value'
  }

  return {
    getInput: function() {
      return {
        type: document.querySelector(domStrings.inputType).value,  // Will be either inc or exp (+ o -)
        description: document.querySelector(domStrings.inputDescription).value,
        value: document.querySelector(domStrings.inputValue).value
      };
    },

    addListItem: function(obj, type) {
      var html, newHtml, element;

      //Create HTML string with placeholder text
      if (type === 'inc') {
        element = domStrings.incomeContainer;
        html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === 'exp') {
        element = domStrings.expensesCotainer;
        html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
      //Replace the placeholder text with actual data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);

      //Insert the HTML into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
      //Testing if it works -> console.log(newHtml);
    },

    clearInputs: function() {
      var descInput = document.querySelector(domStrings.descriptionInput);
      descInput.value = '';
      var valueInput = document.querySelector(domStrings.valueInput);
      valueInput.value = '';
    },

    getDOMstrings: function() {
      return domStrings;
    }

  }

})();


//GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, uiCtrl){

   var setUpEventListeners = function() {
     var DOM = uiCtrl.getDOMstrings();

     document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

     document.addEventListener('keypress', function(event) {
       if (event.keyCode === 13  || event.which === 13) {
         ctrlAddItem();
       }
     });
   }

   var ctrlAddItem = function() {
     var input, newItem;
     // 1. Get the field input data
     input = uiCtrl.getInput();
     // 2. Add the item to the budget controller
     newItem = budgetCtrl.addItem(input.type, input.description, input.value);
     // 3. Add the item to the UI
     uiCtrl.addListItem(newItem, input.type);
     // EXTRA. Clear inputs in UI
     uiCtrl.clearInputs();
     // 4. Calculate the budget
     // 5. Display the budget on the UI

     //Test -> console.log(input);
   };


   //return a PUBLIC initialization function to run the program
   return {
     init: function() {
       console.log('The App started!')
       setUpEventListeners();
     }
   };

})(budgetController, uiController);

controller.init();
