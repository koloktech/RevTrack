# 🏎️ RevTrack - Fuel Consumption Tracker

RevTrack is a high-performance PWA for car enthusiasts to track fuel consumption, efficiency, and telemetry. Built with React, Tailwind CSS, and Recharts.

## 🚀 Automated Deployment Guide

This repository is pre-configured with **GitHub Actions** for automatic deployment to GitHub Pages.

### 1. Setup Repository
1. Create a new repository on GitHub (e.g., `revtrack`).
2. Initialize your local folder and push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/revtrack.git
   git push -u origin main
   ```

### 2. Enable GitHub Pages
1. Go to your repository on GitHub.com.
2. Navigate to **Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, select **GitHub Actions** from the dropdown menu.

### 3. Automated Workflow
* Every time you push to the `main` branch, the `.github/workflows/deploy.yml` script will:
  1. Install all dependencies.
  2. Build the production-ready application.
  3. Deploy the `dist/` folder to GitHub Pages.
* Monitor progress in the **Actions** tab of your repository.

### 4. (Optional) Gemini API Key
If you decide to add AI-powered features later:
1. Go to **Settings** > **Secrets and variables** > **Actions**.
2. Click **New repository secret**.
3. Name: `API_KEY` | Value: `your-google-api-key`.
4. The workflow is already configured to inject this during the build process.

## 🛠️ Local Development
To run this project locally:
1. `npm install`
2. `npm run dev`

---
*Built for the speed of the track. Track your efficiency, own the road.*
