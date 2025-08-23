# 🎮 XenXO – The Unbeatable Tic-Tac-Toe AI

XenXO is a web-based Tic-Tac-Toe game where you face an **unbeatable AI** built with the **Minimax algorithm + Alpha-Beta pruning**.  
Deployed on **Vercel**, powered by **Next.js** and **MongoDB Atlas**, XenXO starts as a simple MVP and grows step by step into a full-fledged multiplayer game.

---

## 🚀 Features (MVP → Future Roadmap)

### ✅ Current (MVP)

- Play Tic-Tac-Toe against an unbeatable AI.
- Clean, responsive UI built with **Next.js + Tailwind**.
- AI decision-making powered by **Minimax with Alpha-Beta pruning**.
- Deployed on **Vercel** for instant online access.

### 🔜 Planned Features

- **Game history & stats** → Store results in MongoDB.
- **User authentication** → Track personal win/loss records.
- **Multiplayer mode** → Real-time PvP using WebSockets.
- **Leaderboards & Analytics** → Global ranking + move heatmaps.
- **Difficulty levels** → Easy (random), Medium (heuristics), Hard (unbeatable).

---

## 🛠 Tech Stack

**Frontend:**  

- [Next.js](https://nextjs.org/) – React framework for production-ready apps.  
- [Tailwind CSS](https://tailwindcss.com/) – Utility-first CSS framework.  

**Backend:**  

- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction) – Serverless backend logic.  
- [Minimax Algorithm](https://en.wikipedia.org/wiki/Minimax) with Alpha-Beta pruning for unbeatable AI.  

**Database (future phases):**  

- [MongoDB Atlas](https://www.mongodb.com/atlas) – Cloud database to store game results & user data.  

**Deployment:**  

- [Vercel](https://vercel.com/) – Seamless hosting for Next.js apps.  

---

## 📂 Project Structure

``` bash
xenxo/
──src
    |──│── pages/
    ├── index.js # Game UI
    └── api/
    └── move.js # AI logic endpoint
──components/
    └── Board.js # Tic-Tac-Toe board component
── globals.css # Tailwind styles
── utils/
  └── minimax.js # Minimax algorithm implementation
── README.md

```

## 🧩 How It Works (MVP)

1. User clicks on a cell in the 3×3 grid.  
2. The frontend sends the board state to `/api/move`.  
3. The API runs the **Minimax algorithm** to calculate the best possible move.  
4. The AI’s move is returned and rendered on the board.  
5. Game continues until **win/loss/draw**.  

---

## 📈 Roadmap

- **Phase 1 (MVP)** – Unbeatable AI (✔ Done)  
- **Phase 2** – Game history + MongoDB integration  
- **Phase 3** – Authentication & user-specific stats  
- **Phase 4** – Real-time multiplayer with WebSockets  
- **Phase 5** – Leaderboards, analytics, difficulty levels  

---

## 🧠 Learning Outcomes

XenXO is not just a game – it’s a **stepwise learning project**:  

- **Phase 1:** Minimax algorithm, serverless API basics, Vercel deployment.  
- **Phase 2:** Database integration with MongoDB, storing structured data.  
- **Phase 3:** Authentication & authorization flows.  
- **Phase 4:** WebSockets, real-time communication, multiplayer logic.  
- **Phase 5:** Data visualization, analytics, scalability.  

---

## 🖥️ Running Locally

```bash
# Clone the repo
git clone https://github.com/your-username/xenxo.git
cd xenxo

# Install dependencies
npm install

# Run the dev server
npm run dev

```

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you’d like to add.
