import { ArrowDownNarrowWide, ArrowDownWideNarrow, ArrowUpNarrowWide } from 'lucide-react'
import React from 'react'

type Props = {
  asc?: boolean
  toggleOrder: () => void
}

const OrderToggle = ({ asc, toggleOrder }: Props) => {
  return (
    <button className='text-gray-900 border-2 p-1 rounded-md hover:bg-gray-50 shadow-sm focus:border-gray-800' onClick={toggleOrder}>
      {
        asc ?
          <ArrowUpNarrowWide className='w-6 h-6' />
          : <ArrowDownWideNarrow className='w-6 h-6' />
      }
    </button>
  )
}

export default OrderToggle