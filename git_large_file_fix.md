# Fixing Git Large File Push Errors

## The Problem
Sometimes when working on Remotion animations, a large rendered video file (like `out.mp4`) accidentally gets committed to the Git repository. When you try to push to GitHub, the push will fail or hang indefinitely because GitHub has strict file size limits (usually 100MB), and transferring large files over Git is very slow.

Even if you delete the file in a subsequent commit, Git still stores the file in the repository's history, meaning the large file will still try to upload when you run `git push`.

## The Solution

To remove the large file completely from your outgoing commits without losing your other code changes, you can use the **soft reset** technique. 

We used the following steps to fix the issue:

1. **Reset to Origin Main (Soft Reset)**
   ```bash
   git reset --soft origin/main
   ```
   *What this does:* This command takes all the changes from your recent local commits (the one where you added the video, and the one where you deleted it) and un-commits them, placing the net changes back into your staging area. Because the file was added then deleted, it mathematically cancels out and is completely removed from the staging area.

2. **Commit the Clean Changes**
   ```bash
   git commit -m "Your clean commit message"
   ```
   *What this does:* This creates a brand new, single commit containing only your actual code changes, with absolutely no trace of the large `out.mp4` file in its history.

3. **Push to GitHub**
   ```bash
   git push origin main
   ```
   *What this does:* Your push will now succeed instantly because the massive video file is no longer part of the commit history.

## Prevention
To prevent this in the future, ensure that `*.mp4` (or specific paths like `kosovo-serbia/out.mp4`) are added to your `.gitignore` file before running `git add .`.
