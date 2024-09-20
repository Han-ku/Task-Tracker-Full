import React from 'react';
import { Tooltip } from 'react-tooltip';
import Zoom from '@mui/material/Zoom';

const TooltipHistory = ({ groupedHistory, tooltipId }) => {

    return (
        <Tooltip 
            id={tooltipId}
            className="history_tooltip" 
            place="left" 
            TransitionComponent={Zoom}
            delayShow={200} 
            clickable={true}
            >
                <div>
                    <h2>History</h2>
                    <ul>
                        {Object.entries(groupedHistory).map(([date, entries]) => (
                            <React.Fragment key={date}>
                            <li id='history_date'><strong>{date}</strong></li>
                            {entries.map((entry, i) => (
                                <React.Fragment key={i}>
                                    <li>{entry.action} at {entry.date.split(' ')[1]}</li>
                                    {i < entries.length - 1 && <hr />}
                                </React.Fragment>
                            ))}
                            </React.Fragment>
                        ))}
                    </ul>
                </div>
        </Tooltip>
    )
}

export default TooltipHistory