import React, { useState, useRef, useEffect } from 'react'
import './Card.css'

const Card = ({ticket}) => {
  const [isExpanded,setIsExpanded] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleCardClick  = () => {
    setIsExpanded(!isExpanded);
  }

  return (
    <div 
      className={`card-wrapper ${isExpanded ? 'expanded-wrapper' : ''}`}
      onClick={handleCardClick}
      ref={cardRef}
    >
      <div className='card-header'>
        <div className="card-id">
            {ticket.id}
        </div>
      </div>
      <div className={`card-title ${isExpanded ? 'expanded-title' : ''}`}>
        {ticket.title}
      </div>
      <div className="card-details">
        {ticket.tag[0]}
      </div>
    </div>
  )
}

export default Card
