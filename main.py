# uvicorn main:app --reload
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
import subprocess
import sys
import os
from pathlib import Path
import traceback
from datetime import datetime
import json

app = FastAPI()

BASE_DIR = Path(__file__).resolve().parent

async def run_agent(agent_file):
    try:
        agent_path = BASE_DIR / agent_file
        print(f"Versuche Agent auszuführen: {agent_path}")
        if not agent_path.exists():
            print(f"Agent file not found: {agent_path}")
            return False

        env = os.environ.copy()
        env["PYTHONPATH"] = str(BASE_DIR)

        process = subprocess.run(
            [sys.executable, str(agent_path)],
            env=env,
            cwd=str(BASE_DIR),
            capture_output=True,
            text=True,
            check=False
        )

        if process.stdout:
            print(f'Agent Output:\n{process.stdout}')
        if process.stderr:
            print(f'Agent Error:\n{process.stderr}')

        success = process.returncode == 0
        print(f"Process return code: {process.returncode}")
        return success

    except Exception as e:
        print(f'Error running agent: {str(e)}')
        traceback.print_exc()
        return False

@app.post("/login")
async def login(request: Request):
    try:
        data = await request.json()
        username = data.get('username')
        password = data.get('password')

        if username == "admin" and password == "secret":
            return JSONResponse(content={
                "success": True,
                "message": "Login erfolgreich"
            })
        else:
            return JSONResponse(content={
                "success": False,
                "message": "Ungültige Anmeldedaten"
            }, status_code=401)
    except Exception as e:
        return JSONResponse(content={
            "success": False,
            "message": str(e)
        }, status_code=500)

@app.post("/execute-agent")
async def execute_agent(request: Request):
    try:
        print("\n=== Starting Agent Execution ===")
        data = await request.json()
        agent_type = data.get('type')
        datetime_data = data.get('datetime', {})
        excel_data = data.get('excelData')

        print(f"Requested agent type: {agent_type}")
        print(f"Incident datetime: {datetime_data}")
        print(f"Excel data received: {'Yes' if excel_data else 'No'}")

        if agent_type not in ['diebstahl', 'sachbeschaedigung']:
            print(f"Invalid agent type: {agent_type}")
            return JSONResponse(content={
                "success": False,
                "message": "Ungültiger Agent-Typ"
            })

        incident_data = {
            'type': agent_type,
            'datetime': datetime_data,
            'excel_data': excel_data if excel_data else None,
            'timestamp': datetime.now().isoformat()
        }

        filename = f"incident_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(incident_data, f, indent=2, ensure_ascii=False)

        agent_file = 'Agent.py' if agent_type == 'diebstahl' else 'Agent_2.py'
        print(f"Selected agent file: {agent_file}")

        success = await run_agent(agent_file)
        response_data = {
            "success": success,
            "message": "Agent erfolgreich ausgeführt" if success else "Fehler bei der Agent-Ausführung",
            "incident_id": filename
        }

        print(f"Execution completed. Success: {success}")
        return JSONResponse(content=response_data)

    except Exception as e:
        error_msg = f"Fehler: {str(e)}"
        print(f"Error in execute_agent: {error_msg}")
        traceback.print_exc()
        return JSONResponse(content={
            "success": False,
            "message": error_msg
        })

# Update the path to point to the correct build directory
BUILD_DIR = BASE_DIR / "../my-app/build"
if not BUILD_DIR.exists():
    print(f"Warning: Build directory {BUILD_DIR} not found. React app may not be built yet.")
    # Fallback to current directory for development
    BUILD_DIR = BASE_DIR / "my-app/build"

app.mount("/", StaticFiles(directory=str(BUILD_DIR), html=True), name="root")

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return """
    <!DOCTYPE html>
    <html lang="de">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Meldungssystem</title>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
      </head>
      <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <div id="root"></div>
       <script src="/js/main.js"></script>
      </body>
    </html>
    """

if __name__ == "__main__":
    import uvicorn
    print(f"Starting server from directory: {BASE_DIR}")
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)
