// 🌐 Toggle mobile navigation
function toggleMenu() {
  const navLinks = document.getElementById('navLinks');
  if (navLinks) navLinks.classList.toggle('active');
}

// 📰 Render news articles dynamically
function renderArticles(articles, containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  container.innerHTML = ''; // Clear old content

  articles.forEach(article => {
    const card = document.createElement('div');
    card.className = 'news-card';

    const imageUrl = article.urlToImage || 'images/fallback.jpg';
    const date = new Date(article.publishedAt).toLocaleDateString();

    card.innerHTML = `
      <img src="${imageUrl}" alt="News Image">
      <h3>${article.title}</h3>
      <p>${article.description || 'No description available.'}</p>
      <span><strong>Date:</strong> ${date}</span>
      <a href="${article.url}" target="_blank">Read More →</a>
    `;

    container.appendChild(card);
  });
}

// 🎭 Fetch entertainment news
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

// 🔍 Live search across .news-card and .article
function setupLiveSearch() {
  const input = document.getElementById('searchInput');
  if (!input) return;

  input.addEventListener('input', function () {
    const query = this.value.toLowerCase();
    const items = [...document.querySelectorAll('.news-card'), ...document.querySelectorAll('.article')];

    items.forEach(item => {
      const title = item.querySelector('h3')?.textContent.toLowerCase() || '';
      const description = item.querySelector('p')?.textContent.toLowerCase() || '';
      item.style.display = (title.includes(query) || description.includes(query)) ? 'block' : 'none';
    });
  });
}

// 🌙 Dark mode toggle with localStorage
function setupDarkMode() {
  const toggleBtn = document.getElementById("darkModeToggle");
  const body = document.body;
  const header = document.querySelector("header");

  if (!toggleBtn) return;

  // Load saved mode
  if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark-mode");
    header?.classList.add("dark-mode");
    toggleBtn.textContent = "☀️";
  }

  toggleBtn.addEventListener("click", function () {
    body.classList.toggle("dark-mode");
    header?.classList.toggle("dark-mode");

    if (body.classList.contains("dark-mode")) {
      toggleBtn.textContent = "☀️";
      localStorage.setItem("theme", "dark");
    } else {
      toggleBtn.textContent = "🌙";
      localStorage.setItem("theme", "light");
    }
  });
}

// 📂 Category navigation
function setupCategoryRedirect() {
  const select = document.getElementById("categorySelect");
  if (!select) return;

  select.addEventListener("change", function () {
    const selectedPage = this.value;
    window.location.href = selectedPage;
  });
}

// ⏳ Loader wrapper for fetch
async function fetchNewsWithLoader(apiURL, containerSelector) {
  const loader = document.getElementById("loader");
  const container = document.querySelector(containerSelector);
  if (!container) return;

  if (loader) loader.style.display = "block";

  try {
    const res = await fetch(apiURL);
    const data = await res.json();

    if (!data.articles || data.articles.length === 0) {
      container.innerHTML = '<p>No articles found.</p>';
      return;
    }

    renderArticles(data.articles, containerSelector);
  } catch (err) {
    console.error("Fetch failed", err);
    container.innerHTML = '<p>Something went wrong. Try again later.</p>';
  } finally {
    if (loader) loader.style.display = "none";
  }
}

// 🚀 Initialize everything
document.addEventListener('DOMContentLoaded', () => {
  toggleMenu();
  setupLiveSearch();
  setupDarkMode();
  setupCategoryRedirect();

  if (window.location.pathname.includes('entertainment.html')) {
    loadEntertainmentNews();
  }
});