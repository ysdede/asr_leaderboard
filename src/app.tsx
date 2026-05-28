import { MetaProvider } from '@solidjs/meta'
import { Router, Route } from '@solidjs/router'
import Home from './routes/index'

export default function App() {
  return (
    <MetaProvider>
      <Router root={(props) => props.children}>
        <Route path="/" component={Home} />
      </Router>
    </MetaProvider>
  )
}
