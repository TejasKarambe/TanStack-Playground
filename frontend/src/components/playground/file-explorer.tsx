import React from 'react'
import {
  FileCode,
  FileText,
  Folder,
  FolderOpen,
  RotateCcw,
  Code2,
} from 'lucide-react'

interface FileExplorerProps {
  files: string[]
  activeFile: string
  dirtyFiles: Set<string>
  onSelectFile: (file: string) => void
  onResetFile?: (file: string) => void
}

interface TreeNode {
  name: string
  path: string
  isFolder: boolean
  children: Record<string, TreeNode>
}

function buildTree(paths: string[]): TreeNode {
  const root: TreeNode = { name: 'root', path: '', isFolder: true, children: {} }

  paths.forEach((fullPath) => {
    // Strip leading slash if present
    const cleanPath = fullPath.startsWith('/') ? fullPath.slice(1) : fullPath
    const parts = cleanPath.split('/')
    let current = root

    parts.forEach((part, index) => {
      const isFile = index === parts.length - 1
      const currentFullPath = '/' + parts.slice(0, index + 1).join('/')

      if (!current.children[part]) {
        current.children[part] = {
          name: part,
          path: currentFullPath,
          isFolder: !isFile,
          children: {},
        }
      }
      current = current.children[part]
    })
  })

  return root
}

function getFileIcon(name: string) {
  if (name.endsWith('.tsx') || name.endsWith('.jsx')) {
    return <Code2 className="h-3.5 w-3.5 text-sky-400" />
  }
  if (name.endsWith('.ts') || name.endsWith('.js')) {
    return <FileCode className="h-3.5 w-3.5 text-amber-400" />
  }
  if (name.endsWith('.json')) {
    return <FileText className="h-3.5 w-3.5 text-emerald-400" />
  }
  return <FileText className="h-3.5 w-3.5 text-muted-foreground" />
}

export function FileExplorer({
  files,
  activeFile,
  dirtyFiles,
  onSelectFile,
  onResetFile,
}: FileExplorerProps) {
  const [openFolders, setOpenFolders] = React.useState<Record<string, boolean>>({
    '/api': true,
    '/types': true,
    '/components': true,
    '/src': true,
  })

  const toggleFolder = (path: string) => {
    setOpenFolders((prev) => ({ ...prev, [path]: !prev[path] }))
  }

  const tree = React.useMemo(() => buildTree(files), [files])

  const renderNodes = (node: TreeNode, depth = 0) => {
    return Object.values(node.children).map((child) => {
      if (child.isFolder) {
        const isOpen = openFolders[child.path] ?? true
        return (
          <div key={child.path} className="select-none">
            <button
              onClick={() => toggleFolder(child.path)}
              style={{ paddingLeft: `${depth * 12 + 8}px` }}
              className="flex items-center gap-1.5 w-full py-1 text-left text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xs transition-colors"
            >
              {isOpen ? (
                <FolderOpen className="h-3.5 w-3.5 text-amber-500/80" />
              ) : (
                <Folder className="h-3.5 w-3.5 text-amber-500/80" />
              )}
              <span className="truncate">{child.name}</span>
            </button>
            {isOpen && renderNodes(child, depth + 1)}
          </div>
        )
      }

      const isActive = activeFile === child.path
      const isDirty = dirtyFiles.has(child.path)

      return (
        <div
          key={child.path}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          className={`group flex items-center justify-between pr-2 py-1 text-xs font-mono cursor-pointer rounded-xs transition-colors ${
            isActive
              ? 'bg-primary/10 text-primary font-semibold'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
          }`}
          onClick={() => onSelectFile(child.path)}
        >
          <div className="flex items-center gap-1.5 truncate">
            {getFileIcon(child.name)}
            <span className="truncate">{child.name}</span>
            {isDirty && (
              <span
                title="Unsaved changes"
                className="h-1.5 w-1.5 rounded-full bg-amber-500 inline-block shrink-0"
              />
            )}
          </div>

          {isDirty && onResetFile && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onResetFile(child.path)
              }}
              title="Reset file to starter code"
              className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-all"
            >
              <RotateCcw className="h-3 w-3" />
            </button>
          )}
        </div>
      )
    })
  }

  return (
    <div className="h-full flex flex-col bg-card/60 border-r border-border select-none">
      <div className="px-3 py-2 border-b border-border text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
        <span>Files</span>
        <span className="text-[10px] lowercase font-normal opacity-70">
          {files.length} items
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5 scrollbar-thin">
        {renderNodes(tree)}
      </div>
    </div>
  )
}

