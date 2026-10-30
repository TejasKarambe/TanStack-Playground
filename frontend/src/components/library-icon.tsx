import React from 'react'
import {
  Database,
  Table,
  Network,
  CheckSquare,
  Layers,
  Zap,
  HardDrive,
  Box,
  Gauge,
  Wrench,
  Sliders,
  Keyboard,
  Sparkles,
  BookOpen,
} from 'lucide-react'

interface LibraryIconProps extends React.SVGProps<SVGSVGElement> {
  name: string
  className?: string
}

export function LibraryIcon({ name, className = 'h-4 w-4', ...props }: LibraryIconProps) {
  switch (name) {
    case 'Database':
      return <Database className={className} {...props} />
    case 'Table':
      return <Table className={className} {...props} />
    case 'Network':
      return <Network className={className} {...props} />
    case 'CheckSquare':
      return <CheckSquare className={className} {...props} />
    case 'Layers':
      return <Layers className={className} {...props} />
    case 'Zap':
      return <Zap className={className} {...props} />
    case 'HardDrive':
      return <HardDrive className={className} {...props} />
    case 'Box':
      return <Box className={className} {...props} />
    case 'Gauge':
      return <Gauge className={className} {...props} />
    case 'Wrench':
      return <Wrench className={className} {...props} />
    case 'Sliders':
      return <Sliders className={className} {...props} />
    case 'Keyboard':
      return <Keyboard className={className} {...props} />
    case 'Sparkles':
      return <Sparkles className={className} {...props} />
    default:
      return <BookOpen className={className} {...props} />
  }
}

