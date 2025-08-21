// 🌐 Toggle mobile navigation
function toggleMenu() {
  const navLinks = document.getElementById('navLinks');
  if (navLinks) navLinks.classList.toggle('active');
}

// 🔍 Live search across multiple sections
function setupLiveSearch() {
  const input = document.getElementById('searchInput');
  if (!input) return;

  input.addEventListener('input', function () {
    const query = this.value.toLowerCase();
    console.log("Searching for:", query);

    const items = [
      ...document.querySelectorAll('.card'),
      ...document.querySelectorAll('.opinion'),
      ...document.querySelectorAll('.rising-stars li'),
      ...document.querySelectorAll('.events-calendar li'),
      ...document.querySelectorAll('.fan-zone blockquote')
    ];

    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(query) ? 'block' : 'none';
    });
  });
}

// 📰 Render dynamic entertainment news
function renderArticles(articles, containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  container.innerHTML = ''; // Clear old content

  articles.forEach(article => {
    const card = document.createElement('div');
    card.className = 'news-card';

    card.innerHTML = `
      <img src="${article.urlToImage || 'images/fallback.jpg'}" alt="News Image">
      <h3>${article.title}</h3>
      <p>${article.description || 'No description available.'}</p>
      <span>${new Date(article.publishedAt).toLocaleDateString()}</span>
      <a href="${article.url}" target="_blank">Read More →</a>
    `;

    container.appendChild(card);
  });
}

// 🎭 Fetch entertainment news from NewsAPI
async function loadEntertainmentNews() {
  const containerSelector = '#newsContainer';
  const container = document.querySelector(containerSelector);
  if (!container) return;

  container.innerHTML = '<p>Loading...</p>';

  const API_KEY = '50ef0d308c254a68af97da4680cd2590';
  const API_URL = `https://newsapi.org/v2/top-headlines?country=pk&category=entertainment&pageSize=6&apiKey=${API_KEY}`;

  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    if (!data.articles || data.articles.length === 0) {
      container.innerHTML = '<p>No news found.</p>';
      return;
    }

    renderArticles(data.articles, containerSelector);
  } catch (error) {
    console.error('Error fetching news:', error);
    container.innerHTML = '<p>Failed to load news. Please try again later.</p>';
  }
}

// 🎬 Reveal sections on scroll
function setupScrollReveal() {
  const sections = document.querySelectorAll('section');

  const revealOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.3,
    rootMargin: "0px 0px -50px 0px"
  });

  sections.forEach(section => revealOnScroll.observe(section));
}

// 🚀 Initialize all features
document.addEventListener('DOMContentLoaded', () => {
  toggleMenu();
  setupLiveSearch();
  loadEntertainmentNews();
  setupScrollReveal();
});

document.getElementById("categorySelect").addEventListener("change", function () {
  const selectedPage = this.value;
  window.location.href = selectedPage;
});