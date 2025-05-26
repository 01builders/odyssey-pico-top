import { AlertTriangle, TrendingUp, TrendingDown, Activity, DollarSign } from "lucide-react"

interface ActionBoxProps {
  metric: string
  value: string
  zone: string
  color: string
  action: string
}

export default function ActionBox({ metric, value, zone, color, action }: ActionBoxProps) {
  const getColorClasses = (color: string) => {
    switch (color) {
      case "red":
        return {
          bg: "bg-red-50 dark:bg-red-950",
          border: "border-red-200 dark:border-red-800",
          text: "text-red-700 dark:text-red-300",
          icon: "text-red-500",
        }
      case "orange":
        return {
          bg: "bg-orange-50 dark:bg-orange-950",
          border: "border-orange-200 dark:border-orange-800",
          text: "text-orange-700 dark:text-orange-300",
          icon: "text-orange-500",
        }
      case "yellow":
        return {
          bg: "bg-yellow-50 dark:bg-yellow-950",
          border: "border-yellow-200 dark:border-yellow-800",
          text: "text-yellow-700 dark:text-yellow-300",
          icon: "text-yellow-500",
        }
      case "green":
        return {
          bg: "bg-green-50 dark:bg-green-950",
          border: "border-green-200 dark:border-green-800",
          text: "text-green-700 dark:text-green-300",
          icon: "text-green-500",
        }
      case "blue":
        return {
          bg: "bg-blue-50 dark:bg-blue-950",
          border: "border-blue-200 dark:border-blue-800",
          text: "text-blue-700 dark:text-blue-300",
          icon: "text-blue-500",
        }
      default:
        return {
          bg: "bg-gray-50 dark:bg-gray-950",
          border: "border-gray-200 dark:border-gray-800",
          text: "text-gray-700 dark:text-gray-300",
          icon: "text-gray-500",
        }
    }
  }

  const getIcon = () => {
    if (color === "red") return <TrendingDown className="w-5 h-5" />
    if (color === "green" || color === "blue") return <TrendingUp className="w-5 h-5" />
    if (color === "orange") return <AlertTriangle className="w-5 h-5" />
    return <Activity className="w-5 h-5" />
  }

  const colors = getColorClasses(color)

  return (
    <div className={`rounded-lg border-2 p-4 ${colors.bg} ${colors.border}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={colors.icon}>{getIcon()}</div>
          <span className={`font-semibold ${colors.text}`}>{metric}</span>
        </div>
        <span className={`text-lg font-bold ${colors.text}`}>{value}</span>
      </div>
      <div className={`text-sm ${colors.text} mb-1`}>
        Zone: <span className="font-medium">{zone}</span>
      </div>
      <div className={`text-sm font-medium ${colors.text} flex items-center gap-1`}>
        <DollarSign className="w-4 h-4" />
        {action}
      </div>
    </div>
  )
}
