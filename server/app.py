from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import subprocess
import os
import glob
import base64

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class VideoRequest(BaseModel):
    url: str

OUTPUT_DIR = "downloads"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def clean_old_files():
    """Delete old MP3 and image files to save storage."""
    for file in glob.glob(f"{OUTPUT_DIR}/*"):
        os.remove(file)

@app.post("/download-audio/")
def download_audio(request: VideoRequest, background_tasks: BackgroundTasks):
    video_url = request.url
    output_audio_path = os.path.join(OUTPUT_DIR, "%(title)s.mp3")
    output_thumbnail_path = os.path.join(OUTPUT_DIR, "%(title)s.%(ext)s")

    try:
        # Download audio and thumbnail
        subprocess.run(
            [
                "yt-dlp",
                "-f", "bestaudio",
                "--extract-audio",
                "--audio-format", "mp3",
                "--write-thumbnail",  # Download thumbnail
                "-o", output_audio_path,
                video_url
            ],
            check=True
        )

        # Get artist/uploader metadata
        artist = subprocess.run(
            ["yt-dlp", "--print", "%(uploader)s", video_url],
            capture_output=True,
            text=True
        ).stdout.strip()

        # Get the latest downloaded MP3 file
        audio_files = sorted(glob.glob(f"{OUTPUT_DIR}/*.mp3"), key=os.path.getctime, reverse=True)
        if not audio_files:
            return {"error": "No audio file found"}
        audio_file = audio_files[0]

        # Convert MP3 to Base64
        with open(audio_file, "rb") as f:
            audio_base64 = base64.b64encode(f.read()).decode("utf-8")

        # Get the latest downloaded thumbnail file
        thumbnail_files = sorted(
            glob.glob(f"{OUTPUT_DIR}/*.jpg") + glob.glob(f"{OUTPUT_DIR}/*.png") + glob.glob(f"{OUTPUT_DIR}/*.webp"),
            key=os.path.getctime,
            reverse=True
        )

        thumbnail_base64 = None
        if thumbnail_files:
            thumbnail_file = thumbnail_files[0]
            with open(thumbnail_file, "rb") as f:
                thumbnail_base64 = base64.b64encode(f.read()).decode("utf-8")

        # Schedule cleanup after request
        background_tasks.add_task(clean_old_files)

        # Return Base64-encoded audio, thumbnail, and artist
        return {
            "filename": os.path.basename(audio_file),
            "audio_base64": audio_base64,
            "thumbnail_base64": thumbnail_base64,
            "artist": artist
        }

    except subprocess.CalledProcessError:
        return {"error": "Failed to download audio"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=4000)
