---
description: How to run the Aadhaar Smart Flow project manually
---

To run the project manually, you need to start both the backend and the frontend in separate terminals.

### 1. Start Backend (Flask)
// turbo
```powershell
cd AadhaarSmartFlow-Intelligent-Demographic-Update-Optimization-System-main/backend
python run_backend.py
```
*Note: Make sure your Python environment is active if you are using one.*

### 2. Start Frontend (React/Vite)
// turbo
```powershell
cd AadhaarSmartFlow-Intelligent-Demographic-Update-Optimization-System-main
npm run dev
```

### 3. Access the App
Once both servers are running:
- Frontend: [http://localhost:8080](http://localhost:8080)
- Backend API: [http://localhost:5000/api/health](http://localhost:5000/api/health)
