# Using ubuntu image
FROM ubuntu:22.04

# Defining working directory
WORKDIR /bin

# Installing programs
RUN apt-get update
RUN apt-get -y python3
RUN apt-get -y install mysql-server-8.0

# ISPOD MOZEMO DODAVATI FAJLOVE PROJEKTA
#COPY FAJLOVI

#START APP AND SERVERS
#EXPOSE port