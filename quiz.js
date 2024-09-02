const startScreen = document.getElementById("start-screen");
const startButton = document.getElementById("start-btn");
const questionContainer = document.getElementById("question-container");
const questionElement = document.getElementById("question");
const answerButtonsElement = document.getElementById("answer-buttons");
const scoreContainer = document.getElementById("score-container");
const finalScoreElement = document.getElementById("final-score");
const kudosElement = document.getElementById("kudos");
const restartButton = document.getElementById("restart-btn");
const timerElement = document.getElementById("timer");
const progressBar = document.querySelector(".progress");
const questionNumberElement = document.getElementById("question-number");
const feedbackContainer = document.getElementById("feedback-container");
const feedbackList = document.getElementById("feedback-list");
const confettiElement = document.getElementById("confetti");
const streakElement = document.getElementById("streak");
const fastAnswerElement = document.getElementById("fast-answer");
const feedbackPopup = document.getElementById("feedback-popup");
const feedbackOkButton = document.getElementById("feedback-ok-btn");
let shuffledQuestions, currentQuestionIndex, score, timer, totalQuestions, streakCount, fastAnswerBonus;

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", startGame);

function startGame() {
    startScreen.classList.add("hide");
    shuffledQuestions = questions.sort(() => Math.random() - 0.5).slice(0, 10);
    totalQuestions = shuffledQuestions.length;
    currentQuestionIndex = 0;
    score = 0;
    streakCount = 0;
    fastAnswerBonus = 0;
    questionContainer.classList.remove("hide");
    scoreContainer.classList.add("hide");
    feedbackContainer.classList.add("hide");
    setNextQuestion();
}

function setNextQuestion() {
    resetState();
    showQuestion(shuffledQuestions[currentQuestionIndex]);
    updateProgressBar();
    startTimer();
}

function showQuestion(question) {
    questionElement.innerText = question.question;
    questionNumberElement.innerText = `${currentQuestionIndex + 1}/${totalQuestions}`;
    question.answers.sort(() => Math.random() - 0.5); // Shuffle answers
    question.answers.forEach((answer) => {
        const button = document.createElement("button");
        button.innerText = answer.text;
        button.classList.add("btn");
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener("click", selectAnswer);
        answerButtonsElement.appendChild(button);
    });
}

function resetState() {
    clearInterval(timer);
    timerElement.textContent = '';
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct === "true";
    if (correct) {
        score++;
        streakCount++;
        selectedButton.classList.add("correct");
        if (parseInt(timerElement.textContent) > 15) {
            fastAnswerBonus++;
            fastAnswerElement.textContent = `Fast Answer Bonus: ${fastAnswerBonus}`;
            fastAnswerElement.classList.add("show");
            setTimeout(() => fastAnswerElement.classList.remove("show"), 1500);
        }
    } else {
        streakCount = 0;
        selectedButton.classList.add("wrong");
    }
    streakElement.textContent = `Streak: ${streakCount}`;
    Array.from(answerButtonsElement.children).forEach((button) => {
        if (button.dataset.correct === "true") {
            button.classList.add("correct");
        }
        button.disabled = true;
    });
    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < shuffledQuestions.length) {
            setNextQuestion();
        } else {
            endGame();
        }
    }, 1500);
}

function startTimer() {
    let timeLeft = 20;
    timerElement.textContent = timeLeft;
    timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            selectAnswer({ target: document.createElement("button") });
        }
    }, 1000);
}

function updateProgressBar() {
    const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
    progressBar.style.width = `${progress}%`;
}

function endGame() {
    questionContainer.classList.add("hide");
    scoreContainer.classList.remove("hide");
    finalScoreElement.textContent = `${score}/${totalQuestions}`;
    showFeedback();
    const percentage = (score / totalQuestions) * 100;
    if (percentage >= 80) {
        kudosElement.textContent = "Outstanding! You're a Matrix Chain Multiplication expert!";
    } else if (percentage >= 60) {
        kudosElement.textContent = "Great job! You have a solid understanding of Matrix Chain Multiplication.";
    } else {
        kudosElement.textContent = "Keep practicing! You're on your way to mastering Matrix Chain Multiplication.";
    }
    showConfetti();
}
function showFeedbackPopup() {
    feedbackPopup.classList.remove("hide");
}

function showFeedback() {
    feedbackContainer.classList.remove("hide");
    feedbackList.innerHTML = '';
    shuffledQuestions.forEach((question, index) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `<strong>Q${index + 1}:</strong> ${question.question} <br>
                              <strong>Your Answer:</strong> ${getSelectedAnswerText(index)} <br>
                              <strong>Correct Answer:</strong> ${getCorrectAnswerText(question)}`;
        feedbackList.appendChild(listItem);
    });
}

function getSelectedAnswerText(questionIndex) {
    const selectedButton = answerButtonsElement.children[questionIndex];
    return selectedButton ? selectedButton.innerText : "No answer selected";
}

function getCorrectAnswerText(question) {
    const correctAnswer = question.answers.find(answer => answer.correct);
    return correctAnswer ? correctAnswer.text : "No correct answer found";
}

function showConfetti() {
    confettiElement.classList.add("show");
    setTimeout(() => {
        confettiElement.classList.remove("show");
    }, 5000);
}

const questions = [
    {
        question: 'What is the main goal of Matrix Chain Multiplication?',
        answers: [
            { text: "To find the optimal order of matrix multiplications", correct: true },
            { text: "To determine the fastest algorithm for matrix inversion", correct: false },
            { text: "To compute the determinant of a matrix", correct: false },
            { text: "To solve linear equations using matrices", correct: false },
        ],
    },
    {
        question: 'Which dynamic programming approach is used in Matrix Chain Multiplication?',
        answers: [
            { text: "Top-down approach with memoization", correct: true },
            { text: "Bottom-up approach with tabulation", correct: true },
            { text: "Greedy approach", correct: false },
            { text: "Divide and conquer approach", correct: false },
        ],
    },
    {
        question: 'Given matrices A, B, and C with dimensions 10x20, 20x30, and 30x40 respectively, what is the minimum number of scalar multiplications needed to compute the product (AB)C?',
        answers: [
            { text: "6000", correct: false },
            { text: "12000", correct: true },
            { text: "18000", correct: false },
            { text: "24000", correct: false },
        ],
    },
    {
        question: 'What is the time complexity of the Matrix Chain Multiplication problem using dynamic programming?',
        answers: [
            { text: "O(n)", correct: false },
            { text: "O(n^2)", correct: false },
            { text: "O(n^3)", correct: true },
            { text: "O(2^n)", correct: false },
        ],
    },
    {
        question: 'What does the dynamic programming table in Matrix Chain Multiplication represent?',
        answers: [
            { text: "The minimum number of multiplications needed for each subproblem", correct: true },
            { text: "The optimal order of matrix multiplications", correct: false },
            { text: "The maximum number of multiplications possible", correct: false },
            { text: "The sequence of matrices in the optimal order", correct: false },
        ],
    },
    {
        question: 'In the Matrix Chain Multiplication problem, what does the "cost" of multiplying two matrices A and B refer to?',
        answers: [
            { text: "The sum of the dimensions of the matrices", correct: false },
            { text: "The number of scalar multiplications required", correct: true },
            { text: "The time complexity of the matrix multiplication algorithm", correct: false },
            { text: "The number of rows and columns in the resulting matrix", correct: false },
        ],
    },
    {
        question: 'What is the purpose of the "m[i][j]" entry in the Matrix Chain Multiplication DP table?',
        answers: [
            { text: "To store the minimum number of multiplications required for multiplying matrices from index i to j", correct: true },
            { text: "To store the dimensions of the matrices being multiplied", correct: false },
            { text: "To store the sequence of matrices in the optimal order", correct: false },
            { text: "To store the intermediate results of the multiplications", correct: false },
        ],
    },
    {
        question: 'In Matrix Chain Multiplication, what is the significance of the "s[i][j]" entry in the DP table?',
        answers: [
            { text: "To store the optimal split point for multiplying matrices from index i to j", correct: true },
            { text: "To store the dimensions of the matrices being multiplied", correct: false },
            { text: "To store the minimum number of multiplications required", correct: false },
            { text: "To store the sequence of matrices in the optimal order", correct: false },
        ],
    },
    {
        question: 'What is the main goal of the Matrix Chain Multiplication problem?',
        answers: [
            { text: "To find the optimal order of matrix multiplications", correct: true },
            { text: "To determine the fastest algorithm for matrix inversion", correct: false },
            { text: "To compute the determinant of a matrix", correct: false },
            { text: "To solve linear equations using matrices", correct: false },
        ],
    },
    {
        question: 'What is the minimum cost of multiplying matrices with dimensions 10x20, 20x30, and 30x40?',
        answers: [
            { text: "18000", correct: false },
            { text: "24000", correct: true },
            { text: "12000", correct: false },
            { text: "6000", correct: false },
        ],
    },
    {
        question: 'Which of the following methods can be used to solve the matrix chain multiplication problem?',
        answers: [
            { text: "DP", correct: false },
            { text: "Recurssion", correct: false },
            { text: "Brute force", correct: false },
            { text: "ALL", correct: true },
        ],
    },
    {
        question: 'Which of the following is the recurrence relation for the matrix chain multiplication problem where mat[i-1] * mat[i] gives the dimension of the ith matrix?',
        answers: [
            { text: "dp[i,j] = 1 if i=jdp[i,j] = min{dp[i,k] + dp[k+1,j]} + mat[i-1]*mat[k]*mat[j].", correct: false },
            { text: "dp[i,j] = 0 if i=jdp[i,j] = min{dp[i,k] + dp[k+1,j]} + mat[i-1]*mat[k]*mat[j].", correct: true },
            { text: " dp[i,j] = 0 if i=j dp[i,j] = min{dp[i,k] + dp[k+1,j]}", correct: false },
            { text: "dp[i,j] = 1 if i=j dp[i,j] = min{dp[i,k] + dp[k+1,j]}", correct: false },
        ],
    },
    {
        question: ' Consider the two matrices P and Q which are 10 x 20 and 20 x 30 matrices respectively. What is the number of multiplications required to multiply the two matrices?',
        answers: [
            { text: "10*30", correct: false },
            { text: "10*20*30", correct: true },
            { text: "20*30", correct: false },
            { text: "10*20", correct: false },
        ],
    }
 
];

