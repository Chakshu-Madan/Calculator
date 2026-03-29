const display = document.getElementById("display")

let currentInput = "";

// Add Value
function appendValue(value) {
    if (display.value === "Error") {
        currentInput = "";
    }
    
    const lastChar = currentInput.slice(-1);

    // Prevent double operators
    if ("+-*/".includes(lastChar) && "+-*/".includes(value)) {
        return;
    }

    if (value === "π") {
        if (/\d$/.test(currentInput)) {
            currentInput += "*" + Math.PI;
        } else {
            currentInput += Math.PI;
        }
    } else {
        currentInput += value;
    }
    
    display.value = currentInput;
}

// Clear All
function clearDisplay() {
    currentInput = "";
    display.value = "";
}

// Delete last character
function deleteLast() {
    currentInput = currentInput.slice(0, -1);
    display.value = currentInput;
}

// Calculate Result
function calculate() {
    try {
        let expression = currentInput;

        // Replace UI symbols if needed
        expression = expression
            .replace(/x/g, "*")
            .replace(/÷/g, "/")
            .replace(/π/g, Math.PI);

        // Power operator
        expression = expression.replace(/\^/g, "**");

        // Factorial support
        expression = expression.replace(/(\d+)!/g, (match, num) => {
            return factorial(parseInt(num));
        });

        // Remove unsupported symbols before evaluation
        if (/[a-zA-Z√]/.test(expression)) {
            display.value = "Error";
            currentInput = "";
            return;
        }

        const result = Function("return " + expression)();

        addToHistory(currentInput, result);

        display.value = result;
        currentInput = result.toString();

    } catch {
        display.value = "Error"
        currentInput = "";
    }
}

document.addEventListener("keydown", (e) => {
    const key = e.key;

    if (!isNaN(key) || "+-*/".includes(key)) {
        appendValue(key);
    } else if (key === "Enter") {
        calculate();
    } else if (key === "Backspace") {
        deleteLast();
    } else if (key === "Escape") {
        clearDisplay();
    }
});

const themeBtn = document.getElementById("themeToggle");

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");

    themeBtn.textContent = document.body.classList.contains("light-mode") ? "☀️" : "🌙";
});

function calculateFunc(func) {
    try {
        let value = parseFloat(display.value);

        if (isNaN(value)) {
            display.value = "Error"; 
            return;
        }

        let result;

        switch (func) {
            case "sin":
                result = Math.sin(value);
                break;
            case "cos":
                result = Math.cos(value);
                break;
            case "log":
                result = Math.log10(value);
                break;
            case "sqrt":
                result = Math.sqrt(value);
                break;
        }

        display.value = result;
        currentInput = result.toString();
    } catch {
        display.value = "Error";
    }
}

// Factorial function
function factorial(n) {
    if (n < 0 ) return "Error";
    if (n === 0 || n === 1) return 1;
    
    let res = 1;
    for (let i = 2; i <= n; i++) {
        res *= i;
    }
    return res;
}

function appendFactorial() {
    currentInput += "!";
    display.value = currentInput;
}

// History Panel
const historyList = document.getElementById("historyList");

function addToHistory(expression, result) {
    const li = document.createElement("li");

    const text = document.createElement("span");         
    li.textContent = `${expression} = ${result}`;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";

    deleteBtn.onclick = () => li.remove();

    li.appendChild(text);
    li.appendChild(deleteBtn);

    li.addEventListener("click", () => {
        currentInput = result.toString();
        display.value = currentInput;
    });

    historyList.prepend(li);
}

function clearHistory() {
    historyList.innerHTML = "";
}