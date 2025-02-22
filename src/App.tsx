import { Provider } from 'react-redux';
import { store } from './store/store';
import KeywordOptimizer from './components/KeywordOptimizer';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <KeywordOptimizer />
    </Provider>
  );
};

export default App;