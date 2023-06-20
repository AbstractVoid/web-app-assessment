import React from 'react'
import { classNames } from '@/shared/helpers'

const Container: React.FC<{
  children?: React.ReactNode
  parentClass?: string
}> = ({ children, parentClass }) => {
  return (
    <div className={classNames(parentClass, 'w-full flex')}>
      <div className={classNames(parentClass, 'mx-auto w-[1400px]')}>{children}</div>
    </div>
  )
}

export default Container
