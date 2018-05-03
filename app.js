
//BUDGET CONTROLLER
var budgetController = (function () {


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

   var DOM = uiController.getDOMstrings();

   var ctrlAddItem = function() {
     // 1. Get the field input data
     var input = uiCtrl.getInput();
     console.log(input);
     // 2. Add the item to the budget controller
     // 3. Add the item to the UI
     // 4. Calculate the budget
     // 5. Display the budget on the UI
   };

  document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

  document.addEventListener('keypress', function(event) {

    if (event.keyCode === 13  || event.which === 13) {
      ctrlAddItem();
    }

  });

})(budgetController, uiController);
