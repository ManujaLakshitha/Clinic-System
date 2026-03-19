{result?.drugs?.map(d => <p key={d}>{d}</p>)}
{result?.lab_tests?.map(t => <p key={t}>{t}</p>)}
{result?.notes?.map(n => <p key={n}>{n}</p>)}

const generateBill = () => {
  console.log("Bill generated");
};

<button onClick={generateBill}>Generate Bill</button>