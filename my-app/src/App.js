import React, { useState } from "react";
import './index.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import Alert from '@mui/material/Alert';
import logoDark from './assets/zeta_prep_full_logo_dark.svg';
import logoLight from './assets/zeta_prep_full_logo_light.svg';

const set = {
  test: "Math",
  domain: "No Filter",
  skill: "No Filter",
  difficulty: "No Filter",
  amount: "1",
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
    "No Filter": []
  }
};

const difficulty = ["No Filter", "Easy", "Medium", "Hard"]


function Slider({ onClick }) {
  return (
    <div className="w-11 h-5">
      <input onChange={e => { onClick(e.target.checked) }} id="switch-component-ripple-on" type="checkbox" className="peer appearance-none w-11 h-5 bg-zinc-600 rounded-full checked:bg-amber-500 cursor-pointer transition-colors duration-300" />
      <label
        htmlFor="switch-component-ripple-on"
        className="absolute top-0 left-0 h-5 w-5 cursor-pointer rounded-full border border-zinc-500 bg-zinc-300 shadow-sm transition-all duration-300 before:absolute before:top-2/4 before:left-2/4 before:block before:h-10 before:w-10 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-amber-400 before:opacity-0 before:transition-opacity hover:before:opacity-10 peer-checked:translate-x-6 peer-checked:border-amber-500"
      >
        <div
          className="top-2/4 left-2/4 inline-block -translate-x-2/4 -translate-y-2/4 rounded-full p-5"
          data-ripple-dark="true"
        ></div>
      </label>
    </div>
  );
}


export default function App() {
  const [numRows, setNumRows] = useState(1);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: '',
  });

  const createObjects = (count) => { return Array.from({ length: count }, (_, index) => ({ ...set, id: index})); };

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

    setLoading(true);
    fetch('https://coalitional-subabsolutely-raleigh.ngrok-free.dev/generate-pdf', {
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
        if (response.headers.get('Content-Type') !== 'application/pdf') {
          console.log('Response is not a PDF:', response.headers.get('Content-Type'));
          throw new Error("A Fatal Error has Occured.");
        }
        return response.blob()
      })
      .then(blob => {

        const fileURL = URL.createObjectURL(blob);
        setLoading(false);
        setPdfUrl(fileURL);
        console.log('PDF generated successfully:', blob);

      })
      .catch(error => {
        setLoading(false);
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

  /* ─── shared select className ─── */
  const selectCls = "appearance-none bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-sm text-center px-3 py-1.5 rounded-md border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors duration-150 cursor-pointer";

  /* ─── shared ghost button className ─── */
  const btnGhost = "px-5 py-2 rounded-md border border-zinc-500 text-zinc-300 text-sm font-medium hover:bg-zinc-700 hover:border-zinc-400 hover:text-zinc-100 active:bg-zinc-800 transition-all duration-150";

  return (
    <div className="flex flex-col min-h-screen min-w-screen p-6 bg-stone-100 bg-cover">

      {/* ── Download modal ── */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .modal-backdrop { animation: fadeIn 0.2s ease forwards; }
        .modal-card     { animation: slideUp 0.25s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .spinner        { animation: spin 0.8s linear infinite; }
      `}</style>

      {/* ── Loading overlay ── */}
      {loading && (
        <div className="modal-backdrop fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950/70 backdrop-blur-sm gap-4">
          <div className="spinner w-12 h-12 rounded-full border-4 border-zinc-600 border-t-amber-500" />
          <p className="text-zinc-300 text-sm font-medium tracking-wide">Generating your PDF…</p>
        </div>
      )}

      {pdfUrl && (
        <div className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/70 backdrop-blur-sm">
          <div className="modal-card bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-5 max-w-sm w-full mx-4">
            {/* Icon */}
            <div className="w-14 h-14 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
              <span className="text-2xl text-green-400">✓</span>
            </div>
            <div className="text-center">
              <p className="text-zinc-100 font-semibold text-lg tracking-tight">Your PDF is ready</p>
              <p className="text-zinc-400 text-sm mt-1">Your question set has been generated successfully.</p>
            </div>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => setPdfUrl(null)}
                className="flex-1 px-4 py-2 rounded-md border border-zinc-600 text-zinc-400 text-sm font-medium hover:bg-zinc-800 hover:text-zinc-200 transition-all duration-150"
              >
                Dismiss
              </button>
              <button
                onClick={() => {
                  const url = pdfUrl;
                  setPdfUrl(null);
                  window.open(url, '_blank');
                }}
                className="flex-1 px-4 py-2 rounded-md bg-green-500 text-zinc-950 text-sm font-semibold hover:bg-green-400 active:bg-green-600 transition-all duration-150 shadow-md shadow-green-900/30"
              >
                ↓ Open PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Page header ── */}
      <header className="max-w-7xl mx-auto w-full mb-8">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
          <div className="bg-zinc-900 rounded-xl border border-zinc-700 px-4 py-3 shadow-sm">
            <img src={logoLight} alt="Zeta Prep logo light" className="h-10 sm:h-12 w-auto" />
          </div>
        </div>
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-amber-600 mb-1">SAT Practice</p>
        <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Question Set Generator</h1>
        <div className="mt-2 h-px w-16 bg-amber-500 rounded-full" />
      </header>

      {/* ── Alert ── */}
      {alert.open && (
        <Alert
          variant="filled"
          severity={alert.severity}
          onClose={() => setAlert({ open: false, message: '', severity: '' })}
          className="mb-6 justify-center items-center text-center max-w-md mx-auto"
        >
          {alert.message}
        </Alert>
      )}

      {/* ── Row cards ── */}
      <div className="grid grid-cols-1 gap-3 max-w-7xl mx-auto w-full">
        {objects.map((obj, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row sm:flex-wrap gap-5 bg-zinc-900 text-zinc-100 px-5 py-4 rounded-xl border border-zinc-700 shadow-lg shadow-zinc-900/20"
          >
            {/* Row index pill */}
            <div className="flex items-center">
              <span className="text-xs font-bold tracking-widest text-amber-500 uppercase mr-4 w-6 text-center">{index + 1}</span>
            </div>

            <label className="flex flex-col sm:flex-row sm:items-center gap-2 min-w-0">
              <span className="text-xs font-semibold tracking-wide text-zinc-400 uppercase whitespace-nowrap">Test</span>
              <select
                value={objects[index].test}
                onChange={e => handleTestChange(e.target.value, index)}
                className={selectCls}
              >
                {Object.keys(skillsHierarchy).map((item, testIndex) => (
                  <option key={testIndex} value={item}>{item}</option>
                ))}
              </select>
            </label>

            <label className="flex flex-col sm:flex-row sm:items-center gap-2 min-w-0">
              <span className="text-xs font-semibold tracking-wide text-zinc-400 uppercase whitespace-nowrap">Domain</span>
              <select
                value={objects[index].domain}
                onChange={e => handleDomainChange(e.target.value, index)}
                className={selectCls}
              >
                {Object.keys(skillsHierarchy[objects[index].test]).map((item, testIndex) => (
                  <option key={testIndex} value={item}>{item}</option>
                ))}
              </select>
            </label>

            <label className="flex flex-col sm:flex-row sm:items-center gap-2 min-w-0">
              <span className="text-xs font-semibold tracking-wide text-zinc-400 uppercase whitespace-nowrap">Skill</span>
              <select
                value={objects[index].skill}
                onChange={e => handleSkillChange(e.target.value, index)}
                className={selectCls}
              >
                {skillsHierarchy[objects[index].test][objects[index].domain].map((item, testIndex) => (
                  <option key={testIndex} value={item}>{item}</option>
                ))}
                <option value="No Filter">No Filter</option>
              </select>
            </label>

            <label className="flex flex-col sm:flex-row sm:items-center gap-2 min-w-0">
              <span className="text-xs font-semibold tracking-wide text-zinc-400 uppercase whitespace-nowrap">Difficulty</span>
              <select
                value={objects[index].difficulty}
                onChange={e => handleDifficultyChange(e.target.value, index)}
                className={selectCls}
              >
                {difficulty.map((item, testIndex) => (
                  <option key={testIndex} value={item}>{item}</option>
                ))}
              </select>
            </label>

            <label className="flex flex-col sm:flex-row sm:items-center gap-2 min-w-0">
              <span className="text-xs font-semibold tracking-wide text-zinc-400 uppercase whitespace-nowrap">Amount</span>
              <input
                name="amount"
                type="number"
                value={objects[index].amount}
                onChange={e => handleAmountChange(e.target.value, index)}
                className="w-20 text-center px-2 py-1.5 text-sm bg-zinc-800 text-zinc-100 rounded-md border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors duration-150"
              />
            </label>
          </div>
        ))}
      </div>

      {/* ── Additional Questions ── */}
      <div className="my-6 flex flex-col max-w-xl mx-auto bg-zinc-900 text-zinc-100 px-5 py-4 rounded-xl border border-zinc-700 shadow-lg shadow-zinc-900/20 w-full">
        <p className="text-xs font-semibold tracking-[0.15em] uppercase text-amber-500 mb-4">Additional Options</p>

        <label className="flex flex-col sm:flex-row text-zinc-100 sm:items-center sm:justify-between gap-3 bg-zinc-800 px-4 py-3 rounded-lg border border-zinc-700">
          <span className="text-sm text-zinc-300">Include questions from Bluebook practice tests?</span>
          <div className="relative inline-flex gap-2">
            <Slider onClick={handleBlueChange} />
          </div>
        </label>
      </div>

      {/* ── Buttons ── */}
      <div className="mt-0 mb-10 flex flex-wrap justify-center gap-3 max-w-4xl mx-auto bg-zinc-900 px-6 py-4 rounded-xl border border-zinc-700 shadow-lg shadow-zinc-900/20 w-full">
        <button onClick={handleAddRow} className={btnGhost}>+ Add Row</button>
        <button onClick={handleRemoveRow} className={btnGhost}>− Remove Row</button>

        {/* Primary action stands out */}
        <button
          onClick={handleGenerateSets}
          className="px-5 py-2 rounded-md bg-amber-500 text-zinc-950 text-sm font-semibold hover:bg-amber-400 active:bg-amber-600 transition-all duration-150 shadow-md shadow-amber-900/30"
        >
          Generate Sets
        </button>

        <button onClick={handleSATSample} className={btnGhost}>Fill Sample SAT</button>
        <button onClick={handleReset} className={btnGhost}>Reset All</button>


      </div>
    </div>
  );
}