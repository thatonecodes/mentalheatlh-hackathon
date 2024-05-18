import './style.css'
import { generateMentalHealthTip } from "./mentalhealth.js"


//add interscectionobserver for main page
const observer = new IntersectionObserver(
  entries => {
    entries.forEach((entry) => {
      console.log(entry);
      entry.target.classList.toggle("show", entry.isIntersecting);
    });
  },
);

document.querySelectorAll(".card").forEach((element) => {
  observer.observe(element);
});

//function to create article elements when fetching news api
function createArticleElement(article){
  const createdDiv = document.createElement("div");
  createdDiv.classList.add("article-container");
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
createNewsElements("http://localhost:3000/api/news");

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

console.log(generateMentalHealthTip());
