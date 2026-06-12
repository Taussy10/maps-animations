# Remotion Rendering Guidelines

This document outlines the strict guidelines and necessary steps for rendering the final Remotion video. 

**Note:** This guide is for the final rendering process, not the background map pre-rendering phase.

---

## 1. Shut Down ALL Other Applications (STRICT)
**BRO, SHUT OFF ALL OTHER PROGRAMS AND APPS.** 
Rendering a Remotion project requires a massive amount of RAM and CPU power. If your browser has 3-4 tabs open or you have other applications running in the background, your computer *will* run out of memory (RAM) and the render will crash with a WebGL or Memory error. 
- Close Google Chrome / Edge / Safari.
- Close any other heavy applications.
- **Only leave your terminal open** so that Remotion can use 100% of your PC's available RAM.

---

## 2. Verify Your Assets
Before you run the render command, **check your code nicely**. 
Ensure that absolutely every asset you are trying to show (images, audio files, icons, video backgrounds) physically exists inside the `public/` folder. 
- If your code says `<Img src={staticFile("moon.png")} />`, there **must** be a `moon.png` file in your `public` folder.
- If an asset is missing, the headless browser will fail to load it and your render will crash or hang indefinitely.

---

## 3. Concurrency Must Be 1
Remotion tries to render multiple frames in parallel by default to save time. However, this causes massive memory spikes and GPU context crashes on complex videos. 
You **must** restrict the render to a single thread by adding the `--concurrency=1` flag.

---

## 4. The Render Command
Once you have closed all your apps and verified your assets, use the following command in your terminal to export the video.

Replace `<CompositionName>` with the name of your React component (e.g., `Comp1`) and `<output-file.mp4>` with your desired file name:

```bash
npx remotion render <CompositionName> out/<output-file.mp4> --concurrency=1
```

**Example:**
```bash
npx remotion render Comp1 out/most-muslims-final.mp4 --concurrency=1
```
