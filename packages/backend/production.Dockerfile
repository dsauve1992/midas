# Start from the official Node.js Alpine image
FROM node:18.17.1-alpine As builder

# Install Python and pip
RUN apk add --no-cache py3-pip

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy only the backend files (this avoids copying unnecessary files from monorepo)
COPY . .

# Install Node.js dependencies
RUN yarn install --frozen-lockfile


# Build the backend
RUN yarn build


WORKDIR /usr/src/app/dist/python-scripts
# Install Python dependencies
RUN pip install virtualenv
RUN python3 -m venv venv
RUN source venv/bin/activate
RUN pip install -r requirements.txt

WORKDIR /usr/src/app
# Expose the application port
EXPOSE 443

# Start the application
CMD ["node", "dist/main"]
