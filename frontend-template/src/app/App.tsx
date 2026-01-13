import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'
import { ErrorBoundary } from 'react-error-boundary'
import { AppRouter } from '@/routes'
import { Button } from '@/shared/ui'

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className='min-h-screen flex items-center justify-center bg-destructive/10'>
      <div className='text-center p-8'>
        <h1 className='text-2xl font-bold text-destructive mb-4'>应用发生错误</h1>
        <pre className='text-sm text-muted-foreground bg-muted p-4 rounded-md'>{error.message}</pre>
        <div className='mt-4'>
          <Button onClick={() => window.location.reload()}>刷新页面</Button>
        </div>
      </div>
    </div>
  )
}

export function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ThemeProvider attribute='class' defaultTheme='dark' enableSystem>
        <AppRouter />
        <Toaster position='top-right' richColors />
      </ThemeProvider>
    </ErrorBoundary>
  )
}
