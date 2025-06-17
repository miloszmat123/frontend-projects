Full-Stack Project: Backend (FastAPI) + Frontend (React, Angular, Svelte)

This project includes a backend built with FastAPI and three frontend applications using React, Angular, and Svelte. Below are the instructions to set up and run each part of the project.

Project Structure

/my-project
│
├── /backend             # FastAPI Backend
│   ├── app              # FastAPI code here
│   ├── requirements.txt # Python dependencies
│   └── .gitignore       # (Optional: can have its own gitignore)
│
├── /angular-todo        # Angular Todo App
├── /react-todo          # React Todo App
├── /svelte-todo         # Svelte Todo App
└── .gitignore           # Global gitignore for everything


Step 1: Running the Backend (FastAPI)

1. Set Up the Python Virtual Environment

1. Navigate to the backend directory:

   cd backend

2. Create a virtual environment (if you haven't already):

   python3 -m venv venv

3. Activate the virtual environment:

   - For macOS/Linux:

     source venv/bin/activate

   - For Windows (Command Prompt):

     venv\Scripts\activate

   - For Windows (PowerShell):

     .\venv\Scripts\Activate.ps1

2. Install Backend Dependencies

Install the required Python dependencies from the requirements.txt file:

pip install -r requirements.txt

3. Start FastAPI Server

After installing the dependencies, start the FastAPI server using Uvicorn on port 8000:

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

- app.main:app points to the FastAPI instance (adjust this if your app structure is different).
- --reload allows the server to auto-reload when code changes.
- --host 0.0.0.0 makes the server accessible from any device (use localhost or 127.0.0.1 if you just need it to be available on your local machine).
- --port 8000 runs the server on port 8000.

The FastAPI backend should now be accessible at http://localhost:8000.


Step 2: Running the Frontend Projects

1. Running React (React-Todo)

1. Navigate to the React project folder:

   cd frontend/react-todo

2. Install the required dependencies:

   npm install

3. Start the React development server:

   npm start

The React app will be available at http://localhost:3000 by default.

2. Running Angular (Angular-Todo)

1. Navigate to the Angular project folder:

   cd frontend/angular-todo

2. Install the required dependencies:

   npm install

3. Run the Angular development server:

   ng serve

The Angular app will be available at http://localhost:4200 by default.

3. Running Svelte (Svelte-Todo)

1. Navigate to the Svelte project folder:

   cd frontend/svelte-todo

2. Install the required dependencies:

   npm install

3. Run the Svelte development server:

   npm run dev

The Svelte app will be available at http://localhost:5000 by default.


Step 3: Verify the Setup

Once everything is running, you should be able to access the following:

- Backend (FastAPI): Open http://localhost:8000 in your browser.
- React: Open http://localhost:3000 in your browser.
- Angular: Open http://localhost:4200 in your browser.
- Svelte: Open http://localhost:5000 in your browser.


Step 4: Accessing the Backend from the Frontend

Your frontend applications (React, Angular, Svelte) will likely need to interact with the FastAPI backend.

Make sure that the frontend code is making requests to http://localhost:8000 (or the correct URL where your FastAPI app is running).

For example, in React, you might use fetch to send requests to the backend:

fetch('http://localhost:8000/api/endpoint')
  .then(response => response.json())
  .then(data => console.log(data));

Make sure to handle CORS in your FastAPI backend to allow requests from the different ports where your frontend applications are running.


Conclusion

- Backend (FastAPI):
  - Set up a virtual environment.
  - Install dependencies from requirements.txt.
  - Start the FastAPI server with uvicorn on port 8000.

- Frontend (React, Angular, Svelte):
  - Install dependencies using npm install.
  - Start the development server for each framework:
    - React: npm start (default port 3000)
    - Angular: ng serve (default port 4200)
    - Svelte: npm run dev (default port 5000)

