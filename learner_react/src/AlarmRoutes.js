import React from 'react';
import {Route, Routes} from 'react-router-dom';
import AlarmList from "./pages/alarm/AlarmList";

const AlarmRoutes = () => (
    <Routes>
        <Route path="/list" element={<AlarmList/>}/>
    </Routes>
)


export default AlarmRoutes;
