import { generateMentalHealthTip } from "./mentalhealth.js"
import { apiUrl } from "./config.js";

//add interscectionobserver for main page
const observer = new IntersectionObserver(
  entries => {
    entries.forEach((entry) => {
      if (!entry.target.classList.contains("show")){
        entry.target.classList.toggle("show", entry.isIntersecting);
      }
    });
  },
);

//observe other dom elements
observer.observe(document.querySelector(".support-container"));
observer.observe(document.querySelector(".newsletter-container"));


function showAlert(mainElement){
  const alertDiv = document.createElement('div');
  alertDiv.id = 'custom-alert';
  alertDiv.className = 'alert';
  alertDiv.style.textAlign = "center";
  // Create close button
  const closeBtn = document.createElement('span');
  closeBtn.style.padding = "5px";
  closeBtn.className = 'close-btn';
  const closeIcon = document.createElement("i");
  closeIcon.className = "fa-solid fa-x";  
  //appending icon to close btn
  closeBtn.appendChild(closeIcon);
  closeBtn.onclick = function() {
    alertDiv.style.display = 'none';
  };

  closeBtn.style.marginLeft = "1em";
  
  alertDiv.innerHTML = "⚠️ Worried about yourself or someone you know? Call or text <strong>9-8-8</strong>, toll-free, anytime, for support.";
  alertDiv.style.background = "#98002f";
  alertDiv.style.padding = "1em";
  alertDiv.appendChild(closeBtn);
  mainElement.insertBefore(alertDiv, document.querySelector("main"));
}


//function to create article elements when fetching news api
function createArticleElement(article){
  const createdDiv = document.createElement("div");
  createdDiv.classList.add("article-container");
  observer.observe(createdDiv);
  //make the element for article description
  const descElement = document.createElement("p");
  descElement.textContent = article.description;
  //create title element as anchor, clickable link
  const titleElement = document.createElement("a");
  titleElement.href = article.url;
  titleElement.textContent = article.title;
  titleElement.classList.add("article-title");
  //create image element
  const imageElement = document.createElement("img");
  imageElement.src = article.urlToImage;
  imageElement.classList.add("article-img");
  //create image limiting div
  const imageDiv = document.createElement("div");
  imageDiv.style.width = "20%";
  imageDiv.appendChild(imageElement);
  //make div which contains img and description
  const imageDescElement = document.createElement("div");
  imageDescElement.classList.add("article-titdescontainer");
  imageDescElement.append(titleElement, descElement);
  //append it to article container
  createdDiv.append(imageDiv, imageDescElement);
  newsContent.appendChild(createdDiv);
}
// get use content, use backend data to populate
const newsContent = document.querySelector(".news-content");
//api url goes here -------- ----------- ---------- --------
createNewsElements(`${apiUrl}:3000/api/news`);

function createNewsElements(apiUrl){
  const newsApiUrl = apiUrl;
  fetch(newsApiUrl)
    .then((res) => {
        if (!res.ok) {
          throw new Error('Network response failed, Error ' + res.statusText);
        }
        return res.json(); // Parsing the JSON data from the response
      })
    .then((data) => {
        //add custom keyword to what's new! <h2> tag
        const header = newsContent.parentElement.querySelector("h2");
        header.textContent += ` - ${data.keyword.replace("+", " ")}`
        //load only the first 10 articles
        let preferredAmount  = 10;
        const articleList = data.articles.slice(0, preferredAmount);
        articleList.forEach(item => {
          createArticleElement(item);
        });

        //make a next page button
        const nextPageBtn = document.createElement("button");
        const backPageBtn = document.createElement("button");
        //next icon
        const nextIcon = document.createElement("i");
        nextIcon.className = "fa-solid fa-arrow-right";
        nextIcon.style.color = "white";
        const backIcon = document.createElement("i");
        backIcon.className = "fa-solid fa-arrow-left";
        backIcon.style.color = "white";
        //append icons to buttons
        nextPageBtn.appendChild(nextIcon);
        backPageBtn.appendChild(backIcon);
        // make a next back div
        const nextBackDiv = document.createElement("div");
        nextBackDiv.append(backPageBtn, nextPageBtn);
        nextBackDiv.style.display = "flex";
        nextBackDiv.style.justifyContent = "center";
        // Initial button states
        backPageBtn.style.opacity = 0.5;
        if (preferredAmount >= data.articles.length) {
            nextPageBtn.style.opacity = 0.5;
        }

        nextPageBtn.addEventListener("click", () => {
            if (preferredAmount < data.articles.length) {
                const newArr = data.articles.slice(preferredAmount, preferredAmount + 10);
                backPageBtn.style.opacity = 1;
                preferredAmount += 10;
                // Clear all news content
                newsContent.innerHTML = "";
                // Loop over new array
                newArr.forEach((item) => {
                    createArticleElement(item);
                });
                newsContent.appendChild(nextBackDiv);
                // Update button states
                if (preferredAmount >= data.articles.length) {
                    nextPageBtn.style.opacity = 0.5;
                }
            }
        });

        backPageBtn.addEventListener("click", () => {
            if (preferredAmount > 10) {
                preferredAmount -= 10;
                const newArr = data.articles.slice(preferredAmount - 10, preferredAmount);
                nextPageBtn.style.opacity = 1;
                // Clear all news content
                newsContent.innerHTML = "";
                // Loop over new array
                newArr.forEach((item) => {
                    createArticleElement(item);
                });
                newsContent.appendChild(nextBackDiv);
                // Update button states
                if (preferredAmount <= 10) {
                    backPageBtn.style.opacity = 0.5;
                }
            }
        });

        newsContent.appendChild(nextBackDiv);
      })
    .catch((err) => {
      console.error(err);
    });
}

function alternateImages() {
  const mainImage = document.querySelector(".hero-img").querySelector("img");
  const originalSrc = mainImage.src;
  let indexOfLastImage = 0;
  const srcArray = [
    "https://cmha.ca/wp-content/uploads/2024/05/Self-Compassion-Feat-Img.png",
    "https://cmha.ca/wp-content/uploads/2024/05/Compassion-Fatigue.png",
    originalSrc
  ];
  
  setInterval(() => {
    mainImage.classList.add("fade-out");
    
    setTimeout(() => {
      if (indexOfLastImage === srcArray.length){
        indexOfLastImage = 0;
      }
      mainImage.src = srcArray[indexOfLastImage];
      mainImage.classList.remove("fade-out");
      indexOfLastImage += 1;
    }, 1000); // Duration should match the CSS transition duration
  }, 5000);
}
const formElement = document.querySelector(".newsletter-form");
formElement.addEventListener("submit", (event) => {
  console.log("email:", event.target.value);
  event.preventDefault();
  formElement.reset();
});

alternateImages();
console.log(generateMentalHealthTip());
//shows alert at top of body
showAlert(document.body);

