import React, {useState} from 'react'
import {RiArrowDropDownLine} from 'react-icons/ri'
import {LuSettings2} from 'react-icons/lu'
import './Navbar.css'

const Navbar = (props) => {
    const [showDropdown,setShowDropdown] = useState(false);
    const [showGroupDropdown,setShowGroupDropdown] = useState(false);
    const [showOrderDropdown,setShowOrderDropdown] = useState(false);
    const Groups = ["status", "user", "priority"];
    const Order = ["priority", "title"];

    const handleClick = () => {
        setShowDropdown(!showDropdown)
        setShowGroupDropdown(false);
        setShowOrderDropdown(false);
    }

    const handleGroupingClick = () => {
        setShowGroupDropdown(!showGroupDropdown);
        setShowOrderDropdown(false);
    }

    const handleOrderingClick = () => {
        setShowOrderDropdown(!showOrderDropdown);
        setShowGroupDropdown(false);
    }
    
    const handleGroupClick = async (option) => {
        props.setGroup(option);
        let savedData = await JSON.parse(localStorage.getItem("freecell-assignment"))
        if (savedData) {
            savedData.group = option
        }  else {
            savedData = {
                "group" : option
            }
        }
        localStorage.setItem("freecell-assignment",JSON.stringify(savedData))
        setShowGroupDropdown(false);
    }
    
    const handleOrderClick = async (option) => {
        props.setOrder(option);
        let savedData = await JSON.parse(localStorage.getItem("freecell-assignment"))
        if (savedData) {
            savedData.order = option;
        }  else {
            savedData = {
                "order" : option
            }
        }
        localStorage.setItem("freecell-assignment",JSON.stringify(savedData))
        setShowOrderDropdown(false);
    }

  return (
    <div className='navbar-wrapper'>
        <div>
            <button 
                className="filter-button" 
                onClick={handleClick} 
            >
                <div className="filter-icon">
                    <LuSettings2/>
                </div>
                <span className=''>Display</span>
                <div className='filter-arrow'>
                    <RiArrowDropDownLine/>
                </div>
            </button>
        </div>
        {
            showDropdown && 
            <div className="filter-dropdown">
                <div 
                    className="filter-option"
                >
                    <div className='filter-option-text'>
                        Grouping
                    </div>
                    <button 
                        className="filter-option-button"
                        onClick={handleGroupingClick}
                    >
                        <div className='option-text'>
                            {props.group}
                        </div>
                        <div className='option-icon'>
                            <RiArrowDropDownLine/>
                        </div>
                    </button>
                </div>
                <div 
                    className="filter-option"
                >
                    <div className='filter-option-text'>
                        Ordering
                    </div>
                    <button 
                        className="filter-option-button"
                        onClick={handleOrderingClick}
                    >
                    <div className='option-text'>
                            {props.order}
                        </div>
                        <div className='option-icon'>
                            <RiArrowDropDownLine/>
                        </div>
                    </button>
                </div>
            </div>
        }
        {showGroupDropdown && (
        <div className="groupDropdown">
            { Groups.map((option,index) => (
                <div key={index} className="dropDown-options" onClick={()=> handleGroupClick(option)}>
                    {option}
                </div>
            ))}
        </div>
        )}
        {showOrderDropdown && (
        <div className="orderDropdown">
            { Order.map((option,index) => (
                <div key={index} className="dropDown-options" onClick={()=> handleOrderClick(option)}>
                    {option}
                </div>
            ))}
        </div>
        )}
    </div>
  )
}

export default Navbar
