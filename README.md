# Pod Planner

A modern message scheduling application for Farcaster, designed to help you plan and schedule your messages with ease.

<img src="/src/frontend/public/images/The%20Pod%20Logo.png" width="200" alt="Pod Planner Logo">

## Features

- 📝 Compose and schedule messages
- 📅 Flexible scheduling with timezone support
- 💾 Draft message support
- 🖼️ Image upload (up to 2 images)
- 📱 Mobile-friendly interface
- ⚡ Real-time character count with visual feedback
- 🌙 Dark mode support

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- Yarn package manager
- A Farcaster account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/whoskite/Pod-Planner.git
cd Pod-Planner
```

2. Install dependencies:
```bash
yarn install
```

3. Create a `.env` file in the root directory and add your environment variables:
```env
NEYNAR_API_KEY=your_api_key
```

4. Start the development server:
```bash
yarn dev
```

The application will be available at `http://localhost:3000`.

## Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **Styling**: CSS Modules
- **API Integration**: Farcaster API via Neynar
- **State Management**: React Hooks
- **Build Tool**: Yarn

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

- GitHub: [@whoskite](https://github.com/whoskite)
- Farcaster: @kite

## Acknowledgments

- Thanks to the Farcaster team for providing the API
- Thanks to Neynar for the API infrastructure
- Special thanks to all contributors and users
