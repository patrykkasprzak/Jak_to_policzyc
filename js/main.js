document.addEventListener("DOMContentLoaded", function() {
    const accordionButtons = document.querySelectorAll('.accordion-btn, .level-btn');

    accordionButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.classList.toggle('active');
            
            const header = this.parentElement;
            const content = header.nextElementSibling;
            
            if (content && content.classList.contains('accordion-content')) {
                content.classList.toggle('show');
            }
        });
    });

    const timeLimitSelect = document.getElementById('time-limit');
    const customTimeInput = document.getElementById('custom-time');

    if (timeLimitSelect && customTimeInput) {
        timeLimitSelect.addEventListener('change', function() {
            if (this.value === 'custom') {
                customTimeInput.classList.remove('hidden');
                customTimeInput.focus();
            } else {
                customTimeInput.classList.add('hidden');
                customTimeInput.value = '';
            }
        });
    }

    const themeToggleBtn = document.getElementById('theme-toggle');

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
        });
    }

    const solutionButtons = document.querySelectorAll('.btn-solution');

    solutionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const solutionContent = this.nextElementSibling;
            
            if (solutionContent && solutionContent.classList.contains('solution-content')) {
                solutionContent.classList.toggle('hidden');
                
                if (solutionContent.classList.contains('hidden')) {
                    this.textContent = 'Pokaż rozwiązanie';
                } else {
                    this.textContent = 'Ukryj rozwiązanie';
                }
            }
        });
    });

    const gameSetup = document.getElementById('game-setup');
    const gameActive = document.getElementById('game-active');
    const gameSummary = document.getElementById('game-summary');
    const startGameBtn = document.getElementById('start-game-btn');
    const submitAnswerBtn = document.getElementById('submit-answer-btn');
    const restartGameBtn = document.getElementById('restart-game-btn');
    const equationDisplay = document.getElementById('equation');
    const answerInput = document.getElementById('answer-input');
    const feedbackMessage = document.getElementById('feedback-message');
    const questionCounterDisplay = document.getElementById('question-counter');
    const timerDisplay = document.getElementById('timer-display');
    const timeLeftDisplay = document.getElementById('time-left');
    const finalScoreDisplay = document.getElementById('final-score');

    let currentQuestionIndex = 0;
    let score = 0;
    let currentAnswer = "";
    let timeLimit = 0;
    let timerInterval;
    let selectedOperations = [];
    const totalQuestions = 10;
    let isProcessing = false;

    if (startGameBtn) {
        startGameBtn.addEventListener('click', function() {
            const checkboxes = document.querySelectorAll('input[name="operation"]:checked');
            selectedOperations = Array.from(checkboxes).map(cb => cb.value);

            if (selectedOperations.length === 0) {
                alert("Wybierz przynajmniej jedno działanie!");
                return;
            }

            let timeVal = timeLimitSelect.value;
            if (timeVal === 'custom') {
                timeLimit = parseInt(customTimeInput.value);
                if (isNaN(timeLimit) || timeLimit <= 0) timeLimit = 0;
            } else {
                timeLimit = parseInt(timeVal);
            }

            score = 0;
            currentQuestionIndex = 0;
            
            gameSetup.classList.add('hidden');
            gameSummary.classList.add('hidden');
            gameActive.classList.remove('hidden');

            if (timeLimit > 0) {
                timerDisplay.classList.remove('hidden');
            } else {
                timerDisplay.classList.add('hidden');
            }

            nextQuestion();
        });
    }

    if (submitAnswerBtn) {
        submitAnswerBtn.addEventListener('click', checkAnswer);
    }

    if (answerInput) {
        answerInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                checkAnswer();
            }
        });
    }

    if (restartGameBtn) {
        restartGameBtn.addEventListener('click', function() {
            gameSummary.classList.add('hidden');
            gameSetup.classList.remove('hidden');
        });
    }

    function generateMathProblem() {
        const op = selectedOperations[Math.floor(Math.random() * selectedOperations.length)];
        let q = "";
        let a = "";

        if (op === 'add') {
            const num1 = Math.floor(Math.random() * 50) + 1;
            const num2 = Math.floor(Math.random() * 50) + 1;
            q = `${num1} + ${num2}`;
            a = (num1 + num2).toString();
        } else if (op === 'subtract') {
            const num1 = Math.floor(Math.random() * 50) + 20;
            const num2 = Math.floor(Math.random() * 20) + 1;
            q = `${num1} - ${num2}`;
            a = (num1 - num2).toString();
        } else if (op === 'multiply') {
            const num1 = Math.floor(Math.random() * 12) + 2;
            const num2 = Math.floor(Math.random() * 12) + 2;
            q = `${num1} * ${num2}`;
            a = (num1 * num2).toString();
        } else if (op === 'divide') {
            const num2 = Math.floor(Math.random() * 12) + 2;
            const ans = Math.floor(Math.random() * 12) + 2;
            const num1 = num2 * ans;
            q = `${num1} / ${num2}`;
            a = ans.toString();
        } else if (op === 'power') {
            const num = Math.floor(Math.random() * 10) + 1;
            const pow = Math.floor(Math.random() * 2) + 2;
            q = `${num}^${pow}`;
            a = Math.pow(num, pow).toString();
        } else if (op === 'root') {
            const isCube = Math.random() > 0.5;
            const num = Math.floor(Math.random() * 10) + 1;
            if (isCube) {
                q = `${num * num * num}^(1/3)`;
                a = num.toString();
            } else {
                q = `sqrt(${num * num})`;
                a = num.toString();
            }
        }
        return { question: q, answer: a };
    }

    function nextQuestion() {
        isProcessing = false;
        currentQuestionIndex++;
        
        if (currentQuestionIndex > totalQuestions) {
            endGame();
            return;
        }

        questionCounterDisplay.textContent = `Pytanie: ${currentQuestionIndex}/${totalQuestions}`;
        feedbackMessage.textContent = "";
        feedbackMessage.className = "";
        answerInput.value = "";
        answerInput.disabled = false;
        submitAnswerBtn.disabled = false;
        answerInput.focus();

        const problem = generateMathProblem();
        equationDisplay.textContent = problem.question;
        currentAnswer = problem.answer;

        if (timeLimit > 0) {
            startTimer();
        }
    }

    function startTimer() {
        clearInterval(timerInterval);
        let currentLeft = timeLimit;
        timeLeftDisplay.textContent = currentLeft;
        
        timerInterval = setInterval(() => {
            currentLeft--;
            timeLeftDisplay.textContent = currentLeft;
            if (currentLeft <= 0) {
                clearInterval(timerInterval);
                processResult(false, true);
            }
        }, 1000);
    }

    function checkAnswer() {
        if (isProcessing) return;
        clearInterval(timerInterval);
        
        const userAnswer = answerInput.value.trim().replace(',', '.');
        const isCorrect = (userAnswer === currentAnswer);
        
        processResult(isCorrect, false);
    }

    function processResult(isCorrect, isTimeout) {
        isProcessing = true;
        answerInput.disabled = true;
        submitAnswerBtn.disabled = true;

        if (isCorrect) {
            score++;
            feedbackMessage.textContent = "Dobrze!";
            feedbackMessage.className = "feedback-correct";
        } else {
            if (isTimeout) {
                feedbackMessage.textContent = `Czas minął! Poprawna odpowiedź: ${currentAnswer}`;
            } else {
                feedbackMessage.textContent = `Źle. Poprawna odpowiedź: ${currentAnswer}`;
            }
            feedbackMessage.className = "feedback-wrong";
        }

        setTimeout(nextQuestion, 2500);
    }

    function endGame() {
        gameActive.classList.add('hidden');
        gameSummary.classList.remove('hidden');
        finalScoreDisplay.textContent = score;
    }
});