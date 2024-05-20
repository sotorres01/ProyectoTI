FROM tiangolo/uvicorn-gunicorn:python3.11

COPY . /app

WORKDIR /app

RUN pip install --no-cache-dir --upgrade -r ./requirements.txt

CMD ["uvicorn", "API.application.main:app", "--host", "0.0.0.0", "--port", "80"]

