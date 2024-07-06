@echo off

rem Navigate to the directory where the server should run
cd ./docs

rem Start http-server with desired options
http-server --port 8080 --cors
