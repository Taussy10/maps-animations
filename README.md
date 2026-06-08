# Animations Workspace

This repository serves as the master workspace for all animation projects. It uses a scalable, hybrid Git structure designed to handle 100s of Remotion animation projects efficiently.

---

## 🏗️ Workspace Strategy

The workspace is organized into two parts:
1. **Global/Shared Assets**: Centralized folders (`data/` and `prompt/`) and configurations (`GEMINI.md`, `README.md`) managed by this parent repository.
2. **Independent Animation Projects**: Each project (e.g., `usa-antartica/`) is an independent folder, ignored by this repository, and managed by its own project-specific Git repository.

### Directory Structure
```text
animations/ (Global Git Repo - Tracks data, prompts, config)
├── .gitignore
├── GEMINI.md
├── README.md
├── data/              <-- Shared GeoJSON maps (usa.json, antarctica.json, etc.)
├── prompt/            <-- Documentation, rules, and prompt guidelines
└── usa-antartica/     <-- Local Project Git Repo (Ignored by Global Repo)
```

---

## ⚡ Benefits & Sustainability

As we scale up to **100s of animation projects**, this architecture provides key benefits:

### 1. Zero Repository Bloat (Highly Sustainable)
Video projects accumulate heavy binary assets (images, audio, and large `.mp4` renders) which would quickly crash a single global repository. By keeping each project in its own repository, GitHub file size limits are never breached.

### 2. Clean & Automated Parent `.gitignore`
Using the exclusion pattern (`/*` combined with `!/data/`, etc.), any new project directories created in the future are **automatically ignored** by the parent repository. You never have to manually edit the global `.gitignore` when starting a new animation.

### 3. Shared Resources, No Duplication
Large geospatial files (e.g. `india.json` which is ~12MB) are stored once in the global `data/` folder and imported into projects relatively (e.g. `../../../data/usa.json`). This saves gigabytes of disk space and duplicate file management.

### 4. Code Portability
Because individual projects are separate Git repositories, they remain self-contained. If you want to deploy, share, or render a specific animation on a remote server/render farm, you can push or clone just that individual project repository.
