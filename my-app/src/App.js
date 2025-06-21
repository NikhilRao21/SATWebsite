import React, { useState } from "react";
import './index.css';

const set = {
    test: "Math",
    domain: "Algebra",
    skill: "No Filter",
    difficulty: "No Filter",
    amount: "0",
    bluebookUse: "No"
};

const skillsHierarchy = {
  "Reading and Writing": {
    "Craft and Structure": [
      "Words in Context",
      "Text, Structure, and Purpose", 
      "Cross Text Connections"
    ],
    "Information and Ideas": [
      "Central Ideas and Details",
      "Command of Evidence",
      "Inferences"
    ],
    "Standard English Conventions": [
      "Boundaries",
      "Form, Structure, and Sense"
    ],
    "Expression of Ideas": [
      "Rhetorical Synthesis",
      "Transitions"
    ],
    "No Filter" : ["No Filter"]
  },
  "Math": {
    "Algebra": [
      "Linear Equations In One Variable",
      "Linear Equations In Two Variables",
      "Linear Functions",
      "Systems of Two Linear Equations In Two Variables",
      "Linear Inequalities In One Or Two Variables"
    ],
    "Advanced Math": [
      "Equivalent Expressions",
      "Nonlinear Equations In One Variable And Systems Of Equations In Two Variables",
      "Nonlinear Functions"
    ],
    "Problem Solving and Data Analysis": [
      "Ratios, Rates, Proportional Relationships And Units",
      "Percentages",
      "Probability and Conditional Probability",
      "One Variable Data Distributions And Measures Of Center And Spread",
      "Inference From Sample Statistics And Margin Of Error",
      "Evaluating Statistical Claims Observational Studies And Experiments",
      "Two variable data models and scatterplots"
    ],
    "Geometry and Trigonometry": [
      "Area and Volume",
      "Lines, Angles, and Triangles",
      "Right Triangles and Trigonometry",
      "Circles"
    ],
    "No Filter" : ["No Filter"]
  }
};

const difficulty = ["No Filter", "Easy", "Medium", "Hard"]


export default function App() {
    const [numRows, setNumRows] = useState(1);
    const [blue, setBlue] = useState("No");

    const createObjects = (count) => {return Array.from({length: count}, (_,index) => ({...set, id: index, test: "Math", domain: "Algebra"}));};
    
    const [objects, setObjects] = useState(() => createObjects(numRows));

    const handleAddRow = () => {
      const newNum = numRows +1;
      setNumRows(newNum)
      setObjects(prevObjects => [...prevObjects, {...set, id: newNum-1}])
    }

    const handleRemoveRow = () => {
      const newNum = numRows-1;
      setNumRows(newNum)
      setObjects(prevObjects => prevObjects.slice(0, -1))
    }

    const handleChange = () => {
        const newObj = objects.slice();
        newObj[numRows-1].skill = "hi!";
        setObjects(newObj);
    }

    const handleTestChange = (e, index) => {
      const newObj = objects.slice();
      newObj[index].test = e;
      newObj[index].domain = Object.keys(skillsHierarchy[objects[index].test])[0]
      setObjects(newObj);
    }

    const handleDomainChange = (e, index) => {
      const newObj = objects.slice();
      newObj[index].domain = e;
      setObjects(newObj);
    }

    const handleSkillChange = (e, index) => {
      const newObj = objects.slice();
      newObj[index].skill = e;
      setObjects(newObj);
    }

    const handleDifficultyChange = (e, index) => {
      const newObj = objects.slice();
      newObj[index].difficulty = e;
      setObjects(newObj);
    }

    const handleAmountChange = (e, index) => {
      const newObj = objects.slice();
      newObj[index].amount = e;
      setObjects(newObj);
    }

    const handleBlueChange = (e) => {
      setBlue(e)
      setObjects(prevObjects => prevObjects.map(obj => ({...obj, difficulty: e})));
    }

    const handleGenerateTest = (e) => {
      console.log(e);
    }

    const handleGenerateSets = () => {
      const json1 = JSON.stringify(objects);
      handleGenerateTest(json1)
    }

    const handleReset = () => {
      setObjects(createObjects(numRows))
    }
     
    return (
    <div flex flex-col >
        <div className = "grid grid-cols-1 gap-4 m-2">
      {objects.map((obj, index) => (
        <div key={index} className = "justify-center flex flex-wrap gap-4 bg-sky-200 p-4 rounded-md border-2 border-neutral-950 min-w-0">
          <label>
            Pick a test:  
            <select value = {objects[index].test} onChange = {e => handleTestChange(e.target.value, index)} className = "ml-4 appearance-none hover:bg-sky-300 self-center text-center">
              {Object.keys(skillsHierarchy).map((item, testIndex) => (
              <option key = {testIndex} value = {item} className="w-14 flex-1 text-center text-align-last-center">{item}</option>))}
            </select>
          </label>
          
          <label>
            Pick a domain:  
            <select value = {objects[index].domain} onChange ={e => handleDomainChange(e.target.value, index)} className = "ml-4 appearance-none hover:bg-sky-300  " >
              {Object.keys(skillsHierarchy[objects[index].test]).map((item, testIndex) => (
              <option key = {testIndex} value = {item} className="w-14 flex-1">{item}</option>))}
            </select>
          </label>

          <label>
            Pick a skill:  
            <select value = {objects[index].skill} onChange ={e => handleSkillChange(e.target.value, index)} className = "ml-4 appearance-none hover:bg-sky-300  ">
              {skillsHierarchy[objects[index].test][objects[index].domain].map((item, testIndex) => (
              <option key = {testIndex} value = {item} className="w-14 flex-1">{item}</option>))}
              <option value = "No Filter"> No Filter</option>
            </select>
          </label>

          
          <label>
            Pick a Difficulty:  
            <select value = {objects[index].difficulty} onChange = {e => handleDifficultyChange(e.target.value, index)} className = "ml-4 appearance-none hover:bg-sky-300  "> 
              {difficulty.map((item, testIndex) => (
                <option key = {testIndex} value = {item}>{item}</option>
              ))}
          </select>
          </label>
          
          <label>
            Amount?  
            <input name = "amount" value = {objects[index].amount} onChange = {e=>handleAmountChange(e.target.value, index) } className = "ml-4 w-20 flex-auto"/>
          </label>

        </div>
      ))}

      </div>

      <div>
        <div className="my-8 flex flex-col max-w-xl mx-auto bg-sky-200 p-3 rounded-md border-2 border-neutral-950">
        <p className="justify-center text-center text-lg font-bold">Additional Questions</p>
        <label className="flex-auto justify-center text-center">
          Should questions found in the bluebook app be added?
          <select value = {blue} onChange = {e => handleBlueChange(e)} className = "ml-4 appearance-none hover:bg-sky-300  ">
            <option value = "Yes" >Yes</option>
            <option value = "No">No</option>
          </select>
        </label>
      </div>


      <div className="my-8 flex flex-wrap max-w-xl mx-auto bg-sky-200 p-3 rounded-md border-2 border-neutral-950 justify-center">
        <button onClick = {handleAddRow} className="flex-shrink-0 p-2 m-2 rounded-full border-2 border-neutral-950 hover:bg-sky-300 active:bg-violet-300">Add Row</button>
        <button onClick = {handleRemoveRow} className="flex-shrink-0 p-2 m-2 rounded-full border-2 border-neutral-950 hover:bg-sky-300 active:bg-violet-300">Remove Row</button>
        <button onClick = {handleGenerateSets} className="flex-shrink-0 p-2 m-2 rounded-full border-2 border-neutral-950 hover:bg-sky-300 active:bg-violet-300">Generate Sets</button>
        <button className="flex-shrink-0 p-2 m-2 rounded-full border-2 border-neutral-950 hover:bg-sky-300 active:bg-violet-300">Generate Sample SAT Test</button>
        <button onClick = {handleReset} className="flex-shrink-0 p-2 m-2 rounded-full border-2 border-neutral-950 hover:bg-sky-300 active:bg-violet-300">Reset All Rows</button>
      </div>
      </div>

      

      
      
        
    </div>
    
  );
}
  