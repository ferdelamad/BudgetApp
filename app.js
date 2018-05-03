
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
    allItems: {
      inc: [],
      exp: []
    },
    totals: {
      inc: 0,
      exp: 0
    }
  }

})();


//UI CONTROLLER
var uiController = (function(){

  var domStrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn'
  }

  return {
    getInput: function() {
      return {
        type: document.querySelector(domStrings.inputType).value,  // Will be either inc or exp (+ o -)
        description: document.querySelector(domStrings.inputDescription).value,
        value: document.querySelector(domStrings.inputValue).value
      };
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
     // 1. Get the field input data
     var input = uiCtrl.getInput();
     // 2. Add the item to the budget controller
     // 3. Add the item to the UI
     // 4. Calculate the budget
     // 5. Display the budget on the UI
     console.log(input);
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
