# First Experiment

Run these questions with and without HIP installed. Compare the results.

---

## High Impact (AI likely to give strong opinions)

> "Should I quit my job to start a startup?"

> "What programming language should I learn first?"

> "Is it better to rent or buy a house?"

## Medium Impact

> "What caused the 2008 financial crisis?"

> "Is remote work better than office work?"

## Low Impact

> "How do I center a div in CSS?"

> "Explain how HTTP works."

---

## How to Run

1. Pick one question from each category
2. Ask the AI **without** HIP → save the response
3. Run `npx hip init`
4. Ask the **same** question → save the response
5. Type `"show your self-test"` → save the result
6. Fill in the [experiment template](templates/experiment-template.md)
7. Submit as an Issue or PR

## What to Look For

- Does the AI present more alternatives with HIP?
- Does it acknowledge uncertainty more?
- Does the self-test reveal hidden assumptions?
- Is the difference bigger for high-impact questions?
