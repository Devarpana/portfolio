
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active'); // Your mobile menu visibility logic
    document.body.classList.toggle('nav-open'); // This disables scroll
  });


var typed = new Typed('#element', {
  strings: ['Web Developer', 'Web Designer', 'Graphic Designer', 'Data Engineer'],
  typeSpeed: 50,
  loop: true
});


document.querySelectorAll('.project-info button').forEach(btn => {
  btn.addEventListener('click', function () {
    const info = this.parentElement;
    const isFocused = info.classList.contains('focused');

    if (!isFocused) {
      info.classList.add('focused');
      this.textContent = "Go Back";
    } else {
      info.classList.remove('focused');
      this.textContent = "Know More";
    }
  });
});
const themeToggle = document.getElementById("theme-toggle");
const icon = themeToggle.querySelector("i");

themeToggle.addEventListener("click", () => {
  const htmlEl = document.documentElement;

  if (htmlEl.hasAttribute("data-theme")) {
    htmlEl.removeAttribute("data-theme");
    icon.classList.remove("fa-moon");
    icon.classList.add("fa-sun");
  } else {
    htmlEl.setAttribute("data-theme", "light");
    icon.classList.remove("fa-sun");
    icon.classList.add("fa-moon");
  }
});

const scrollBtn = document.getElementById("scrollToTopBtn");
const header = document.querySelector("header");

const observer = new IntersectionObserver(
  ([entry]) => {
    if (entry.isIntersecting) {
      scrollBtn.style.display = "none";
    } else {
      scrollBtn.style.display = "block";
    }
  },
  {
    threshold: 0.5,
  }
);

if (header) {
  observer.observe(header);
}

scrollBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});
