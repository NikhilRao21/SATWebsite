import React, { useState } from "react";
import './index.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import Alert from '@mui/material/Alert';

const set = {
  test: "Math",
  domain: "Algebra",
  skill: "No Filter",
  difficulty: "No Filter",
  amount: "0",
  bluebookUse: "false"
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
    "No Filter": ["No Filter"]
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
    "No Filter": ["No Filter"]
  }
};

const difficulty = ["No Filter", "Easy", "Medium", "Hard"]


function Slider({ onClick }) {
  return (
    <div class="w-11 h-5">
      <input onChange={e => { onClick(e.target.checked) }} id="switch-component-ripple-on" type="checkbox" class="peer appearance-none w-11 h-5 bg-slate-100 rounded-full checked:bg-slate-800 cursor-pointer transition-colors duration-300" />
      <label
        htmlFor="switch-component-ripple-on"
        className="absolute top-0 left-0 h-5 w-5 cursor-pointer rounded-full border border-slate-300 bg-white shadow-sm transition-all duration-300 before:absolute before:top-2/4 before:left-2/4 before:block before:h-10 before:w-10 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-slate-400 before:opacity-0 before:transition-opacity hover:before:opacity-10 peer-checked:translate-x-6 peer-checked:border-slate-800"
      >
        <div
          className="top-2/4 left-2/4 inline-block -translate-x-2/4 -translate-y-2/4 rounded-full p-5"
          data-ripple-dark="true"
        ></div>
      </label>
    </div>);

}


export default function App() {
  const [numRows, setNumRows] = useState(1);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: '',
  });

  const createObjects = (count) => { return Array.from({ length: count }, (_, index) => ({ ...set, id: index, test: "Math", domain: "Algebra" })); };

  const [objects, setObjects] = useState(() => createObjects(numRows));


  const handleAddRow = () => {
    const newNum = numRows + 1;
    setNumRows(newNum)
    setObjects(prevObjects => [...prevObjects, { ...set, id: newNum - 1 }])
  }

  const handleRemoveRow = () => {
    if (numRows !== 1) {
      const newNum = numRows - 1;
      setNumRows(newNum)
      setObjects(prevObjects => prevObjects.slice(0, -1))
    }
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
    setObjects(prevObjects => prevObjects.map(obj => ({ ...obj, bluebookUse: e })));
  }

  const showAlert = (message, severity) => {
    setAlert({
      open: true,
      message: message,
      severity: severity,
    });
    setTimeout(() => {
      setAlert({ open: false, message: '', severity: '' });
    }, 3000);
  }

  const handleGenerateTest = () => {
    for (let i = 0; i < objects.length; i++) {
      if (objects[i].amount === "" || isNaN(objects[i].amount) || parseInt(objects[i].amount) <= 0) {
        showAlert("Please enter a valid number for each question.", "error");
        return;
      }
    }

    let amount = 0;
    for (let i = 0; i < objects.length; i++) {
      amount += parseInt(objects[i].amount);
    }
    if (amount > 200) {
      //showAlert("Total number of questions cannot exceed 200.", "error");
    }


    console.log();

    fetch('http://localhost:4567/generate-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(objects)
    })
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => {
            throw new Error(text || `Server error: ${response.status}`);
          });
        }
        return response.blob()
      })
      .then(blob => {

        const fileURL = URL.createObjectURL(blob);
        setPdfUrl(fileURL);
        console.log('PDF generated successfully:', blob);
        showAlert("PDF generated successfully!", "success");

      })
      .catch(error => {
        showAlert(error.message || "An error occured.", "error");
      });
  }

  const handleGenerateSets = () => {
    handleGenerateTest()
  }

  const handleReset = () => {
    setObjects(createObjects(numRows))
  }

  const handleSATSample = () => {
    setObjects(prevObjects => [{ ...set, test: "Math", domain: "No Filter", amount: 44 }, { ...set, test: "Reading and Writing", domain: "No Filter", amount: 54 }])
  }

  return (
    <div className="flex flex-col min-h-screen min-w-screen p-4 bg-slate-200 bg-cover">
      {alert.open && (<Alert variant="filled" severity={alert.severity} onClose={() => setAlert({ open: false, message: '', severity: '' })} className="mb-4 justify-center items-center text-center max-w-md mx-auto">
        {alert.message}
      </Alert>)}
      <div className="grid grid-cols-1 gap-4 max-w-7xl mx-auto w-full">
        {objects.map((obj, index) => (
          <div key={index} className="flex flex-col sm:flex-row sm:flex-wrap gap-4 bg-slate-700 text-neutral-200 p-4 rounded-md border-4 border-neutral-950">
            <label className="flex flex-col sm:flex-row sm:items-center gap-2 min-w-0">
              <span className="text-sm font-medium whitespace-nowrap">Pick a test:</span>
              <select
                value={objects[index].test}
                onChange={e => handleTestChange(e.target.value, index)}
                className="appearance-none hover:bg-slate-300 text-center text-neutral-950 px-2 py-1 rounded border"
              >
                {Object.keys(skillsHierarchy).map((item, testIndex) => (
                  <option key={testIndex} value={item}>{item}</option>
                ))}
              </select>
            </label>

            <label className="flex flex-col sm:flex-row sm:items-center gap-2 min-w-0">
              <span className="text-sm font-medium whitespace-nowrap">Pick a domain:</span>
              <select
                value={objects[index].domain}
                onChange={e => handleDomainChange(e.target.value, index)}
                className="appearance-none hover:bg-slate-300 text-neutral-950 text-center px-2 py-1 rounded border"
              >
                {Object.keys(skillsHierarchy[objects[index].test]).map((item, testIndex) => (
                  <option key={testIndex} value={item}>{item}</option>
                ))}
              </select>
            </label>

            <label className="flex flex-col sm:flex-row sm:items-center gap-2 min-w-0">
              <span className="text-sm font-medium whitespace-nowrap">Pick a skill:</span>
              <select
                value={objects[index].skill}
                onChange={e => handleSkillChange(e.target.value, index)}
                className="appearance-none hover:bg-slate-300 text-neutral-950 text-center px-2 py-1 rounded border"
              >
                {skillsHierarchy[objects[index].test][objects[index].domain].map((item, testIndex) => (
                  <option key={testIndex} value={item}>{item}</option>
                ))}
                <option value="No Filter">No Filter</option>
              </select>
            </label>

            <label className="flex flex-col sm:flex-row sm:items-center gap-2 min-w-0">
              <span className="text-sm font-medium whitespace-nowrap">Pick a Difficulty:</span>
              <select
                value={objects[index].difficulty}
                onChange={e => handleDifficultyChange(e.target.value, index)}
                className="appearance-none hover:bg-slate-300 text-neutral-950 text-center px-2 py-1 rounded border"
              >
                {difficulty.map((item, testIndex) => (
                  <option key={testIndex} value={item}>{item}</option>
                ))}
              </select>
            </label>

            <label className="flex flex-col sm:flex-row sm:items-center gap-2 min-w-0">
              <span className="text-sm font-medium whitespace-nowrap">Amount?</span>
              <input
                name="amount"
                type="number"
                value={objects[index].amount}
                onChange={e => handleAmountChange(e.target.value, index)}
                className="w-20 text-center px-2 text-neutral-950 py-1 rounded border"
              />
            </label>
          </div>
        ))}
      </div>

      {/* Additional Questions Section */}
      <div className="my-8 flex flex-col max-w-xl mx-auto bg-slate-700  text-neutral-200 p-4 rounded-md border-4 border-neutral-950 w-full">
        <p className="text-center text-lg font-bold mb-4">Additional Questions</p>

        <label className="flex flex-col sm:flex-row text-neutral-50 sm:items-center sm:justify-between gap-2 bg-slate-600 p-2 rounded-md">
          <span className="text-sm font-medium">Should questions found in the bluebook app be added?</span>
          <div class="relative inline-flex gap-2">
            <Slider onClick={handleBlueChange}></Slider>
          </div>
        </label>

      </div>

      {/* Buttons Section */}
      <div className="mt-0 mb-8 flex flex-wrap justify-center gap-3 text-neutral-200 max-w-4xl mx-auto bg-slate-700 p-4 rounded-md border-2 border-neutral-950">
        <button
          onClick={handleAddRow}
          className="px-4 py-2 rounded-full border-2 border-neutral-200 hover:bg-slate-800 active:bg-slate-900 text-sm font-medium"
        >
          Add Row
        </button>
        <button
          onClick={handleRemoveRow}
          className="px-4 py-2 rounded-full border-2 border-neutral-200 hover:bg-slate-800 active:bg-slate-900 text-sm font-medium"
        >
          Remove Row
        </button>
        <button
          onClick={handleGenerateSets}
          className="px-4 py-2 rounded-full border-2 border-neutral-200 hover:bg-slate-800 active:bg-slate-900 text-sm font-medium"
        >
          Generate Sets
        </button>
        <button
          onClick={handleSATSample}
          className="px-4 py-2 rounded-full border-2 border-neutral-200 hover:bg-slate-800 active:bg-slate-900 text-sm font-medium"
        >
          Generate Sample SAT Test
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 rounded-full border-2 border-neutral-200 hover:bg-slate-800 active:bg-slate-900 text-sm font-medium"
        >
          Reset All Rows
        </button>
        {pdfUrl && (<button
          onClick={() => {
            setPdfUrl(null);
            const link = document.createElement('a');
            link.href = pdfUrl;
            link.download = 'Generated Questions.pdf'; // Set the filename
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
          }
          className="px-4 py-2 rounded-full border-2 border-neutral-200 hover:bg-slate-800 active:bg-slate-900 text-sm font-medium">
          Download PDF
        </button>)}
      </div>
    </div >
  );
}
