import ffmpeg from "fluent-ffmpeg";
//import ffmpegPath from "ffmpeg-static";
//const ffmpegPath = require("ffmpeg-static") as string;

import tmp from "tmp";
import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import { uploadToS3 } from "./s3";

// Resolve executable manually instead of relying on broken require()
// const ffmpegPath = path.resolve(
//   process.cwd(),
//   "node_modules",
//   "ffmpeg-static",
//   process.platform === "win32" ? "ffmpeg.exe" : "ffmpeg"
// );

//ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfmpegPath("/usr/bin/ffmpeg");
//console.log("Using FFmpeg at:", ffmpegPath);

export async function createVideoFromAssets(
  images: string[],
  audioUrl: string
): Promise<string> {
  const tempDir = tmp.dirSync({ unsafeCleanup: true });
  const outputPath = path.join(tempDir.name, "output.mp4");

  // Step 1: Download images
  const imagePaths = await Promise.all(
    images.map(async (url, i) => {
      const res = await fetch(url);
      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      //const buffer = await res.buffer();
      //const imgPath = path.join(tempDir.name, `img${i}.jpg`);
      const imgPath = path.join(
        tempDir.name,
        `img${String(i).padStart(3, "0")}.jpg`
      );

      fs.writeFileSync(imgPath, buffer);
      return imgPath;
    })
  );

  const inputListPath = path.join(tempDir.name, "input.txt");
  const imageDuration = 60 / imagePaths.length; // Adjust based on audio length if needed

  let inputTxt = "";
  for (let i = 0; i < imagePaths.length; i++) {
    const imgPath = imagePaths[i].replace(/\\/g, "/");
    inputTxt += `file '${imgPath}'\n`;
    inputTxt += `duration ${imageDuration}\n`;
  }

  // FFmpeg requires last image to be repeated once without duration
  inputTxt += `file '${imagePaths[imagePaths.length - 1].replace(
    /\\/g,
    "/"
  )}'\n`;

  fs.writeFileSync(inputListPath, inputTxt);

  // Step 2: Download audio
  const audioRes = await fetch(audioUrl);
  // console.log("audioUrl:", audioUrl);
  //console.log("audioRes:", audioRes);
  if (!audioRes.ok) {
    ///console.error("Audio fetch failed:", audioRes.statusText);
    throw new Error("Failed to fetch audio");
  }
  //console.log("Audio response status:", audioRes.status);

  const arrayAudioBuffer = await audioRes.arrayBuffer();
  //console.log("Audio buffer size:", arrayAudioBuffer.byteLength);
  //console.log("Audio buffer type:", typeof arrayAudioBuffer);

  const audioBuffer = Buffer.from(arrayAudioBuffer);
  //console.log("Audio buffer created:", audioBuffer.length);
  //console.log("Audio buffer type:", typeof audioBuffer);

  //const audioBuffer = await audioRes.buffer();
  const audioPath = path.join(tempDir.name, "audio.mp3");
  //console.log("Audio path:", audioPath);

  fs.writeFileSync(audioPath, audioBuffer);

  // Step 3: Create slideshow video with audio
  await new Promise((resolve, reject) => {
    ffmpeg()
      .input(path.join(tempDir.name, "img%03d.jpg"))
      .inputOptions(["-framerate", `${1 / imageDuration}`])
      .input(audioPath)
      .complexFilter([`[0:v]fps=25,scale=720:1280,format=yuv420p[v]`])
      .outputOptions([
        "-map",
        "[v]",
        "-map",
        "1:a",
        "-shortest",
        "-movflags",
        "+faststart",
        "-pix_fmt",
        "yuv420p",
      ])
      .output(outputPath)
      .on("end", resolve)
      .on("error", reject)
      .on("start", (cmd) => console.log("FFmpeg command:", cmd))
      .on("end", () => console.log("Video created"))
      .on("error", (err) => console.error(" FFmpeg error:", err))
      .run();
  });

  // Step 4: Upload final video to S3
  const videoBuffer = fs.readFileSync(outputPath);
  const videoUrl = await uploadToS3(videoBuffer, "mp4");

  const finalUrl = videoUrl;
  setTimeout(() => {
    try {
      tempDir.removeCallback();
      console.log("Cleaned up temp files");
    } catch (e) {
      console.warn("Temp cleanup failed:", e);
    }
  }, 1000);

  return finalUrl;
}
