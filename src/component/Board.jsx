import React, { useState, useEffect } from 'react'
import Card from './Card';
import Navbar from './Navbar';
import './Board.css'
import axios from 'axios';
const Board = () => {
    const [data,setData] = useState(null);
    const [order, setOrder] = useState(null);
    const [group, setGroup] = useState(null);
    const [isDataLoaded,setIsDataLoaded] = useState(false)
    const [isOptionsLoaded,setIsOptionsLoaded] = useState(false)
    const [sortedData, setSortedData] = useState(null)
    const [isFiltered, setIsFiltered] = useState(false)
    
    const priority = {
        0: "No Priority",
        1: "Low",
        2: "Medium",
        3: "High",
        4: "Urgent"
    }

    const getFilters = async () => {
        const filters = await JSON.parse(localStorage.getItem('freecell-assignment'))
        if (filters) {
            setOrder(filters.order ? filters.order : "priority");
            setGroup(filters.group ? filters.group : "status");
        } else {
            setOrder("priority");
            setGroup("status");
        }
        setIsOptionsLoaded(true);
    }

    const getData = async () => {
        const tickets = await axios.get("https://api.quicksell.co/v1/internal/frontend-assignment");
        setData(tickets.data);
        setIsDataLoaded(true);
    }

    useEffect(() => {
        getFilters();
        getData();
    }, []);

    useEffect(() => {
        if (isDataLoaded && isOptionsLoaded) {
            const tickets = data.tickets;
            const filteredTickets = tickets.sort((a, b) => {
                if (order === 'title') {
                    return a.title.localeCompare(b.title);
                } else {
                    return b.priority - a.priority;
                }
            });
            let groupedTickets = {};
            
            filteredTickets.forEach((ticket) => {
                let groupValue;
                if (group === "user") {
                    groupValue = ticket["userId"];
                } else {
                    groupValue = ticket[group];
                }
                if (!groupedTickets[groupValue]) {
                    groupedTickets[groupValue] = [];
                }
                groupedTickets[groupValue].push(ticket);
                
            });
            
            const jsonToArray = Object.entries(groupedTickets);
            jsonToArray.sort((a,b) => a[0].localeCompare(b[0]));

            groupedTickets = Object.fromEntries(jsonToArray);

            if (group === "priority") {
                groupedTickets = Object.keys(groupedTickets).reduce((acc, key) => {
                    const newKey = priority[key];
                    acc[newKey] = groupedTickets[key];
                    return acc;
                },{})
            }

            if (group === "user") {
                let users = {}
                data.users.forEach((user) => {
                    users[user.id] = user.name
                })

                groupedTickets = Object.keys(groupedTickets).reduce((acc, key) => {
                    const newKey = users[key];
                    acc[newKey] = groupedTickets[key];
                    return acc;
                },{})
            }
            setSortedData(groupedTickets);
            setIsFiltered(true)
        }
    },[order, group, isDataLoaded, isOptionsLoaded])
  return (
    <div className='board-wrapper'>
        <Navbar
            order = {order}
            group = {group}
            setOrder = {setOrder}
            setGroup = {setGroup}
        />
        <div className="scroll-container">
            <div className="cards-container">
                {isFiltered && Object.entries(sortedData).map(([title,value], index) => (
                    <div className='cards-column' key={index}>
                        <div className='column-title'>
                            <h2> {title}</h2>
                        </div>
                        <div className='cards'>
                            {value.map((ticket, ticketIndex) => (
                                <div className="ticket-card" key={ticketIndex}>
                                    <Card ticket={ticket}/>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  )
}

export default Board
