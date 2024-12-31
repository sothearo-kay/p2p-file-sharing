# p2p file sharing

A peer-to-peer file sharing application built with React, Node.js, and Socket.IO. This project enables users to share files over the same network with real-time updates.

## Features

- **File Sharing**: Share files easily between devices on the same network.
- **Real-time Updates**: Uses WebSocket for real-time file-sharing updates.
- **Simple UI**: Built with React and TailwindCSS for a clean and user-friendly interface.

## Project Structure

The project is divided into two main parts:

- **Client**: The front-end application built with React and Vite.
- **Server**: The back-end server powered by Node.js, Express, and Socket.IO.

```
p2p-file-sharing/
├── client/     # Frontend React application
├── server/     # Backend Node.js server
└── package.json # Root configuration for managing both client and server
```

## Installation

Clone the repository and install dependencies for both the client and server:

```
git clone https://github.com/sothearo-kay/p2p-file-sharing.git
cd p2p-file-sharing
npm install
```

## Scripts

Run the following scripts from the root directory:

- **Install Dependencies**:

  ```
  npm install
  ```

  Installs dependencies for both the client and server.

- **Start Development Servers**:

  ```
  npm run dev
  ```

  Runs both the client and server development servers concurrently.

- **Build for Production**:

  ```
  npm run build
  ```

  Builds both the client and server for production.

## Configuration

### Environment Variables

Create `.env` files in the `client` directory as needed. Use `.env.example` as a reference.

### Example `.env` for Client

```
VITE_YOUR_IP=x.x.x.x
```

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m 'Add feature'`.
4. Push to the branch: `git push origin feature-name`.
5. Create a pull request.

---

Happy sharing!
