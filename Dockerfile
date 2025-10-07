# # Build step container
# FROM python:3.11.9-alpine AS build
# WORKDIR /work
# COPY . /work/
# RUN apk update && \
#     apk add --virtual build-deps gcc python3-dev musl-dev && \
#     apk --no-cache add -Uu \
#     make curl binutils build-base mariadb-dev && \
#     pip install pyinstaller && \
#     pip install --upgrade pip && \
#     pip install -r ./requirments.txt && \
#     make build


# # Main application container
# FROM python:3.11.9-alpine
# COPY --from=build /work/dist/run /bin/app
# EXPOSE 80
# CMD ["/bin/app"]

# -----------------------------------------------------------------

# ---- Base Python environment ----
FROM python:3.11.9-alpine

# Set working directory
WORKDIR /app

# Copy only the dependency list first (for caching)
COPY requirments.txt .

# Install build dependencies and Python packages
RUN apk add --no-cache gcc musl-dev mariadb-dev && \
    pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirments.txt

# Copy the actual app code
COPY . .

# Expose port 80 to match ECS and your ALB
EXPOSE 80

# Run the app directly with Python
CMD ["python", "run.py"]
