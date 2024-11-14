// Tu configuración de Firebase
var firebaseConfig = {
    databaseURL: "https://hidrocarburos-b5f07-default-rtdb.firebaseio.com/"
};
// Inicializa Firebase
firebase.initializeApp(firebaseConfig);
// Referencia a la base de datos
var database = firebase.database();

var data = {}; // data.name, data.score

data.name = localStorage.getItem("username");

const startButton = document.getElementById('start-btn')
const nextButton = document.getElementById('next-btn')
const questionContainerElement = document.getElementById('question-container')
const questionElement = document.getElementById('question')
const answerButtonsElement = document.getElementById('answer-buttons')
const resultContainerElement = document.getElementById('result-container')
const scoreElement = document.getElementById('score')
const restartButton = document.getElementById('restart-btn')

let shuffledQuestions, currentQuestionIndex, score;

startButton.addEventListener('click', startQuiz)
nextButton.addEventListener('click', () => {
    currentQuestionIndex++
    setNextQuestion()
})
restartButton.addEventListener('click', () => {
    window.location.href = "home.html";
})

function startQuiz() {
    startButton.classList.add('hide')
    shuffledQuestions = questions.sort(() => Math.random() - 0.5)
    currentQuestionIndex = 0
    score = 0
    questionContainerElement.classList.remove('hide')
    resultContainerElement.classList.add('hide')
    setNextQuestion()
}

function setNextQuestion() {
    resetState()
    showQuestion(shuffledQuestions[currentQuestionIndex])
}

function showQuestion(question) {
    questionElement.innerText = question.question
    question.answers.forEach(answer => {
        const button = document.createElement('button')
        button.innerText = answer.text
        button.classList.add('btn')
        if (answer.correct) {
            button.dataset.correct = answer.correct
        }
        button.addEventListener('click', selectAnswer)
        answerButtonsElement.appendChild(button)
    })
}

function resetState() {
    clearStatusClass(document.body)
    nextButton.classList.add('hide')
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild)
    }
}

function selectAnswer(e) {
    const selectedButton = e.target
    const correct = selectedButton.dataset.correct
    setStatusClass(document.body, correct)
    Array.from(answerButtonsElement.children).forEach(button => {
        setStatusClass(button, button.dataset.correct)
    })
    if (correct) {
        score++
    }
    if (shuffledQuestions.length > currentQuestionIndex + 1) {
        nextButton.classList.remove('hide')
    } else {
        startButton.innerText = 'Restart'
        startButton.classList.remove('hide')
        showResult()
    }
}

function showResult() {
    questionContainerElement.classList.add('hide')
    resultContainerElement.classList.remove('hide')
    scoreElement.innerText = `${score} out of ${questions.length}`
    data.score = score;
    // Config
    var updates = {};
    updates[data.name] = data;

    // Enviar los datos a Firebase
    database.ref().update(updates)
    .then(function() {
        console.log(data);
    });
}

function setStatusClass(element, correct) {
    clearStatusClass(element)
    if (correct) {
        element.classList.add('correct')
    } else {
        element.classList.add('wrong')
    }
}

function clearStatusClass(element) {
    element.classList.remove('correct')
    element.classList.remove('wrong')
}

const questions = [
    {
        question: '¿Qué es la contaminación hídrica?',
        answers: [
            { text: 'Es la introducción de sustancias dañinas al agua, afectando la salud y el ecosistema.', correct: true },
            { text: 'Es el exceso de nutrientes en el agua.', correct: false },
            { text: 'Es un proceso natural de las aguas subterráneas.', correct: false },
            { text: 'Es el resultado de la actividad volcánica en el agua.', correct: false }
        ]
    },
    {
        question: '¿Cuál de los siguientes NO es un contaminante común en el agua?',
        answers: [
            { text: 'Fertilizantes', correct: false },
            { text: 'Metales pesados', correct: false },
            { text: 'Plásticos', correct: false },
            { text: 'Oxígeno', correct: true }
        ]
    },
    {
        question: '¿Qué tipo de contaminante son los pesticidas y fertilizantes?',
        answers: [
            { text: 'Contaminantes químicos', correct: true },
            { text: 'Contaminantes biológicos', correct: false },
            { text: 'Contaminantes físicos', correct: false },
            { text: 'Contaminantes radiactivos', correct: false }
        ]
    },
    {
        question: '¿Cuál es uno de los efectos en la salud de consumir agua con metales pesados?',
        answers: [
            { text: 'Alergias', correct: false },
            { text: 'Enfermedades neurológicas', correct: true },
            { text: 'Dolores musculares leves', correct: false },
            { text: 'Aumento de la energía', correct: false }
        ]
    },
    {
        question: '¿Qué es la eutrofización?',
        answers: [
            { text: 'La acumulación de sedimentos en el agua', correct: false },
            { text: 'El crecimiento excesivo de algas por nutrientes en el agua', correct: true },
            { text: 'El proceso de tratamiento del agua', correct: false },
            { text: 'La erosión de las riberas de los ríos', correct: false }
        ]
    },
    {
        question: '¿Cuál de las siguientes NO es una medida para combatir la contaminación hídrica?',
        answers: [
            { text: 'Biorremediación', correct: false },
            { text: 'Eutrofización', correct: true },
            { text: 'Reforestación', correct: false },
            { text: 'Agricultura sostenible', correct: false }
        ]
    }
];
