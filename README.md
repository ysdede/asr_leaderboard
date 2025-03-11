# 🎙️ Turkish ASR Leaderboard

![GitHub](https://img.shields.io/github/license/ysdede/asr_leaderboard)
![React](https://img.shields.io/badge/React-18.2.0-61dafb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.0-38b2ac)
![Vite](https://img.shields.io/badge/Vite-5.0.8-646cff)

A dynamic and interactive leaderboard for Turkish Automatic Speech Recognition (ASR) models. This project automatically fetches benchmark results from a Hugging Face dataset, parses the data, and presents it in an organized, sortable table format.

## 🌟 Features

- **Real-time Data**: Fetches the latest benchmark results directly from Hugging Face datasets
- **Interactive Tables**: Sort and filter ASR models by various performance metrics
- **Multi-Dataset Support**: View performance across different Turkish speech datasets
- **Responsive Design**: Optimized for both desktop and mobile viewing
- **Dark/Light Mode**: Toggle between themes for comfortable viewing in any environment
- **Automated Deployment**: Seamless deployment to Hugging Face Spaces

## 📊 Metrics Displayed

- **WER (Word Error Rate)**: Lower is better
- **CER (Character Error Rate)**: Lower is better
- **Cosine Similarity**: Higher is better
- **Speed**: Real-time factor (higher is better)

## 🚀 Live Demo

Visit the live leaderboard at [Hugging Face Spaces](https://huggingface.co/spaces/ysdede/turkish_asr_leaderboard)

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

This leaderboard can be easily adapted for other languages or ASR projects:

1. Update the data source URL in `src/components/App.jsx` to point to your benchmark dataset
2. Modify the column headers and metrics as needed
3. Update the Hugging Face Space configuration in `space_template/README.md`
4. Deploy to your own Hugging Face Space

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [Hugging Face](https://huggingface.co/) for hosting the datasets and Spaces
- All contributors to the Turkish ASR models featured in the leaderboard
- The React and Tailwind CSS communities for their excellent tools

## 📬 Contact

For questions, suggestions, or contributions, please open an issue on GitHub or reach out to the repository owner.