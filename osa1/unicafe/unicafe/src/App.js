import { useState } from 'react'

const Header = ({text}) => {
  return <h1>{text}</h1>
}

const StatisticLine  = ({ text, value, prosentti }) => (
  <tbody>
    <tr>
      <td>{text}</td>
      <td>{value} {prosentti}</td>   
    </tr> 
  </tbody> 
)

// oikea paikka komponentin määrittelyyn
const Statistics = (props) => {
  if (props.good + props.neutral + props.bad == 0) {
    return <p>No feedback given</p>
  }
  return (
    <table>
      <StatisticLine text="good" value={props.good} />
      <StatisticLine text="neutral" value={props.neutral} />
      <StatisticLine text="bad" value={props.bad} />
      <StatisticLine text="all" value={props.good + props.neutral + props.bad} />
      <StatisticLine text="average" value={(props.good - props.bad) / (props.good + props.neutral + props.bad)}/>
      <StatisticLine text="positive" value={(props.good / (props.good + props.neutral + props.bad)) * 100} prosentti="%"/>
    </table>
  )
}

const Button = (props) => {
 return <button onClick={props.handleClick}>{props.text}</button>
}


const App = () => {
  // tallenna napit omaan tilaansa
  
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const setToGood = newValue => { setGood(newValue) }
  const setToNeutral = newValue => { setNeutral(newValue) }
  const setToBad = newValue => { setBad(newValue) }

  return (
    <div>
      <Header text="give feedback"/>
      <Button text="good" handleClick={() => setToGood(good+1)} />
      <Button text="neutral" handleClick={() => setToNeutral(neutral+1)} />
      <Button text="bad" handleClick={() => setToBad(bad+1)}/>
      <Header text="statistics"/>
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}


export default App