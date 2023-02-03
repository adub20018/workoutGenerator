import React from "react";
import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [workoutInput, setWorkoutInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ workout: workoutInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      setResult(data.result);
      setWorkoutInput(workoutInput);
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }
  {
    Array.isArray(result)
      ? result.map((text, index) => (
          <tr key={index}>
            <td>{text}</td>
          </tr>
        ))
      : null;
  }

  return (
    <div className="bg1">
      <Head>
        <title>Workout Generator</title>
        <link rel="icon" href="/gym_dark.png" className="icon" />
      </Head>

      <main className={styles.main}>
        <img src="/gym_dark.png" className={styles.icon} />
        <h3>Workout Generator</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="workout"
            placeholder="Enter your workout needs"
            value={workoutInput}
            onChange={(e) => setWorkoutInput(e.target.value)}
          />
          <input type="submit" value="Generate workout" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
