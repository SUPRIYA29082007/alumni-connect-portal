import React from "react";

export const departments=[
  "CSE",
  "CSM",
  "CSD",
  "ECE",
  "EEE",
  "MECH",
  "CIVIL",
  "IT",
  "AIML",
  "MBA",
  "MCA"
];

export const years=Array.from(
  {length:new Date().getFullYear()-2001+1},
  (_,i)=>new Date().getFullYear()-i
);

export function DepartmentDropdown({value,onChange,all=false,required=true}){
  return(
    <select value={value} onChange={onChange} required={required&&!all}>
      <option value="">{all?"All Departments":"Select Department"}</option>
      {departments.map(d=><option key={d} value={d}>{d}</option>)}
    </select>
  );
}

export function YearDropdown({value,onChange,all=false,required=true}){
  return(
    <select value={value} onChange={onChange} required={required&&!all}>
      <option value="">{all?"All Graduation Years":"Select Graduation Year"}</option>
      {years.map(y=><option key={y} value={y}>{all?`Class of ${y}`:y}</option>)}
    </select>
  );
}
