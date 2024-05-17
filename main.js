import './style.css'
import javascriptLogo from '/javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'
import { generateMentalHealthTip } from "./mentalhealth.js"

const otherDiv = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>Hello Vite!</h1>
    <div class="card">
      <button id="counter" type="button">
      </button>
    </div>
    <p class="read-the-docs">
      Click on the Vite logo to learn more
    </p>
  </div>
`

document.querySelector('#app').innerHTML = otherDiv;

//add interscectionobserver for main page
const observer = new IntersectionObserver(
  entries => {
    entries.forEach((entry) => {
      console.log(entry);
    });
  },
);

document.querySelectorAll(".card").forEach((element) => {
  observer.observe(element);
});


// get use content, use backend data to populate
const newsContent = document.querySelector(".news-content");

console.log(generateMentalHealthTip());
setupCounter(document.querySelector('#counter'))
