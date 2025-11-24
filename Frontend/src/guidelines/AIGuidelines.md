# TUK-pedestrianSafety AI Guidelines

This file contains rules and guidelines for the AI to follow when working on the TUK-pedestrianSafety project.

## Project Context
This project is a **Pedestrian Safety System** that detects objects and assesses risk levels using sensors.
- **Goal**: Visualize risk events and sensor health status.
- **Tech Stack**: Vite + TypeScript, Vanilla CSS.

## Domain Rules

### Risk Levels & Color Coding
Represent risk levels with the following colors to ensure intuitive visualization:
- **Danger (위험)**: Red (e.g., `#FF4D4D` or similar alert color) - High risk, immediate attention.
- **Warning (경고)**: Orange/Yellow (e.g., `#FFA500`) - Potential risk.
- **Safety (안전)**: Green (e.g., `#4CAF50`) - Safe state.

### Terminology (Korean)
Use the following Korean terms for UI display:
- **Risk**: "위험"
- **Warning**: "경고"
- **Safety**: "안전"
- **Vehicle**: "차량"
- **Unknown**: "미확인" or "알 수 없음"

## General Guidelines
- **Layouts**: Only use absolute positioning when necessary. Opt for responsive and well-structured layouts that use flexbox and grid by default.
- **Code Quality**: Refactor code as you go to keep code clean.
- **File Structure**: Keep file sizes small and put helper functions and components in their own files.

## Coding Guidelines

### TypeScript & Architecture
- **Strict Mode**: Ensure all code is strictly typed.
- **Service Layer**: Use the Service Layer pattern. Keep data fetching logic in `src/services/`.
- **Mock API**: Currently using `mockApi.ts`. Ensure code is written such that switching to a real API later is seamless (interface-based).

### UI/UX
- **Visual Hierarchy**: Emphasize "Danger" events visually over "Safety" events.
- **Responsiveness**: Ensure the dashboard is readable on different screen sizes.
