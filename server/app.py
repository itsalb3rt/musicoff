from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
import subprocess
import os
import glob

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (change to specific domains if needed)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

class VideoRequest(BaseModel):
    url: str

OUTPUT_DIR = "downloads"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def clean_old_files():
    """Delete old MP3 files to save storage."""
    for file in glob.glob(f"{OUTPUT_DIR}/*.mp3"):
        os.remove(file)

@app.post("/download-audio/")
def download_audio(request: VideoRequest, background_tasks: BackgroundTasks):
    video_url = request.url
    output_path = os.path.join(OUTPUT_DIR, "%(title)s.%(ext)s")

    try:
        # Download and convert video to audio
        subprocess.run(
            ["yt-dlp", "-f", "bestaudio", "--extract-audio", "--audio-format", "mp3", "-o", output_path, video_url],
            check=True
        )

        # Get the downloaded file (assuming it's the latest one)
        files = sorted(glob.glob(f"{OUTPUT_DIR}/*.mp3"), key=os.path.getctime, reverse=True)
        if not files:
            return {"error": "No audio file found"}

        audio_file = files[0]

        # Schedule cleanup after request
        background_tasks.add_task(clean_old_files)

        # Return the file
        return FileResponse(audio_file, media_type="audio/mpeg", filename=os.path.basename(audio_file))

    except subprocess.CalledProcessError:
        return {"error": "Failed to download audio"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=4000)
