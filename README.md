# Animations Workspace

This repository is the master workspace for all animation projects. All project directories are tracked in this single repository, while build/node directories are ignored.

---

## 📥 Downloading Specific Folders
If you need to download only a specific project folder in the future instead of cloning the entire repository, you can use:
* **DownGit**: [downgit.github.io](https://downgit.github.io/) (Paste the subfolder URL to download it as a ZIP)
* **GitHub Web UI**: Navigate to the folder and click **`...`** (three dots) -> **Download directory**.

---

## ⚡ Workspace & Strategy Rules

### 1. Shared Resources, No Duplication
Large geospatial files (e.g. `india.json` which is ~12MB) are stored once in the global `data/` folder and imported into projects relatively (e.g. `../../../data/usa.json`). This saves gigabytes of disk space and duplicate file management.

### 2. Code Portability
Individual projects reside in their own folders inside this workspace. If you want to deploy, share, or render a specific animation on a remote server/render farm, you can copy or clone just that individual project directory.

### 3. Media Assets Isolation
We cannot share images/media assets across different project folders. In Remotion, static assets (images, audio, videos) **must** stay inside the local `public/` folder of each specific project directory.

### 4. Temporary Files Isolation
We do not share `temp/` folders because they are project-specific. If you encounter issues, delete the local `temp/` directory after completing the animation.

### 5. Strict Obedience Rule
The AI assistant must strictly follow the user's specific instructions. Do not take creative liberties or perform extra steps (like rendering the final composition) if a specific phase (like pre-rendering) is requested.