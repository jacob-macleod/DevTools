// script.js
const pythonCode = `def greet(name):\n    print(f"Hello, {name}!")`;
const snippetElement = document.getElementById('code-snippet');
const inputArea = document.getElementById('input-area');
const feedback = document.getElementById('feedback');
const results = document.getElementById('results');
const wpmElement = document.getElementById('wpm');
const accuracyElement = document.getElementById('accuracy');
const restartButton = document.getElementById('restart');

let startTime, endTime;

// Initialize the snippet
snippetElement.textContent = pythonCode;

inputArea.addEventListener('input', (e) => {
  const userInput = e.target.value;
  
  if (userInput.length === 1 && !startTime) {
    startTime = new Date(); // Start timer
  }

  const code = pythonCode.slice(0, userInput.length);
  const correct = userInput === code;

  if (userInput === pythonCode) {
    endTime = new Date();
    calculateResults();
  }

  // Highlight correct or incorrect
  feedback.textContent = correct ? 'Correct so far...' : 'Error detected!';
  feedback.style.color = correct ? 'green' : 'red';
});

function calculateResults() {
  const timeTaken = (endTime - startTime) / 1000 / 60; // time in minutes
  const words = pythonCode.split(' ').length;
  const wpm = Math.round(words / timeTaken);

  const correctChars = inputArea.value
    .split('')
    .filter((char, i) => char === pythonCode[i]).length;
  const accuracy = Math.round((correctChars / pythonCode.length) * 100);

  wpmElement.textContent = wpm;
  accuracyElement.textContent = accuracy;
  results.classList.remove('hidden');
  inputArea.setAttribute('disabled', true);
}

restartButton.addEventListener('click', () => {
  inputArea.value = '';
  inputArea.removeAttribute('disabled');
  feedback.textContent = '';
  results.classList.add('hidden');
  startTime = endTime = null;
});
