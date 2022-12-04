# Using alpine image
FROM python:3.9-alpine

# Installing packages
RUN apk --update --no-cache add python3-dev libffi-dev gcc musl-dev make libevent-dev build-base
RUN pip install --no-cache-dir pipenv

# Defining working directory
WORKDIR /usr/src/app

# Adding source code
COPY Pipfile Dockerfile ./
COPY Engine ./Engine

#Install API dependencies
RUN pipenv install

#START APP AND SERVERS
EXPOSE 5000
#ENRTYPOINT