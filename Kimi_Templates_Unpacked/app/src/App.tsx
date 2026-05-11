import { Routes, Route } from 'react-router-dom';
import { IndexPage } from '@/pages/IndexPage';
import { TemplatePage } from '@/pages/TemplatePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<IndexPage />} />
      <Route path="/template/:id" element={<TemplatePage />} />
    </Routes>
  );
}

export default App;
