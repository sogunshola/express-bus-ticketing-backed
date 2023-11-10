# Bus Ticketing Platform

The Bus Ticketing Platform is a web application that allows users to manage bus tickets, perform transactions, and manage their wallets.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Local Setup](#local-setup)
  - [Docker Setup](#docker-setup)
- [Usage](#usage)
- [API Documentation](#api-documentation)

## Prerequisites

- Node.js (version 14 or higher)
- Yarn package manager
- Docker and Docker Compose (for Docker setup)

## Installation

### Local Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/sogunshola/express-bus-ticketing-backed.git
   cd express-bus-ticketing-backed
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

3. Copy the `.env.example` file to `.env.development.local`:

   ```bash
   cp .env.example .env
   ```

4. Run migrations and seed the database:

   ```bash
   yarn migrate:run
   yarn seed:run
   ```

### Docker Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/sogunshola/express-bus-ticketing-backed.git
   cd express-bus-ticketing-backed
   ```

2. Build the Docker image:

   ```bash
   docker-compose build
   ```

3. Run migrations and seed the database:

   ```bash
   docker-compose run web yarn migrate
   docker-compose run web yarn seed
   ```

## Usage

- To start the server locally:

  ```bash
  yarn dev
  ```

- To start the server using Docker:

  ```bash
  docker-compose up
  ```

- Access the application at [http://localhost:3000](http://localhost:3000)

## API Documentation

The Postman API documentation can be found in the [API Documentation](https://elements.getpostman.com/redirect?entityId=4889283-51a9c67d-fbfc-44f6-84ed-d30399edc6eb&entityType=collection) file.
