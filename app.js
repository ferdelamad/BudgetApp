
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
    this.percentage = -1 //We use -1 when something it's not defined
  }

  Expense.prototype.calcPercentages = function(totalIncome) {
    if(totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    }
  }

  Expense.prototype.getPercentages = function() {
    return this.percentage;
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

    calculatePercentages: function() {
      //income = 100
      //expenses:
       //a = 10
         //a% = 10/100 = 10%
       //b = 20
         //b% = 20/100 = 20%
       //c = 40
         //c% = 40/100 = 40%
      data.allItems.exp.forEach(exp => {
        exp.calcPercentages(data.totals.inc);
      });

    },

    getPercentages: function() {

      return data.allItems.exp.map(exp => {
        return exp.getPercentages();
      });

    },

    getBudget: function() {
      return {
        budget: data.totals.inc - data.totals.exp,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percetange
      }
    },

    deleteItem: function(type, iden) {
      var arr = data.allItems[type]
      arr.forEach((obj, i) => {
        if (obj.id == iden) {
          arr.splice(i, 1);
        }
      });
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
    container: ".container",
    itemPercentage: ".item__percentage",
    date: ".budget__title--month"
  }

  var formatNumber = function(num, type) {
    // + or - before de number
    // , if the number is 1,000 or more
    // just two decimals
      // 134.47693 --> 134.48
      // 287 --> 287.00

    //num = Math.abs(num) //Get the absolut number always positive
    //I don't think this is necesarry

    num = (num).toFixed(2); //This way we always have 2 decimals

    var arr = num.split('.');
    var integers = arr[0];
    var decimals = arr[1];
    if (integers.length > 3) {
       let three = integers.substring(integers.length-3);
       let miles = integers.substring(0, integers.length-3);
       num = miles + ',' + three + '.' + decimals;
    }

    return type === 'exp' ? '- ' + num : '+ ' + num;

  };

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
        html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === 'exp') {
        element = domStrings.expensesCotainer;
        html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
      //Replace the placeholder text with actual data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

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
      var type;
      obj.budget > 0 ? type = "inc" : type = "exp";
      document.querySelector(domStrings.budget).textContent = formatNumber(obj.budget, type);
      document.querySelector(domStrings.income).textContent = formatNumber(obj.totalInc, "inc");
      document.querySelector(domStrings.expenses).textContent = formatNumber(obj.totalExp, "exp");

      if (obj.percentage > 0) {
        document.querySelector(domStrings.percentage).textContent = obj.percentage + '%';
      } else {
        document.querySelector(domStrings.percentage).textContent = '---'
      }
    },

    displayPercentages: function(percentages) {

      var expenses = document.querySelectorAll(domStrings.itemPercentage);
      var expArr = Array.prototype.slice.apply(expenses);
      expArr.forEach((exp, i) => {
        if(percentages[i] > 0) {
          exp.textContent = percentages[i] + '%';
        } else {
          exp.textContent = '---';
        }
      });

      //Anothet way is to create your own forEach function
      //Very good for practice!
        /*
        var forEach = function(nodeList, callback) {
          for (let i = 0; i < nodeList.length; i++) {
            callback(nodeList[i], i);
          }
        }

        var callback = function(currentNode, index) {
          if(percentages[index] > 0) {
            currentNode.textContent = percentages[index] + '%';
          } else {
            currentNode.textContent = '---';
          }

        }

        forEach(expenses, callback);
        */
    },

    displayDate: function() {
      var date, year, month, months;

      date = new Date();
      year = date.getFullYear();
      month = date.getMonth();
      months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
                'October', 'November', 'December'];

      document.querySelector(domStrings.date).textContent = months[month] + ' ' + year;
    },

    changeType: function() {
      //inputBtn: '.add__btn',
      var inputs = document.querySelectorAll(
        domStrings.inputType + ',' + domStrings.inputDescription + ',' + domStrings.inputValue);

      var inputsArr = Array.prototype.slice.apply(inputs);

      inputsArr.forEach(input => {
        input.classList.toggle('red-focus'); //toggle por que le quitas la que esta y pones la RED
      });

      document.querySelector(domStrings.inputBtn).classList.toggle('red');

    },

    //clearItem: function
    delItem: function(el) {
      el.remove();
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

     document.querySelector(DOM.inputType).addEventListener('change', uiCtrl.changeType);

   };

   var calculateBudget = function() {
     //1.- Calculate the budget
     budgetCtrl.calculateBudget();
     //2.- Return the budget
     var budget = budgetCtrl.getBudget();
     //3.- Display the budget on the UI
     uiCtrl.displayBudget(budget);
     console.log(budget);
   }

   var updatePercentages = function() {
     //1.- Calclate percentages
     budgetCtrl.calculatePercentages();
     //2.- Read the percentages from the budgetController
     var percentages = budgetCtrl.getPercentages();
     //3.- Update the percentages in the UI
     console.log(percentages);
     uiCtrl.displayPercentages(percentages);
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

       // 6. Calculate and update percentages
       updatePercentages();

     }
   };

   var ctrlDelItem = function(event) {
     var item = event.target.parentNode.parentNode.parentNode.parentNode;
     var arr, type, id;
     if(item) {
       arr = item.id.split('-');
       type = arr[0];
       id = arr[1];
     }

     //1. Delete item from the data structure
     budgetCtrl.deleteItem(type, id);
     //2. Delete item from the UI
     uiCtrl.delItem(item);
     //3. Update and show the Budget
     calculateBudget();
     //4. Calculate and update percentages
     updatePercentages();
   };


   //return a PUBLIC initialization function to run the program
   return {
     init: function() {
       console.log('The App started!')
       uiCtrl.displayDate();
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
