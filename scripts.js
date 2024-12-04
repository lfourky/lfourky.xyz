const dataFilePath = "data.json"; // JSON file containing courses, books, and playlists
const apiBaseUrl = "http://localhost:4000/data"; // API endpoint

// Function to load data from JSON file (development)
async function loadDataFromJSON() {
  try {
    const response = await fetch(dataFilePath);
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }

    const data = await response.json();
    renderBooks(data.books);
    renderPlaylists(data.playlists);
  } catch (error) {
    console.error("Error loading data from JSON:", error);
  }
}

// Function to load data from API (production)
async function loadDataFromAPI() {
  try {
    const response = await fetch(apiBaseUrl);
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }

    const data = await response.json();
    renderBooks(data.books);
    renderPlaylists(data.playlists);
  } catch (error) {
    console.error("Error loading data from API:", error);
  }
}

// Function to render books
function renderBooks(books) {
  const container = document.getElementById("booksContainer");
  container.innerHTML = ""; // Clear existing content

  books.forEach((book) => {
    const bookCard = document.createElement("div");
    bookCard.className = "book-card";

    bookCard.innerHTML = `
      <img src="${book.thumbnail}" alt="${book.title}" />
      <h3>${book.title}</h3>
      <p>${book.author}</p>
      <p>${book.description}</p>
      <a href="${book.url}" target="_blank">View on Amazon</a>
    `;

    container.appendChild(bookCard);
  });
}

// Function to render playlists
function renderPlaylists(playlists) {
  const container = document.getElementById("playlistsContainer");
  container.innerHTML = ""; // Clear any existing content

  playlists.forEach((playlist) => {
    const playlistDiv = document.createElement("div");
    playlistDiv.className = "playlist";

    // Playlist title
    const playlistTitle = document.createElement("h2");
    playlistTitle.className = "playlist-title";
    playlistTitle.textContent = playlist.name;
    playlistDiv.appendChild(playlistTitle);

    // Display progress bar
    const progressBarContainer = document.createElement("div");
    progressBarContainer.className = "progress-bar-container";
    const progressBar = document.createElement("div");
    progressBar.className = "progress-bar";
    progressBar.style.width = `${playlist.progress.percentage}%`;
    progressBarContainer.appendChild(progressBar);
    playlistDiv.appendChild(progressBarContainer);

    // Display progress text
    const progressText = document.createElement("p");
    progressText.style.textAlign = "center";
    progressText.textContent = `Progress: ${playlist.progress.watchedVideos} / ${playlist.progress.totalVideos} (${playlist.progress.percentage}%)`;
    playlistDiv.appendChild(progressText);

    // Create video container
    const videoContainer = document.createElement("div");
    videoContainer.className = "video-container";

    // Render videos
    playlist.videos.forEach((video) => {
      const videoCard = document.createElement("div");
      videoCard.className = "video-card";

      videoCard.innerHTML = `
        <img src="${video.thumbnail}" alt="${video.title}">
        <h3>${video.title}</h3>
        <a href="${video.url}" target="_blank">Watch Video</a>
      `;

      videoContainer.appendChild(videoCard);
    });

    playlistDiv.appendChild(videoContainer);
    container.appendChild(playlistDiv);
  });
}

// Uncomment the appropriate function call for your environment:

// Development (load data from JSON)
loadDataFromJSON();

// Production (load data from API)
// loadDataFromAPI();
