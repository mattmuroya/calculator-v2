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
      return calculation.valueA;
  }
}

// initialize the calculation object

const calculation = {
  valueA: null,
  valueB: null,
  operator: null,
  lastOperand: null,
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
      calculation.lastOperand = null; // clear the lastOperand value after entering new digits
      display.textContent = 0; // reset display on next numeral input
      calculation.finalized = false;
    }
    appendInput(button);
  });
});

function appendInput(button) { // helper function to append new inputs to the display up until 12 digits
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
    deselectOperators(); // clear styles from any currently selected operator button
    if (button.value !== 'equals') button.classList.add('selected'); // add the .selected style to the operator (except for the equals button)

    if (button.value === 'equals' && calculation.finalized) { // if you're repeating the equals button without entering any digits in between to reset finalization
      console.table(calculation);
      calculation.valueA = parseFloat(display.textContent);
      calculation.valueB = calculation.lastOperand;
      display.textContent = roundOff(calculation.evaluate(), 8);
    } else 

    if (!calculation.awaitingValueB) { // if you haven't selected an operator yet OR you have selected one, but already entered a valueB, so calc is no longer waiting for it
      if (calculation.valueA === null) { // check if valueA is currently empty
        calculation.valueA = parseFloat(display.textContent); // if so then put the current display value in A
      } else {
        calculation.valueB = parseFloat(display.textContent); // if there is something in A already, then put current display value in B
        calculation.valueA = roundOff(calculation.evaluate(), 8); // take A and B, evaluate with the selected operator, and put the result in A
        display.textContent = calculation.valueA; // display the result in A

        // Experimental
        calculation.lastOperand = calculation.valueB;

      }
    }

    if (button.value !== 'equals') { // for any operand other than equals
      calculation.operator = button.value; // set the new operator
      calculation.awaitingValueB = true; // and signal that the calc is awaiting input for another operand
    } else if (button.value === 'equals') { // if the button pressed was equals button
      calculation.valueA = null; // then reset all the operand values
      calculation.valueB = null; // but leave the last operator
      calculation.finalized = true; // and indicate that this is a finalized answer so that the display will clear on additional numeral input
    }
  });
});

function deselectOperators() { // helper function to remove .selected style from operators after executing the calculation
  operatorBtns.forEach(button => button.classList.remove('selected'));
}

// sign button

const signBtn = document.querySelector('button.sign');

signBtn.addEventListener('click', () => { // simple sign reverse on current display value;
  display.textContent = display.textContent * -1;
});

// clear button

const allClearBtn = document.querySelector('button.all-clear');

allClearBtn.addEventListener('click', () => { // reset all values 
  deselectOperators();
  display.textContent = 0;
  calculation.valueA = null;
  calculation.valueB = null;
  calculation.operator = null;
  calculation.lastOperand == null;
  calculation.awaitingValueB = false;
  calculation.finalized = false;
});

// delete button

const deleteBtn = document.querySelector('button.delete');

deleteBtn.addEventListener('click', () => {
  if (calculation.awaitingValueB) { // delete last digit entered from display
    return; // prevent deletion if an operator has already been selected
  } else if (display.textContent.length === 1) {
    display.textContent = 0;
  } else {
    display.textContent = display.textContent.slice(0, display.textContent.length - 1);
  }
});

// helper function to truncate long floats
function roundOff(num, places) {
  const x = Math.pow(10,places);
  return Math.round(num * x) / x;
}