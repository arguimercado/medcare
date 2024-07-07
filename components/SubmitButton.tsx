import React, { ReactNode } from 'react'
import { Button } from './ui/button'
import Image from 'next/image'

interface IProps {
    isLoading?: boolean
    clasName?: string
    children?: ReactNode
}

const SubmitButton = ({isLoading,clasName,children}: IProps) => {
  return (
    <Button type="submit" disabled={isLoading} className={clasName ?? 'shad-primary-btn w-full'}>
        {isLoading ? (
            <div className='flex items-center gap-4'>
                <Image 
                    src="/assets/icons/loader.svg"
                    alt="loader"
                    width={24}
                    height={24}
                    className='animate-spin'

                />
                Loadin...
            </div>
        ) : children}
    </Button>
  )
}

export default SubmitButton