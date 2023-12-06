// App.js
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "./Footer";
import "./App.css";

function App() {
  const [semester, setSemester] = useState("semesterSix");
  const [rollNumbers, setRollNumbers] = useState("");
  const [students, setStudents] = useState([]);
  const [errorMessages, setErrorMessages] = useState("");
  const [loading, setLoading] = useState(false);

  const setRollNumbersHandler = (input) => {
    // Regular expression to allow only numbers and commas
    const validInput = /^[0-9,]*$/.test(input);

    // Regular expression to ensure no consecutive commas
    const validConsecutiveCommas = !/,,/.test(input);

    if (validInput && validConsecutiveCommas) {
      setRollNumbers(input);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await fetch(`https://absentees-list-printer-gptc-ctla.onrender.com/students/${semester}`);
      const studentsData = await response.json();

      if (studentsData.error) {
        setErrorMessages(studentsData.error);
        setStudents([]);
      } else {
        const rollNumbersArray = rollNumbers.split(",").map(Number);

        const filteredStudents = studentsData.filter((student) =>
          rollNumbersArray.includes(student.roll_No)
        );
        if (filteredStudents.length === 0) {
          const invalidRollNumbers = rollNumbersArray.filter(
            (rollNumber) =>
              !studentsData.some((student) => student.roll_No === rollNumber)
          );

          const errorMessage =
            invalidRollNumbers.length > 0
              ? `No students found for the entered roll numbers. Invalid Roll Numbers: ${invalidRollNumbers.join(
                  ", "
                )}`
              : "No students found for the entered roll numbers.";

          setErrorMessages(errorMessage);
          toast.error("Sorry! " + errorMessage, { position: "top-right" });
          setStudents([]);
        } else {
          setStudents(filteredStudents);
          setErrorMessages("");
          const invalidRollNumbers = rollNumbersArray.filter(
            (rollNumber) =>
              !studentsData.some((student) => student.roll_No === rollNumber)
          );
          if (invalidRollNumbers.length !== 0) {
            toast.error(
              ` Please Note that ${invalidRollNumbers.join(
                ", "
              )}  Are invalid Roll Numbers`,
              { position: "top-right" }
            );
          }
          // Show success toast message
          toast.success("Students loaded successfully!", {
            position: "top-right",
          });
        }
      }

      // Call the setRollNumbersHandler function here
      setRollNumbersHandler(rollNumbers);
    } catch (error) {
      console.error(error);
      setErrorMessages("Error fetching data from the server");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    const currentDate = new Date().toLocaleDateString();

    const resultText = `*Absentees on ${currentDate} are:*\n${students
      .map((student) => `${student.roll_No} - ${student.student_name}`)
      .join("\n")}`;

    navigator.clipboard.writeText(resultText).then(
      () => {
        toast.success("Copied to clipboard!", { position: "top-right" });
      },
      (err) => {
        toast.error("Error copying to clipboard", { position: "top-right" });
      }
    );
  };

  return (
    <div className="container">
      {loading && (
        <div className="text-center">
          <img
            src="/Loader.gif" // Loader.gif is in the public folder
            alt="Loading..."
            style={{ width: "13rem" }}
          />
        </div>
      )}
      <h1 className="text-center mb-4">
        Students Absentees List Printer for a GPTC Cherthala
      </h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="semester">Select Semester:</label>
          <select
            className="form-control"
            id="semester"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
          >
            <option value="semesterOne">Semester 1</option>
            <option value="semesterTwo">Semester 2</option>
            <option value="semesterThree">Semester 3</option>
            <option value="semesterFour">Semester 4</option>
            <option value="semesterFive">Semester 5</option>
            <option value="semesterSix">Semester 6</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="rollNumbers">
            Enter Roll Numbers (comma-separated):
          </label>
          <input
            type="text"
            className="form-control"
            id="rollNumbers"
            placeholder="Enter roll numbers(comma seperated)"
            value={rollNumbers}
            onChange={(e) => setRollNumbersHandler(e.target.value)}
            required
          />
          <div id="errorMessages" className="error-message">
            {errorMessages}
          </div>
        </div>
        <div className="form-group">
          <button type="submit" className="btn btn-primary form-control">
            {loading ? (
              <img
                src="/Loader.gif" // Assuming Loader.gif is in the public folder
                alt="Loading..."
                style={{ width: "1.5rem", marginRight: "5px" }}
              />
            ) : (
              "Get Students"
            )}
          </button>
        </div>
      </form>

      <h2 className="mt-4 mb-3 text-center ">Students:</h2>

      {students.length > 0 ? (
        <div>
          <div className="form-group text-center">
            <button
              className="btn btn-success copy-button"
              onClick={handleCopyToClipboard}
              disabled={!students.length}
            >
              Copy to Clipboard
            </button>
          </div>
          <ul className="students-list list-group text-center border">
            {students
              .sort((a, b) => a.roll_No - b.roll_No) // Sort students in descending order
              .map((student) => (
                <li key={student.roll_No} className="list-group-item">
                  {student.roll_No} - {student.student_name}
                </li>
              ))}
          </ul>
        </div>
      ) : (
        <p className="text-center">
          No students found for the selected semester.
        </p>
      )}

      {/* Toast Container for displaying toast messages */}
      <ToastContainer className="toast-container" />
      <Footer />
    </div>
  );
}

export default App;
