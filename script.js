const quizData = [
  {
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correct: 2,
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correct: 1,
  },
  {
    question: "What is the largest mammal in the world?",
    options: ["African Elephant", "Blue Whale", "Giraffe", "Polar Bear"],
    correct: 1,
  },
  {
    question: "In which year did World War II end?",
    options: ["1944", "1945", "1946", "1947"],
    correct: 1,
  },
  {
    question: "What is the chemical symbol for gold?",
    options: ["Go", "Gd", "Au", "Ag"],
    correct: 2,
  },
  {
    question:
      "Which programming language is known as the 'language of the web'?",
    options: ["Python", "Java", "JavaScript", "C++"],
    correct: 2,
  },
  {
    question: "What is the smallest country in the world?",
    options: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"],
    correct: 1,
  },
  {
    question: "Which organ in the human body produces insulin?",
    options: ["Liver", "Kidney", "Pancreas", "Heart"],
    correct: 2,
  },
  {
    question: "What is the speed of light in vacuum?",
    options: [
      "299,792,458 m/s",
      "300,000,000 m/s",
      "299,000,000 m/s",
      "301,000,000 m/s",
    ],
    correct: 0,
  },
  {
    question: "Which artist painted 'The Starry Night'?",
    options: [
      "Pablo Picasso",
      "Vincent van Gogh",
      "Leonardo da Vinci",
      "Claude Monet",
    ],
    correct: 1,
  },
];


let currentQuestionIndex = 0;
let score = 0;
let selectedAnswer = null;
let timer = null;
let timeLeft = 30;
let startTime = null;
let questionStartTime = null;
let totalGameTime = 0;
let answeredQuestions = [];


function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
}


function initTheme() {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
}


function showStartScreen() {
  document.getElementById("startScreen").style.display = "block";
  document.getElementById("quizScreen").style.display = "none";
  document.getElementById("resultsScreen").style.display = "none";
  resetQuiz();
}

function showQuizScreen() {
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("quizScreen").style.display = "block";
  document.getElementById("resultsScreen").style.display = "none";
}

function showResultsScreen() {
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("quizScreen").style.display = "none";
  document.getElementById("resultsScreen").style.display = "block";
}

function startQuiz() {
  showQuizScreen();
  startTime = Date.now();
  currentQuestionIndex = 0;
  score = 0;
  answeredQuestions = [];
  loadQuestion();
}

function loadQuestion() {
  if (currentQuestionIndex >= quizData.length) {
    endQuiz();
    return;
  }

  questionStartTime = Date.now();
  const question = quizData[currentQuestionIndex];
  selectedAnswer = null;

  
  document.getElementById("currentQuestion").textContent =
    currentQuestionIndex + 1;
  document.getElementById("totalQuestions").textContent = quizData.length;

  const progress = (currentQuestionIndex / quizData.length) * 100;
  document.getElementById("progressFill").style.width = progress + "%";

  // Load question and options
  document.getElementById("questionText").textContent = question.question;

  const optionsContainer = document.getElementById("optionsContainer");
  optionsContainer.innerHTML = "";

  question.options.forEach((option, index) => {
    const optionElement = document.createElement("div");
    optionElement.className = "option";
    optionElement.textContent = option;
    optionElement.onclick = () => selectAnswer(index);
    optionsContainer.appendChild(optionElement);
  });

  
  timeLeft = 30;
  startTimer();

  
  document.getElementById("nextBtn").disabled = true;
  document.getElementById("nextBtn").textContent = "Next Question →";
}

function selectAnswer(index) {
  if (selectedAnswer !== null) return; 

  selectedAnswer = index;
  const options = document.querySelectorAll(".option");
  const question = quizData[currentQuestionIndex];

  
  clearInterval(timer);

  
  const timeTaken = (Date.now() - questionStartTime) / 1000;

  
  options.forEach((option, i) => {
    if (i === question.correct) {
      option.classList.add("correct");
    } else if (i === selectedAnswer && i !== question.correct) {
      option.classList.add("incorrect");
    }
    option.style.pointerEvents = "none";
  });

  
  const isCorrect = selectedAnswer === question.correct;
  if (isCorrect) {
    score++;
  }

  answeredQuestions.push({
    questionIndex: currentQuestionIndex,
    selectedAnswer: selectedAnswer,
    correctAnswer: question.correct,
    isCorrect: isCorrect,
    timeTaken: timeTaken,
  });

  
  document.getElementById("nextBtn").disabled = false;
  document.getElementById("nextBtn").textContent =
    currentQuestionIndex === quizData.length - 1
      ? "View Results 🎉"
      : "Next Question →";
}

function nextQuestion() {
  if (selectedAnswer === null) return;

  currentQuestionIndex++;

  
  setTimeout(() => {
    loadQuestion();
  }, 500);
}

function startTimer() {
  const timerElement = document.getElementById("timer");

  timer = setInterval(() => {
    timeLeft--;
    timerElement.textContent = `⏰ ${timeLeft}s`;

    if (timeLeft <= 10) {
      timerElement.classList.add("urgent");
    } else {
      timerElement.classList.remove("urgent");
    }

    if (timeLeft <= 0) {
      clearInterval(timer);
      
      if (selectedAnswer === null) {
        const randomAnswer = Math.floor(
          Math.random() * quizData[currentQuestionIndex].options.length
        );
        selectAnswer(randomAnswer);
      }
    }
  }, 1000);
}

function endQuiz() {
  totalGameTime = (Date.now() - startTime) / 1000;
  showResultsScreen();
  displayResults();
}

function displayResults() {
  const percentage = Math.round((score / quizData.length) * 100);
  const correctCount = score;
  const incorrectCount = quizData.length - score;
  const avgTimePerQuestion = totalGameTime / quizData.length;

  
  document.getElementById("finalScore").textContent = percentage + "%";
  document.getElementById("correctAnswers").textContent = correctCount;
  document.getElementById("incorrectAnswers").textContent = incorrectCount;
  document.getElementById("totalTime").textContent =
    Math.round(totalGameTime) + "s";
  document.getElementById("avgTime").textContent =
    Math.round(avgTimePerQuestion) + "s";

  
  let message = "";
  if (percentage >= 90) {
    message = "🎉 Outstanding! You're a quiz master!";
  } else if (percentage >= 80) {
    message = "🌟 Excellent work! Great knowledge!";
  } else if (percentage >= 70) {
    message = "👍 Good job! Keep it up!";
  } else if (percentage >= 60) {
    message = "📚 Not bad! Room for improvement!";
  } else {
    message = "💪 Keep practicing! You'll get better!";
  }

  document.getElementById("scoreMessage").textContent = message;
}

function restartQuiz() {
  resetQuiz();
  startQuiz();
}

function resetQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  selectedAnswer = null;
  timeLeft = 30;
  totalGameTime = 0;
  answeredQuestions = [];

  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}


document.addEventListener("DOMContentLoaded", function () {
  initTheme();
  showStartScreen();
});


window.addEventListener("beforeunload", function (e) {
  if (document.getElementById("quizScreen").style.display !== "none") {
    e.preventDefault();
    e.returnValue = "";
  }
});
