
## Front End

---

### Requirements

- Node.js
- npm (Node package manager)

---

### How to run 

1. In project directory, run: 
    ```
    npm install
    ```
2. Start local development server  
    ```
    npm run dev
    ```
 
---


## Backend


---

### Requirements

Before running the backend, make sure you have:

- Python 3.9+
- pip (Python package manager)

---

### How to run 

1. In backend directory, run: 
    ```
    pip install -r requirements.txt
    ```
2. Start the server using 
    ```
    uvicorn main:app --reload --port 8000
    ```
   - `--reload`: Enables hot-reloading 
   - `--port 8000`: Server will run at `http://localhost:8000`


---

### API Endpoints

Once the server is running, you can test these endpoints in your browser



###  Root
- Confirms the server is running  
- **GET** [`http://localhost:8000/`](http://localhost:8000/)


###  All Subjects (Hardcoded for now)  
- **GET** [`http://localhost:8001/api/subjects`](http://localhost:8001/api/subjects)



###  All Courses for a Subject  
- **GET** `/api/courses?subject=<SUBJECT>&term_code=<TERM_CODE>`

- **Example**: [`http://localhost:8001/api/courses?subject=CIS&term_code=202503`](http://localhost:8001/api/courses?subject=CIS&term_code=202503)


###  All Courses for All Subjects  

- **GET** `/api/all-courses?term_code=<TERM_CODE>`

- **Example**: [`http://localhost:8001/api/all-courses?term_code=202503`](http://localhost:8001/api/all-courses?term_code=202503)

---

### Swagger UI 
You can also test the APIs in this interactive UI: [`http://localhost:8001/docs`](http://localhost:8001/docs)

---

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.