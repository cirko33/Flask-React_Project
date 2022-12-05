#!/bin/sh
export FLASK_APP=./Engine/app.py
source $(pipenv --venv)/bin/activate
flask run -h 0.0.0.0 -p 5000