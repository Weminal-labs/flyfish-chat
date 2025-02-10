// import { useState } from 'react'
import { Transition } from '@headlessui/react'
interface LogsProps {
  logs: string[]
}

const JsonLogger = ({ logs }: LogsProps) => {
  return (
    <div className="p-6 max-w-4xl mx-auto">

      <div className="space-y-3">
        {logs && logs.map((log, index) => (
          <Transition
            key={index}
            appear={true}
            show={true}
            enter="transition-all ease-out duration-300"
            enterFrom="opacity-0 translate-x-10"
            enterTo="opacity-100 translate-x-0"
            leave="transition-all ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="p-4 bg-gray-800 rounded-lg group relative">
              <pre className="text-sm text-gray-100 overflow-x-auto">
                <code>
                  {JSON.stringify(log, null, 2)}
                </code>
              </pre>

              {/* Copy Button */}
              <button
                onClick={() => navigator.clipboard.writeText(JSON.stringify(log, null, 2))}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-700 p-1 rounded"
              >
                📋
              </button>
            </div>
          </Transition>
        ))}
      </div>
    </div>
  )
}

export default JsonLogger
