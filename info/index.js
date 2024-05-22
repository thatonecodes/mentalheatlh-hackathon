const observer = new IntersectionObserver(
  entries => {
    entries.forEach((entry) => {
      if (!entry.target.classList.contains("show")){
        entry.target.classList.toggle("show", entry.isIntersecting);
      }
    });
  },
);

document.querySelectorAll(".card").forEach((element) => {
  observer.observe(element);
});
document.querySelectorAll(".list-container").forEach((element)=>{
  observer.observe(element);
});
observer.observe(document.querySelector(".main-contentdiv"));
observer.observe(document.querySelector(".mission-div"));
observer.observe(document.querySelector(".wave-div"));
