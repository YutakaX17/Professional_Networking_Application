import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

const worker = typeof window !== 'undefined' ? setupWorker(...handlers) : null

if (typeof window !== 'undefined') {
}

export { worker }