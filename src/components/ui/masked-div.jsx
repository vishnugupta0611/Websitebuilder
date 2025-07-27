import React from 'react'

const MaskedDiv = ({ children, maskType = 'type-1', size = 1, className = '' }) => {
  const getMaskStyle = (type) => {
    const masks = {
      'type-1': {
        clipPath: 'polygon(0% 0%, 100% 0%, 85% 100%, 0% 100%)',
        width: size === 0.45 ? '45%' : '100%'
      },
      'type-2': {
        clipPath: 'polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)',
        width: size === 0.45 ? '45%' : '100%'
      },
      'type-3': {
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 80%, 0% 100%)',
        width: '100%'
      },
      'type-4': {
        clipPath: 'polygon(0% 20%, 100% 0%, 100% 100%, 0% 100%)',
        width: '100%'
      }
    }
    return masks[type] || masks['type-1']
  }

  const maskStyle = getMaskStyle(maskType)

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{
        clipPath: maskStyle.clipPath,
        width: maskStyle.width,
        minHeight: '200px'
      }}
    >
      {children}
    </div>
  )
}

export default MaskedDiv