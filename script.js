// basic functions

function operate(a, b, operator) {
  switch (operator) {
    case 'add':
      return a + b;
      break;
    case 'subtract':
      return a - b;
      break;
    case 'multiply':
      return a * b;
      break;
    case 'divide':
      return a / b;
      break;
    default:
      return 'ERROR';
  }
}

// initialize the calculation object

const calculation = {
  lastResult: null,
  valueA: null,
  valueB: null,
  operator: null,
  awaitingValueB: false,
  finalized: false,
  evaluate: function () {
    return operate(this.valueA, this.valueB, this.operator);
  }
};

// display

const display = document.querySelector('.calculator-display');

// numpad buttons

const numeralBtns = document.querySelectorAll('button.numeral');

numeralBtns.forEach(button => {
  button.addEventListener('click', () => {
    if (calculation.awaitingValueB) { // if operator button has just been set
      display.textContent = 0; // reset the display before appending input
      calculation.awaitingValueB = false; // no longer awaiting B
    }
    if (calculation.finalized) { // if the equals button just been pressed
      calculation.valueA = null; // reset all values on next numeral input
      calculation.valueB = null;
      calculation.lastResult = null;
      display.textContent = 0;
      calculation.finalized = false;
    }
    appendInput(button);
    console.table(calculation);
  });
});

function appendInput(button) {
  if (button.value === '.' && display.textContent.includes('.')) return;
  if (display.textContent.replace(/[-.]/g, '').length >= 12) return;
  if (display.textContent === '0' && button.value !== '.') {
    display.textContent = button.value;
  } else {
    display.textContent += button.value;
  }
}

// operator buttons

const operatorBtns = document.querySelectorAll('button.operator');
operatorBtns.forEach(button => {
  button.addEventListener('click', () => {
    
  });
});

function deselectOperators() {
  operatorBtns.forEach(button => button.classList.remove('selected'));
}

// sign button

const signBtn = document.querySelector('button.sign');
signBtn.addEventListener('click', () => {
  display.textContent = display.textContent * -1;
});

// clear button

const allClearBtn = document.querySelector('button.all-clear');

allClearBtn.addEventListener('click', () => {
  deselectOperators();
  display.textContent = 0;
  calculation.lastResult = null;
  calculation.valueA = null;
  calculation.valueB = null;
  calculation.operator = null;
  calculation.awaitingValueB = false;
  calculation.finalized = false;
  console.table(calculation);
});

// delete button

const deleteBtn =  document.querySelector('button.delete');

// equals button - functions like the other operators but 'finalizes' the result.

const equalsBtn = document.querySelector('button.equals');

equalsBtn.addEventListener('click', () => {
  
});