(() => {
  const videos = [];
  const videoElements = document.querySelectorAll(
    "div#meta.style-scope.ytd-playlist-video-renderer"
  );

  videoElements.forEach((videoElement) => {
    const anchor = videoElement.querySelector("a#video-title");
    if (anchor) {
      const title = anchor.getAttribute("title");
      const videoUrl = `https://www.youtube.com${
        anchor.getAttribute("href").split("&")[0]
      }`; // Clean URL
      const videoId = videoUrl.split("v=")[1];
      const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

      videos.push({ title, url: videoUrl, thumbnail: thumbnailUrl });
    }
  });

  // Convert to CSV format
  const csvContent =
    "id,title,url,thumbnail\n" +
    videos
      .map(
        (video, index) =>
          `${index + 1},"${video.title}","${video.url}","${video.thumbnail}"`
      )
      .join("\n");

  console.log(csvContent);

  // Create a downloadable CSV file
  const blob = new Blob([csvContent], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "playlist_videos.csv";
  link.click();
})();
