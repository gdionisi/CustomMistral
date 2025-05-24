# Custom Mistral Chat

A modern chat interface built with React and TypeScript, powered by Mistral AI.

## Features

- Modern, responsive UI built with React and Tailwind CSS
- Real-time chat with Mistral AI
- Persistent chat history
- TypeScript for better type safety and developer experience
- Clean and maintainable code structure

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Mistral AI API key

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd custom-mistral
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory and add your Mistral AI API key:
```
REACT_APP_MISTRAL_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm start
# or
yarn start
```

The application will be available at `http://localhost:3000`.

## Project Structure

```
src/
  ├── types/         # TypeScript type definitions
  ├── store/         # State management with Zustand
  ├── services/      # API and external service integrations
  ├── components/    # React components
  ├── App.tsx        # Main application component
  └── index.tsx      # Application entry point
```

## Technologies Used

- React
- TypeScript
- Tailwind CSS
- Zustand (State Management)
- Mistral AI SDK

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
