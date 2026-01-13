import { ErrorBoundary } from 'react-error-boundary'
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

interface ErrorBoundaryProviderProps {
  children: React.ReactNode
}

/**
 * 错误边界 Provider
 * 捕获应用中的运行时错误并显示友好的错误界面
 */
export function ErrorBoundaryProvider({ children }: ErrorBoundaryProviderProps) {
  return <ErrorBoundary FallbackComponent={ErrorFallback}>{children}</ErrorBoundary>
}
