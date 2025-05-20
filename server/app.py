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

def clean_request_files(files_to_delete: list):
    """Delete only the files generated during the current request."""
    for file_path in files_to_delete:
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
            except Exception as e:
                print(f"Error deleting file {file_path}: {e}")

@app.post("/download-audio/")
def download_audio(request: VideoRequest, background_tasks: BackgroundTasks):
    video_url = request.url
    output_audio_path = os.path.join(OUTPUT_DIR, "%(title)s.mp3")

    try:
        # Download audio and thumbnail
        subprocess.run(
            [
                "yt-dlp",
                "-f", "bestaudio",
                "--extract-audio",
                "--audio-format", "mp3",
                "--write-thumbnail",
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

        # Identify downloaded audio
        audio_files = sorted(glob.glob(f"{OUTPUT_DIR}/*.mp3"), key=os.path.getctime, reverse=True)
        if not audio_files:
            return {"error": "No audio file found"}
        audio_file = audio_files[0]

        with open(audio_file, "rb") as f:
            audio_base64 = base64.b64encode(f.read()).decode("utf-8")

        # Identify thumbnail
        thumbnail_files = sorted(
            glob.glob(f"{OUTPUT_DIR}/*.jpg") +
            glob.glob(f"{OUTPUT_DIR}/*.png") +
            glob.glob(f"{OUTPUT_DIR}/*.webp"),
            key=os.path.getctime,
            reverse=True
        )

        thumbnail_base64 = None
        thumbnail_file = None
        if thumbnail_files:
            thumbnail_file = thumbnail_files[0]
            with open(thumbnail_file, "rb") as f:
                thumbnail_base64 = base64.b64encode(f.read()).decode("utf-8")

        # Track only current request files for cleanup
        files_to_cleanup = [audio_file]
        if thumbnail_file:
            files_to_cleanup.append(thumbnail_file)

        background_tasks.add_task(clean_request_files, files_to_cleanup)

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
