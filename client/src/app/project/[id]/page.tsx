"use client";

import { useState } from "react";



type Props = {
    params: {id:string};
}
const Project = ({params} : Props) => {
    const {id} = params;
    const [activeTab , setActiveTab] = useState("Board")
    return (
        <div>
            <ProjectHeader activeTab={activeTab} setActiveTab = {setActiveTab} />
        </div>
    )
}