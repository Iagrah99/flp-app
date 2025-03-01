🍽️ FLP App

A React Native mobile application for managing and tracking meals.

🚀 Getting Started

Follow the steps below to set up the project and get it running on your local machine.

📂 Project Setup

1⃣ Clone the Repository

git clone https://github.com/YOUR_GITHUB_USERNAME/flp-app.git
cd flp-app

2⃣ Install Dependencies

Ensure you have Node.js installed. Then, install all required dependencies:

npm install

or if using Yarn:

yarn install

🔑 API Key Setup (Required)

This project requires an API key for TinyPNG (or other services).Since we are not using .env files, we store API keys securely in config.js, which is ignored by Git.

1⃣ Get Your API Key

Sign up for a TinyPNG API Key at: 🔗 TinyPNG Developer Portal

Copy your API key.

2⃣ Create config.js and Add Your API Key

The file config.js is not included in the repository for security reasons.To add your own API key:

Copy config.example.js to config.js

cp config.example.js config.js

Edit config.js and replace YOUR_API_KEY_HERE with your actual API key.

📌 Final config.js (Example)

const config = {
  TINYPNG_API_KEY: "your_real_tinypng_api_key",
};

export default config;

3⃣ Verify config.js is Ignored by Git

To keep API keys secure, ensure config.js is in .gitignore:

config.js

💚 Done! Your API key is now securely stored.

📱 Running the Project

For Android & iOS (Expo)

npm start

or

expo start

🔹 To run on a specific platform:

npm run android   # For Android
npm run ios       # For iOS (Mac Only)

🔧 Troubleshooting

1⃣ Metro Bundler Issues

If you run into errors like "module not found", try clearing the cache:

npm start -- --reset-cache

or for Expo:

expo start -c

2⃣ API Key Not Found

If you get "API Key Not Found" errors:

Ensure config.js exists.

Make sure config.js contains the correct API key.

Restart the app after adding the API key.

🤝 Contributing

Fork the repository

Create a feature branch (git checkout -b feature-name)

Commit your changes (git commit -m "Added a new feature")

Push to the branch (git push origin feature-name)

Submit a pull request

📝 License

This project is licensed under the MIT License.

🎉 Thanks for Using FLP App! 🚀

Happy coding! If you have any issues, feel free to open an issue or contact the project owner.

