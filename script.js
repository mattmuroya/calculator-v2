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
    let result = operate(this.valueA, this.valueB, this.operator);
    if (result === Infinity || result === -Infinity || result !== result) {
      // (result !== result) checks for NaN since NaN is unequal to itself
      return '¯\\_(ツ)_/¯';
    } else if (result > 999999999999) {
      return "OVERFLOW";
    } else if (result.toString().includes('.') && result.toString().length > 12) {
      if (result.toString().charAt(12) === '.') {
        return result.toString().slice(0, 12);
      } else {
        return result.toString().slice(0, 13);
      }
    } else {
      return result;
    }
  }
};

const display = document.querySelector('.calculator-display');

// numpad buttons

const numeralBtns = document.querySelectorAll('button.numeral');

numeralBtns.forEach(button => {
  button.addEventListener('click', () => {
    if (calculation.awaitingValueB) {
      display.textContent = 0;
      calculation.awaitingValueB = false;
    }
    if (calculation.finalized) {
      calculation.lastOperand = null;
      display.textContent = 0;
      calculation.finalized = false;
    }
    appendInput(button);
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

    if (display.textContent === 'OVERFLOW' || display.textContent === '¯\\_(ツ)_/¯') {
      resetAllValues();
      return;
    }

    deselectOperators();

    if (button.value !== 'equals') button.classList.add('selected');

    if (calculation.awaitingValueB && button.value === 'equals') {
      calculation.operator = null;
      return;
    }
    
    // repeat last calculation on subsequent presses of equals button
    if (button.value === 'equals' && calculation.finalized) {
      calculation.valueA = parseFloat(display.textContent);
      calculation.valueB = calculation.lastOperand;
      display.textContent = calculation.evaluate();

      // either store valueA or evaluate if (valueA)
    } else if (!calculation.awaitingValueB) {
      if (calculation.valueA === null) {
        calculation.valueA = parseFloat(display.textContent);
      } else {
        calculation.valueB = parseFloat(display.textContent);
        calculation.valueA = calculation.evaluate();
        display.textContent = calculation.valueA;
        calculation.lastOperand = calculation.valueB;
      }
    }

    // on operator, prep for next input; on equals, finalize
    if (button.value !== 'equals') {
      calculation.operator = button.value;
      calculation.awaitingValueB = true;
    } else if (button.value === 'equals') {
      calculation.valueA = null;
      calculation.valueB = null;
      calculation.finalized = true;
    }
  });
});

function deselectOperators() {
  operatorBtns.forEach(button => button.classList.remove('selected'));
}

// sign button

const signBtn = document.querySelector('button.sign');

signBtn.addEventListener('click', () => {
  resetIfError();
  if (calculation.awaitingValueB) return;
  display.textContent = display.textContent * -1;
});

// clear button

const allClearBtn = document.querySelector('button.all-clear');

allClearBtn.addEventListener('click', resetAllValues);

function resetAllValues() {
  deselectOperators();
  display.textContent = 0;
  calculation.valueA = null;
  calculation.valueB = null;
  calculation.operator = null;
  calculation.lastOperand == null;
  calculation.awaitingValueB = false;
  calculation.finalized = false;
};

function resetIfError() {
  if (display.textContent === 'OVERFLOW' || display.textContent === '¯\\_(ツ)_/¯')
    resetAllValues();
}

// delete button

const deleteBtn = document.querySelector('button.delete');

deleteBtn.addEventListener('click', () => {
  resetIfError();
  let lengthWithoutNeg = display.textContent.replace(/[-.]/g, '').length;
  if (calculation.awaitingValueB) {
    return;
  } else if (lengthWithoutNeg === 1) {
    display.textContent = 0;
  } else {
    display.textContent = display.textContent.slice(0, display.textContent.length - 1);
  }
});

// just for fun

// https://www.w3schools.com/howto/howto_js_draggable.asp

// Make the DIV element draggable:
dragElement(document.getElementById('calculator'));

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById('calculator-top')) {
    // if present, the header is where you move the DIV from:
    document.getElementById('calculator-top').onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}