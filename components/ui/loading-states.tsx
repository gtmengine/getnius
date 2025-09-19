import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface LoadingStateProps {
  className?: string
}

export function SearchLoadingState({ className }: LoadingStateProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  )
}

export function TableLoadingState({ rows = 5, columns = 4, className }: LoadingStateProps & { rows?: number; columns?: number }) {
  return (
    <div className={cn("space-y-3", className)}>
      <Skeleton className="h-8 w-full" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex space-x-4">
          {Array.from({ length: columns }).map((_, j) => (
            <Skeleton key={j} className="h-6 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

export function CardLoadingState({ className }: LoadingStateProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </CardContent>
    </Card>
  )
}

export function GridLoadingState({ items = 6, className }: LoadingStateProps & { items?: number }) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", className)}>
      {Array.from({ length: items }).map((_, i) => (
        <CardLoadingState key={i} />
      ))}
    </div>
  )
}

export function ProgressLoadingState({ steps, currentStep, className }: LoadingStateProps & { steps: string[]; currentStep: number }) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Processing...</h3>
        <span className="text-sm text-gray-500">{currentStep + 1}/{steps.length}</span>
      </div>
      <div className="space-y-2">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className={cn(
              "w-4 h-4 rounded-full",
              index < currentStep ? "bg-green-500" : 
              index === currentStep ? "bg-blue-500 animate-pulse" : 
              "bg-gray-200"
            )} />
            <span className={cn(
              "text-sm",
              index <= currentStep ? "text-gray-900" : "text-gray-500"
            )}>
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
