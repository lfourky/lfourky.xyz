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
    const percentage =
      book.totalPages > 0 ? (book.readPages / book.totalPages) * 100 : 0;

    const bookCard = document.createElement("div");
    bookCard.className = "book-card";

    // Add "completed" class if the book is fully read
    if (percentage === 100) {
      bookCard.classList.add("completed");
    }

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
    // Dynamically calculate progress
    const watchedVideos = playlist.videos.filter(
      (video) => video.watched
    ).length;
    const totalVideos = playlist.videos.length;
    const percentage =
      totalVideos > 0 ? (watchedVideos / totalVideos) * 100 : 0;

    // Create playlist container
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
    progressBar.style.width = `${percentage}%`; // Set dynamic width
    progressBar.setAttribute("aria-valuenow", percentage.toFixed(1));
    progressBar.setAttribute("aria-valuemin", "0");
    progressBar.setAttribute("aria-valuemax", "100");
    progressBarContainer.appendChild(progressBar);
    playlistDiv.appendChild(progressBarContainer);

    // Display progress text
    const progressText = document.createElement("p");
    progressText.style.textAlign = "center";
    progressText.textContent = `Progress: ${watchedVideos} / ${totalVideos} (${percentage.toFixed(
      1
    )}%)`;
    playlistDiv.appendChild(progressText);

    // Create video container
    const videoContainer = document.createElement("div");
    videoContainer.className = "video-container";

    // Render videos and find the second-to-last watched video
    let lastWatchedVideoIndex = null;
    let secondLastWatchedVideoIndex = null;

    playlist.videos.forEach((video, index) => {
      const videoCard = document.createElement("div");
      videoCard.className = "video-card";

      // Add "watched" class if the video is watched
      if (video.watched) {
        videoCard.classList.add("watched");
        secondLastWatchedVideoIndex = lastWatchedVideoIndex; // Update second last watched
        lastWatchedVideoIndex = index; // Update last watched
      }

      videoCard.innerHTML = `
        <img src="${video.thumbnail}" alt="${video.title}">
        <h3>${video.title}</h3>
        <a href="${video.url}" target="_blank">Watch Video</a>
      `;

      videoContainer.appendChild(videoCard);
    });

    playlistDiv.appendChild(videoContainer);
    container.appendChild(playlistDiv);

    // Automatically scroll the video container to the second-to-last watched video
    if (secondLastWatchedVideoIndex !== null) {
      const scrollOffset = secondLastWatchedVideoIndex * 220; // Adjust 220 to match the video card width + margin
      setTimeout(() => {
        videoContainer.scrollTo({
          left: scrollOffset,
          behavior: "smooth",
        });
      }, 100); // Delay to ensure rendering is complete
    }
  });
}

loadDataFromJSON();
