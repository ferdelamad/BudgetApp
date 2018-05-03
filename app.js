// BUDGET CONTROLLER
var budgetController = (function() {
  //private code here
})();

// UI CONTROLLER
var uiController = (function() {
  //private code here
})();


// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, uiCtrl) {
  //private code here
  var ctrlAddItem = function() {
    // 1. Get the field input data
    // 2. Add the item to the budgetController
    // 3. Add the new item to the UI
    // 4. Calculate the new budget
    // 5. Display the budget on the UI
  }

  document.querySelector('.add__btn').addEventListener('click', function () {
    console.log('This button was clicked!')

  });

  document.addEventListener('keypress', function(event) {

    if (event.keyCode === 13 || event.which === 13) {
      console.log('ENTER was pressed.');
    }
  });

})(budgetController, uiController);
