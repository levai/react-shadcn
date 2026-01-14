import { ErrorBoundary } from 'react-error-boundary'
import { Result, Button, Typography } from 'antd'

const { Paragraph, Text } = Typography

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Result
        status="error"
        title="应用发生错误"
        subTitle="抱歉，应用遇到了一个错误。请刷新页面重试。"
        extra={[
          <Button type="primary" key="reload" onClick={() => window.location.reload()}>
            刷新页面
          </Button>,
        ]}
      >
        <div className="text-left">
          <Paragraph>
            <Text strong>错误详情：</Text>
          </Paragraph>
          <Paragraph>
            <pre className="text-xs bg-muted p-3 rounded-md overflow-auto max-w-2xl">
              {error.message}
            </pre>
          </Paragraph>
        </div>
      </Result>
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
