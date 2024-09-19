# Start from the official Node.js Alpine image
FROM node:18.17.1-alpine As builder

# Install Python and pip
RUN apk add --no-cache python3 py3-pip

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy only the backend files (this avoids copying unnecessary files from monorepo)
COPY . .

# Install Node.js dependencies
RUN yarn install --frozen-lockfile


# Build the backend
RUN yarn build

# Copy the Python scripts and requirements from the monorepo into the backend container
# Assuming the python scripts are in /packages/python-scripts relative to the backend
COPY ./python-scripts /usr/src/app/dist/python-scripts

# Install Python dependencies
RUN pip install --no-cache-dir -r ./dist/python-scripts/requirements.txt

# Expose the application port
EXPOSE 443

# Start the application
CMD ["node", "dist/main"]
