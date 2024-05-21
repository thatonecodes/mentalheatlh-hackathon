import { main } from "./memorygame.js";

//mainpage is going to be true at first
let mainPage = true;

const breathingExerciseHtml = `
<canvas id="myCanvas" width="1280" height="720"></canvas>
<script src="/brython-scripts/breathing.py" type="text/python"></script>
`;

const quizInnerHtml = `
  <div class="container">
      <div id="question" class="question"></div>
      <div id="radio-buttons" class="radio-buttons"></div>
      <button id="next-button" class="btn" onclick="next_question()">Next</button>
  </div>
  <script src="/brython-scripts/questionnaire.py" type="text/python">
  </script>
`;

const memoryGameHtml = `
  <h1>Memory Cards</h1>
  <div class="grid-container">
  </div>
  <p style="text-align: center;font-size: large;font-weight: bold;">Moves: <span class="score"></span></p> 
  <div class="actions">
      <button class="restart">Restart</button>
  </div>
  <audio autoplay controls>
    <source src="/audio.mp3" type="audio/mpeg">
    Your browser does not support the audio element.
  </audio>
  <script src="/memorygame.js" type="module">
  </script>
`;

const mainContent = document.querySelector(".main-content");
//saved old innerhtml
const savedInnerHtml = mainContent.innerHTML;
const backBtn = document.createElement("button");
backBtn.style.alignItems = "center";
backBtn.style.display = "flex";
backBtn.style.color = "white";
backBtn.style.padding = "10px 20px";
backBtn.style.margin = "3em";
backBtn.textContent = "Back";
backBtn.className = "back-button";
const backIcon = document.createElement("div");
backIcon.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="width: 20px; height: 20px; margin-left: 10px; fill: white;">
    <!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
    <path d="M459.5 440.6c9.5 7.9 22.8 9.7 34.1 4.4s18.4-16.6 18.4-29V96c0-12.4-7.2-23.7-18.4-29s-24.5-3.6-34.1 4.4L288 214.3V256v41.7L459.5 440.6zM256 352V256 128 96c0-12.4-7.2-23.7-18.4-29s-24.5-3.6-34.1 4.4l-192 160C4.2 237.5 0 246.5 0 256s4.2 18.5 11.5 24.6l192 160c9.5 7.9 22.8 9.7 34.1 4.4s18.4-16.6 18.4-29V352z"/>
  </svg>
`;
backIcon.style.display = "flex";
backIcon.style.alignItems = "center";

backBtn.appendChild(backIcon);
//listen for all clicks first
listenAll();

backBtn.addEventListener("click", () => {
  if (!mainPage){
    mainContent.innerHTML = savedInnerHtml;
    backBtn.remove();
    mainPage = true;
    listenAll();
  }else{
    window.history.back();
  }
});

function listenAll(){
  listenBreathingDiv();
  listenQuizDiv();
  listenMemoryDiv();
  if (!document.querySelector(".back-button")){
    document.body.insertBefore(backBtn, document.querySelector("main"));
  }
}

function listenBreathingDiv(){
  const breathingDiv = document.querySelector(".game-div.breathing-exercise");
  breathingDiv.addEventListener("click", () => {
    mainContent.innerHTML = breathingExerciseHtml;
    mainPage = false;
    setTimeout(() => {
      const DOMImages = document.querySelectorAll("img");
      console.log(DOMImages);
      DOMImages.forEach((element) => {
        mainContent.appendChild(element);
      });
    }, 800);
  });
}

function listenQuizDiv(){
  const quizDiv = document.querySelector(".game-div.quiz");
  quizDiv.addEventListener("click", () => {
    mainContent.innerHTML = quizInnerHtml;
    mainPage = false;
  });
}

function listenMemoryDiv(){
  const memoryDiv = document.querySelector(".game-div.memorygame");
  memoryDiv.addEventListener("click", () => {
    mainContent.innerHTML = memoryGameHtml;
    mainPage = false;
    main();
  });
}
