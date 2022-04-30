import * as React from 'react';
import NxWelcome from './nx-welcome';
import { Link, Route, Routes } from 'react-router-dom';

const AdminFrontendCard = React.lazy(
  () => import('admin-frontend-card/Module')
);

const AdminFrontendTalk = React.lazy(
  () => import('admin-frontend-talk/Module')
);

export function App() {
  return (
    <React.Suspense fallback={null}>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>

        <li>
          <Link to="/admin-frontend-card">AdminFrontendCard</Link>
        </li>

        <li>
          <Link to="/admin-frontend-talk">AdminFrontendTalk</Link>
        </li>
      </ul>
      <Routes>
        <Route path="/" element={<NxWelcome title="admin-frontend-shell" />} />

        <Route path="/admin-frontend-card" element={<AdminFrontendCard />} />

        <Route path="/admin-frontend-talk" element={<AdminFrontendTalk />} />
      </Routes>
    </React.Suspense>
  );
}

export default App;
