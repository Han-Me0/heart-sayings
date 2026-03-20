.phony: ping
ping:
	echo "pong"

.phony: build
build:
	pyinstaller -w -F --add-data="app/templates:app/templates" --add-data="app/static:app/static" run.py

.phony: clean
clean:
	rm -rf ./build ./dist run.spec

.phony: start-db
start-db:
	docker run --rm -p 3306:3306 --name mysql \
	-v ".\volume\mysqldb:/var/lib/mysql/" \
	-v "..\mysql_migrations:/migrations" \
	-e "LANG=C.UTF-8" \
	-e "MYSQL_ROOT_PASSWORD=password" \
	-d mysql:8.4.3 \
	--character-set-server=utf8mb4 \
	--collation-server=utf8mb4_unicode_ci \
	--mysql-native-password=ON

.phony: stop-db
stop-db:
	docker stop mysql

.phony: build-container
build-container:
	docker build -t app:latest -f Dockerfile .

.phony: run-container
run-container:
	docker run --name app -d --rm \
	-e "MYSQL_HOST=localhost" \
	-e "MYSQL_PORT=3306" \
	-e "MYSQL_USER=root" \
	-e "MYSQL_PASSWORD=password" \
	-e "MYSQL_DB=idioms" \
	-e "FLASK_APP=idioms" \
	-e "FLASK_ENV=production" \
	-e "FLASK_DEBUG=True" \
	-p 8080:80 app:latest

.phony: stop-container
stop-container:
	docker stop app

.phony: run
run:
	docker run --name app -d --rm \
	-e "MYSQL_HOST=172.17.0.2" \
	-e "MYSQL_PORT=3306" \
	-e "MYSQL_USER=root" \
	-e "MYSQL_PASSWORD=115599" \
	-e "MYSQL_DB=idioms" \
	-e "FLASK_APP=idioms" \
	-e "FLASK_ENV=production" \
	-e "FLASK_DEBUG=True" \
	-p 8080:80 app:latest

.phony: apache
apache:
	docker run --rm -d -p 8080:80 \
	-e "MYSQL_HOST=172.17.0.2" \
	-e "MYSQL_PORT=3306" \
	-e "MYSQL_USER=root" \
	-e "MYSQL_PASSWORD=115599" \
	-e "MYSQL_DB=idioms" \
	-e "FLASK_APP=idioms" \
	-e "FLASK_ENV=production" \
	-e "FLASK_DEBUG=True" \
	--name flask-apache flask-apache
