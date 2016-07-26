#!/bin/bash
 
echo -n "var a1_jobs = " > a1_jobs.js
echo -n "var nb_jobs = " > nb_jobs.js

wget "https://dobjobs.org/cd?cd=304&jobtype=A1&limit=30" -O- >> "a1_jobs.js"
wget "https://dobjobs.org/cd?cd=304&jobtype=NB&limit=30" -O- >> "nb_jobs.js"

# semicolon love
echo -n ";" >> a1_jobs.js
echo -n ";" >> nb_jobs.js

