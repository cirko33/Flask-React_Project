#Using mysql image
FROM mysql:8.0

RUN chown -R mysql:root /var/lib/mysql/

#Setting database parameters 
ENV MYSQL_ROOT_PASSWORD = root
ENV MYSQL_DATABASE = drsdb
ENV MYSQL_USER = drs
ENV MYSQL_PASSWORD = drs22
ENV MYSQL_DATABASE_HOST = localhost
ENV MYSQL_PORT=3306

#Start mysql server
EXPOSE 3306


# Using alpine image
FROM python:3.9-alpine

# Installing packages
RUN apk --update --no-cache add python3-dev libffi-dev gcc musl-dev make libevent-dev build-base
RUN pip install --no-cache-dir pipenv

# Defining working directory
WORKDIR /usr/src/app

ENV PYTHONPATH="/usr/src/app/Engine"

# Adding source code
COPY Pipfile Dockerfile bootstrap.sh ./
COPY Engine/ ./Engine

#Install API dependencies
RUN pipenv install

#START APP AND SERVERS
EXPOSE 5000-5000
ENTRYPOINT ["/usr/src/app/bootstrap.sh"]