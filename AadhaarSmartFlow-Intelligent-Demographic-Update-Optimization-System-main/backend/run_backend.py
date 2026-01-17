# run_backend.py - Wrapper to run backend with error logging
import sys
import traceback

try:
    import app
    print("App module loaded successfully")
    print("Starting Flask server...")
    app.app.run(host='0.0.0.0', port=5000, debug=True)
except Exception as e:
    with open('backend_error.log', 'w') as f:
        f.write(f"Error: {str(e)}\n")
        f.write(traceback.format_exc())
    print(f"ERROR: {e}")
    traceback.print_exc()
    sys.exit(1)
