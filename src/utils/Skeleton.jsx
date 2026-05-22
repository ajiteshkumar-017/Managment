import React from 'react'

function Skeleton() {
  return (
    <div className="space-y-3">

  <div className="relative h-5 w-1/2 overflow-hidden rounded bg-slate-300">
    <div className="absolute inset-0">
      <div className="h-full w-1/3 animate-shimmer bg-gradient-to-r from-transparent via-white to-transparent opacity-90" />
    </div>
  </div>

  <div className="relative h-4 w-1/3 overflow-hidden rounded bg-slate-300">
    <div className="absolute inset-0">
      <div className="h-full w-1/3 animate-shimmer bg-gradient-to-r from-transparent via-white to-transparent opacity-90" />
    </div>
  </div>

  <div className="relative h-4 w-2/3 overflow-hidden rounded bg-slate-300">
    <div className="absolute inset-0">
      <div className="h-full w-1/3 animate-shimmer bg-gradient-to-r from-transparent via-white to-transparent opacity-90" />
    </div>
  </div>

</div>
  )
}

export default Skeleton