# Using alpine image
FROM python:3.9-alpine

# Installing packages
RUN apk --update --no-cache add python3-dev libffi-dev gcc musl-dev make libevent-dev build-base mysql-client
RUN pip install --no-cache-dir pipenv

# Defining working directory
WORKDIR /usr/src/app

ENV PYTHONPATH="/usr/src/app/Engine"

# Adding source code
COPY Pipfile Dockerfile bootstrap.sh docker-compose.yml ./
COPY Engine/ ./Engine

#Install API dependencies
RUN pipenv install

#START APP AND SERVERS
EXPOSE 5000-5000
ENTRYPOINT ["/usr/src/app/bootstrap.sh"]