# 🎙️ ASR Leaderboard

![GitHub](https://img.shields.io/github/license/ysdede/asr_leaderboard)
![React](https://img.shields.io/badge/React-18.2.0-61dafb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.0-38b2ac)
![Vite](https://img.shields.io/badge/Vite-5.0.8-646cff)

A dynamic and interactive leaderboard for Automatic Speech Recognition (ASR) models. While the current implementation focuses on Turkish ASR models, the project is designed to be universal and can be easily adapted for other languages and datasets.

## 🌟 Key Features

- **Universal Architecture**: Designed for easy adaptation to different languages and datasets
- **Real-time Data**: Fetches the latest benchmark results directly from Hugging Face datasets
- **Interactive Tables**: Sort and filter ASR models by various performance metrics
- **Multi-Dataset Support**: View performance across different speech datasets
- **Responsive Design**: Optimized for both desktop and mobile viewing
- **Dark/Light Mode**: Automatically adapts to user's Hugging Face theme preference for seamless viewing experience
- **Automated Deployment**: Seamless deployment to Hugging Face Spaces

## 📊 Metrics Displayed

- **WER (Word Error Rate)**: Lower is better
- **CER (Character Error Rate)**: Lower is better
- **Cosine Similarity**: Higher is better
- **Speed**: Real-time factor (higher is better)

## 🚀 Live Demo

Visit the Turkish ASR Leaderboard demo at [Hugging Face Spaces](https://huggingface.co/spaces/ysdede/turkish_asr_leaderboard)

## 🛠️ Technology Stack

- **Frontend**: React, Tailwind CSS
- **Build Tool**: Vite
- **Deployment**: Hugging Face Spaces
- **Data Source**: Hugging Face Datasets

## 🔧 Local Development

### Prerequisites

- Node.js (v16 or later)
- npm or yarn

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/ysdede/asr_leaderboard.git
   cd asr_leaderboard
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## 📦 Building for Production

```bash
npm run build
# or
yarn build
```

## 🚢 Deployment

The project includes a custom deployment script for Hugging Face Spaces:

```bash
npm run deploy-to-hf
# or
yarn deploy-to-hf
```

## 🔄 Adapting for Other Languages/Projects

This leaderboard is designed to be easily adapted for other languages or ASR projects:

1. **Data Source**: Update the data source URL in `src/components/App.jsx` to point to your benchmark dataset
2. **Customization**: Modify the column headers and metrics as needed in the configuration files
3. **Metadata**: Update the Hugging Face Space configuration in `space_template/README.md`
4. **Deployment**: Deploy to your own Hugging Face Space with a single command

We're actively working on adding more customization settings to make adaptation even easier. Future updates will include:
- Configuration files for language-specific settings
- Templates for different types of speech datasets
- Documentation for adapting the project to new languages

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [Hugging Face](https://huggingface.co/) for hosting the datasets and Spaces
- All contributors to the Turkish ASR models featured in the leaderboard
- The React and Tailwind CSS communities for their excellent tools

## 📬 Contact

For questions, suggestions, or contributions, please open an issue on GitHub or reach out to the repository owner.