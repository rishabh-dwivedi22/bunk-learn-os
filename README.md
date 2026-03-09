# Bunk & Learn OS

> **Because textbook OS algorithms are too abstract for 2 AM pre-exam cramming.**

Bunk & Learn OS is a minimalist, interactive web application designed to help computer science students visualize complex Operating System concepts. Built with React and Vite, this tool transforms dry mathematical algorithms into dynamic, step-by-step visual animations.

## Features

This visualizer focuses on three core Operating System modules:

### 1. CPU Scheduling
Watch processes compete for CPU time on a dynamically generating Gantt Chart.
* **First-Come, First-Served (FCFS)**
* **Shortest Job First (SJF - Non-Preemptive)**
* **Round Robin (RR)** * *Calculates and displays Turnaround Time (TAT) and Waiting Time (WT).*

### 2. Memory Management
Visualize how RAM is allocated to arriving processes using a dynamic memory grid.
* **First Fit Allocation**
* **Best Fit Allocation**
* *Visually highlights internal fragmentation and empty memory holes.*

### 3. Disk Scheduling
Trace the mechanical movement of a hard disk read/write head across tracks.
* **Shortest Seek Time First (SSTF)**
* **SCAN (The Elevator Algorithm)**
* *Calculates total head movement with a clear line-chart visualization.*

---

## Tech Stack

This project was intentionally designed as a pure client-side application for zero-latency animations and straightforward deployment.

* **Framework:** React 18 + Vite
* **Styling:** Tailwind CSS (Strict minimalist/brutalist SaaS aesthetic)
* **Icons:** Lucide-React
* **Architecture:** 100% Frontend (No backend or database overhead)

---

## Project Structure

A quick glance at how the logic is separated from the UI:

```text
src/
 |-- components/       # React UI Components
 |   |-- GanttChart.jsx # Visualizes CPU timelines
 |   |-- MemoryGrid.jsx # Visualizes RAM blocks
 |   |-- DiskChart.jsx  # Visualizes head movements
 |-- utils/            # Pure JavaScript Math/Logic
 |   |-- SchedulerLogic.js
 |   |-- MemoryLogic.js
 |   |-- DiskLogic.js
 |-- App.jsx           # Main layout and state management
 |-- index.css         # Tailwind directives
