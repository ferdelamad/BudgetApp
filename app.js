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
  document.querySelector('.add__btn').addEventListener('click', function () {
    console.log('This button was clicked!')
     // 1. Get the field input data
     // 2. Add the item to the budgetController
     // 3. Add the new item to the UI
     // 4. Calculate the new budget
     // 5. Display the budget on the UI

  });

  document.addEventListener('keypress', function(event) {
    console.log(event);
  });

})(budgetController, uiController);
