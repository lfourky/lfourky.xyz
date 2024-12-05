const dataFilePath = "data.json";

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

function renderBooks(books) {
  const container = document.getElementById("booksContainer");
  container.innerHTML = ""; // Clear existing content

  books.forEach((book) => {
    const percentage = book.totalPages > 0 ? (book.readPages / book.totalPages) * 100 : 0;

    const bookCard = document.createElement("div");
    bookCard.className = "book-card";

    bookCard.innerHTML = `
      <img src="${book.thumbnail}" alt="${book.title}" />
      <div class="progress">
        <div
          class="progress-bar"
          role="progressbar"
          style="width: ${percentage.toFixed(1)}%;"
          aria-valuenow="${percentage.toFixed(1)}"
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>
      <p class="progress-text">
        ${book.readPages} of ${book.totalPages} pages read
      </p>
      <h3>${book.title}</h3>
      <p>${book.author}</p>
      <a href="${book.url}" target="_blank">View on Amazon</a>
    `;

    container.appendChild(bookCard);
  });
}


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

loadDataFromJSON();
