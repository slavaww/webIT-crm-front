import React, { useState, useEffect } from "react";
import apiClient from "../api/axiosConfig";
import { minutesToHours } from "../utils/minutesToHours";

const TotalTaskTime = ({ taskId, startTime="2025-01-01", refreshTrigger }) => {
  const [totalTaskTime, setTotalTaskTime] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams();

    if (startTime) {
      params.append('start', startTime);
    }

    if (taskId) {
      params.append('task', taskId);
    }

    params.append('total', 1);
    
    const queryString = params.toString();

    apiClient.get(`/time_spends${queryString ? `?${queryString}` : ''}`)
      .then(response => {
        setTotalTaskTime(minutesToHours(response.data['member'][0]));
      })
      .catch( (err) => {
        console.error(err);
    });
  }, [taskId, startTime, refreshTrigger]);

  return  <div className="total-time">
            <i className="bi bi-hourglass-split"> </i> 
            <span className="total-hours">{totalTaskTime.hours}</span>
            <span className="total-hours-label"> ч. </span>
            <span className="total-minutes">{totalTaskTime.minutes}</span>
            <span className="total-minutes-label"> мин.</span>
          </div>;
};

export default TotalTaskTime;