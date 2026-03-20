# HEART SAYINGS

### This is a simple application that provides a list of idioms and expressions with the word HEART in different languages.

This project is a web application built with Flask that connects to a MySQL database to display Heart sayindg (idioms and expressions). You can interact with the project via Docker containers or directly from your local machine.

NOTE: please note that this is only backend and frontent. It doesn't contain any default data. All information should be received from database.

### Requirments

- Data base connection.
  Application configured to work with mysql database. (version 9.1.0).
  For correct functioning it is neccessary to set `hostname`, `database_name`, `username`, `password` to be able to connect to database. Application configured to fetch information from the `.evn` or environment variables (prioritized over .evn file).
  e.g.:

  `.env file`

  ```
  MYSQL_HOST="hostname"
  MYSQL_USER="username"
  MYSQL_PASSWORD="password"
  MYSQL_DB="database_name"
  MYSQL_DATABASE_CHARSET="utf8mb4"
  MYSQL_CHARSET="utf8mb4"
  FLASK_ENV="development"
  FLASK_DEBUG="True"
  FLASK_RUN_HOST="0.0.0.0"
  ```

`environment variables`

```
export MYSQL_HOST="hostname"
export MYSQL_USER="username"
export MYSQL_PASSWORD="password"
export MYSQL_DB="database_name"
export MYSQL_DATABASE_CHARSET="utf8mb4"
export MYSQL_CHARSET="utf8mb4"
```

### Build locally:

It is possible to build application as all-in-one artifact or start as python application with `python` command

- All-in-one:

  - `pip install -r requirements.txt`
  - `pip install pyinstaller`
  -

  ```
  pyinstaller -w -F \
  --add-data="app/templates:app/templates" \
  --add-data="app/static:app/static" run.py
  ```

Created artefact `run` you can find in new creared folder `dist`.

- Python command run
  - `pip install -r requirments.txt`
  - `python run.py`

### Build docker:

- `docker build -t app:latest -f Dockerfile .`

### Run docker contener:

```
	docker run --name app -d --rm \
	-e "MYSQL_HOST=placeholder" \
	-e "MYSQL_USER=placeholder" \
	-e "MYSQL_PASSWORD=placeholder" \
	-e "MYSQL_DB=placeholder" \
	-p 8080:80 app:latest
```

NOTE: don't forget to pass required environment variables for DB MySQL connection with `-e` option for `docker run` command;

### DB Migration

- Migrations file for creating database with an table and data you can find in mysql_migrations map. There is available file `idioms.sql` that contain necessary db/table/value creation.

  - connect to your database
  - run `source ./mysql_migrations/idioms.sql` or copy data from file to any DB viewer
