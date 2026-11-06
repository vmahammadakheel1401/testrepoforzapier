const display = document.getElementById('display');

let currentInput = '0';
let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;

function updateDisplay() {
  display.textContent = currentInput;
}

function resetCalculator() {
  currentInput = '0';
  firstOperand = null;
  operator = null;
  waitingForSecondOperand = false;
  updateDisplay();
}

function inputDigit(digit) {
  if (waitingForSecondOperand) {
    currentInput = digit;
    waitingForSecondOperand = false;
  } else {
    currentInput = currentInput === '0' ? digit : currentInput + digit;
  }

  updateDisplay();
}

function inputDecimal() {
  if (waitingForSecondOperand) {
    currentInput = '0.';
    waitingForSecondOperand = false;
    updateDisplay();
    return;
  }

  if (!currentInput.includes('.')) {
    currentInput += '.';
    updateDisplay();
  }
}

function performCalculation(firstValue, secondValue, selectedOperator) {
  switch (selectedOperator) {
    case '+':
      return firstValue + secondValue;
    case '-':
      return firstValue - secondValue;
    case '*':
      return firstValue * secondValue;
    case '/':
      return secondValue === 0 ? 'Error' : firstValue / secondValue;
    default:
      return secondValue;
  }
}

function handleOperator(nextOperator) {
  const inputValue = Number(currentInput);

  if (operator && waitingForSecondOperand) {
    operator = nextOperator;
    return;
  }

  if (firstOperand === null) {
    firstOperand = inputValue;
  } else if (operator) {
    const result = performCalculation(firstOperand, inputValue, operator);
    currentInput = String(result);
    firstOperand = Number(currentInput);
  }

  waitingForSecondOperand = true;
  operator = nextOperator;
  updateDisplay();
}

function handleEquals() {
  if (operator === null || waitingForSecondOperand) {
    return;
  }

  const inputValue = Number(currentInput);
  const result = performCalculation(firstOperand, inputValue, operator);

  currentInput = String(result);
  firstOperand = null;
  operator = null;
  waitingForSecondOperand = false;
  updateDisplay();
}

function deleteLastDigit() {
  if (waitingForSecondOperand) {
    return;
  }

  if (currentInput.length <= 1 || (currentInput.length === 2 && currentInput.startsWith('-'))) {
    currentInput = '0';
  } else {
    currentInput = currentInput.slice(0, -1);
  }

  updateDisplay();
}

function handlePercent() {
  const value = Number(currentInput) / 100;
  currentInput = String(value);
  updateDisplay();
}

function handleButtonAction(action, value) {
  switch (action) {
    case 'number':
      inputDigit(value);
      break;
    case 'decimal':
      inputDecimal();
      break;
    case 'operator':
      handleOperator(value);
      break;
    case 'equals':
      handleEquals();
      break;
    case 'clear':
      resetCalculator();
      break;
    case 'delete':
      deleteLastDigit();
      break;
    case 'percent':
      handlePercent();
      break;
    default:
      break;
  }
}

document.querySelectorAll('[data-action]').forEach((button) => {
  button.addEventListener('click', () => {
    const action = button.dataset.action;
    const value = button.dataset.value;
    handleButtonAction(action, value);
  });
});

document.addEventListener('keydown', (event) => {
  const { key } = event;

  if (/^[0-9]$/.test(key)) {
    inputDigit(key);
  } else if (key === '.') {
    inputDecimal();
  } else if (['+', '-', '*', '/'].includes(key)) {
    handleOperator(key);
  } else if (key === 'Enter' || key === '=') {
    handleEquals();
  } else if (key === 'Escape' || key.toLowerCase() === 'c') {
    resetCalculator();
  } else if (key === 'Backspace') {
    deleteLastDigit();
  } else if (key === '%') {
    handlePercent();
  }
});

updateDisplay();
