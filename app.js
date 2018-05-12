
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

  //Calculate total income or total expenses
  var calculateTotal = function(type) {
    data.totals[type] = data.allItems[type].reduce( function(acc, current) {
      return acc + current.value;
    }, 0);
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
    },
    budget: 0,
    percetange: 0
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

    calculateBudget: function() {
      //1.- Calculate total income and total expenses
      calculateTotal('inc');
      calculateTotal('exp');

      //2.- Calculate total budget (income - expenses)
      data.budget = data.totals.inc - data.totals.exp;

      //3.- Calculate the percetange of income that we have spent
      if (data.totals.inc > 0) {
        data.percetange = Math.floor((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percetange = 0;
      }
      // In order to get the percentage of how much we have spent
      // Example: Income = 200, Expenses = 100, spent 50% -> 100/200 = 0.5 * 100

    },

    getBudget: function() {
      return {
        budget: data.totals.inc - data.totals.exp,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percetange
      }
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
    budget: ".budget__value",
    income: ".budget__income--value",
    expenses: ".budget__expenses--value",
    percentage: ".budget__expenses--percentage",
    container: ".container"
  }

  return {
    getInput: function() {
      return {
        type: document.querySelector(domStrings.inputType).value,  // Will be either inc or exp (+ o -)
        description: document.querySelector(domStrings.inputDescription).value,
        value: document.querySelector(domStrings.inputValue).valueAsNumber
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

    clearFields: function() {
      var fields = document.querySelectorAll(domStrings.inputDescription + ', ' + domStrings.inputValue);
      var fieldsArr = Array.prototype.slice.call(fields);
      fieldsArr.forEach(function(field) {
        field.value = '';
      });
      fieldsArr[0].focus();
    },

    displayBudget: function(obj) {
      document.querySelector(domStrings.budget).textContent = obj.budget;
      document.querySelector(domStrings.income).textContent = obj.totalInc;
      document.querySelector(domStrings.expenses).textContent = obj.totalExp;

      if (obj.percentage > 0) {
        document.querySelector(domStrings.percentage).textContent = obj.percentage + '%';
      } else {
        document.querySelector(domStrings.percentage).textContent = '---'
      }
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

     document.querySelector(DOM.container).addEventListener('click', ctrlDelItem);

   }

   var calculateBudget = function() {
     //1.- Calculate the budget
     budgetCtrl.calculateBudget();
     //2.- Return the budget
     var budget = budgetCtrl.getBudget();
     //3.- Display the budget on the UI
     uiCtrl.displayBudget(budget);
     console.log(budget);
   }

   var ctrlAddItem = function() {
     var input, newItem;
     // 1. Get the field input data
     input = uiCtrl.getInput();

     if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
     // 2. Add the item to the budget controller
     newItem = budgetCtrl.addItem(input.type, input.description, input.value);
     // 3. Add the item to the UI
     uiCtrl.addListItem(newItem, input.type);

     // 4. Clear the fields
     uiCtrl.clearFields();
     // 5. Calculate and display budget
     calculateBudget();
     //Test -> console.log(input);

    }
   };

   var ctrlDelItem = function(event) {
     console.log(event.target.parentNode.parentNode.parentNode.parentNode);
   }



   //return a PUBLIC initialization function to run the program
   return {
     init: function() {
       console.log('The App started!')
       uiCtrl.displayBudget({
         budget: 0,
         totalInc: 0,
         totalExp: 0,
         percentage: -1
       })
       setUpEventListeners();
     }
   };

})(budgetController, uiController);

controller.init();
