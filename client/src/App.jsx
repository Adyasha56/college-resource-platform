import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <div className="bg-yellow-100 min-h-screen flex flex-col">
      <main className="flex-grow">
        <AppRoutes />
      </main>
    </div>
  );
}

export default App;