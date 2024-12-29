document.body.innerHTML = `
  <div data-previous-operand class="previous-operand"></div>
  <div data-current-operand class="current-operand"></div>
  <button data-number>1</button>
  <button data-number>2</button>
  <button data-number>3</button>
  <button data-operation>+</button>
  <button data-equals>=</button>
  <button data-all-clear>AC</button>
  <button data-delete>DEL</button>
`;

const { afterEach } = require('node:test');
// Import the Calculator class for testing
const Calculator = require('./script');

// Mock các thành phần DOM
const mockPreviousOperandElement = {
    innerText: '',
};
const mockCurrentOperandElement = {
    innerText: '',
};

// Tạo instance của Calculator
let calculator;
beforeEach(() => {
    calculator = new Calculator(mockPreviousOperandElement, mockCurrentOperandElement);
});


// Kiểm thử đơn vị - Unit Testing
describe('Calculator - Unit Testing', () => {
    test('clear() should reset all values', () => {
        calculator.appendNumber('5');
        calculator.chooseOperation('+');
        calculator.appendNumber('3');
        calculator.clear();

        expect(calculator.currentOperand).toBe('');
        expect(calculator.previousOperand).toBe('');
        expect(calculator.operation).toBeUndefined();
    });

    test('appendNumber() should add numbers correctly', () => {
        calculator.appendNumber('5');
        calculator.appendNumber('3');

        expect(calculator.currentOperand).toBe('53');
    });

    test('compute() should handle addition', () => {
        calculator.appendNumber('5');
        calculator.chooseOperation('+');
        calculator.appendNumber('3');
        calculator.compute();

        expect(calculator.currentOperand).toBe(8);
    });
});

// Kiểm thử tích hợp - Integration Testing
describe('Calculator - Integration Testing', () => {
    test('should update display correctly after operations', () => {
        calculator.appendNumber('5');
        calculator.chooseOperation('+');
        calculator.appendNumber('3');
        calculator.compute();
        calculator.updateDisplay();

        expect(mockCurrentOperandElement.innerText).toBe('8');
        expect(mockPreviousOperandElement.innerText).toBe('');
    });
});

// Kiểm thử Snapshot - Ghi lại trạng thái của calculator sau khi thực hiện phép tính. 
describe('Calculator - Snapshot Testing', () => {
    test('should match snapshot after calculation', () => {
        calculator.appendNumber('10');
        calculator.chooseOperation('*');
        calculator.appendNumber('2');
        calculator.compute();
        calculator.updateDisplay();

        expect({
            currentOperand: calculator.currentOperand,
            previousOperand: calculator.previousOperand,
            operation: calculator.operation,
        }).toMatchSnapshot();
    });
});

// Mocking và Spy: Theo dõi cách hàm getDisplayNumber được gọi trong updateDisplay
describe('Calculator - Mocking and Spying', () => {
    test('updateDisplay() should call getDisplayNumber()', () => {
        const spyGetDisplayNumber = jest.spyOn(calculator, 'getDisplayNumber');

        calculator.appendNumber('5');
        calculator.updateDisplay();

        expect(spyGetDisplayNumber).toHaveBeenCalledWith('5');
        spyGetDisplayNumber.mockRestore();
    });
});

// Kiểm thử bất đồng bộ: Mô phỏng xử lý phép tính phức tạp như chia cho 0
describe('Calculator - Asynchronous Testing', () => {
    test('compute() handles division by zero asynchronously', async () => {
        calculator.appendNumber('5');
        calculator.chooseOperation('÷');
        calculator.appendNumber('0');

        await new Promise(resolve => {
            setTimeout(() => {
                calculator.compute();
                resolve();
            }, 100);
        });

        expect(calculator.currentOperand).toBe(Infinity);
    });
});
