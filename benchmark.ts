const content = `In a historic bipartisan vote, the Senate approved sweeping climate measures aimed at reducing carbon emissions by 50% by 2030. The legislation, which passed 62-38, represents the most significant climate action taken by Congress in decades.

The bill includes provisions for renewable energy tax incentives, electric vehicle credits, and funding for climate resilience infrastructure. Supporters hailed the measure as a crucial step toward addressing the climate crisis, while critics argued it did not go far enough.

The legislation now moves to the House, where its fate remains uncertain. Speaker Johnson has indicated the House will take up the measure "when the time is right," without committing to a specific timeline.

> "This is the most significant climate action Congress has taken in a generation," said Sen. Jane Doe (D-CA), the bill's primary sponsor. "We're finally treating this crisis with the urgency it deserves."

## Key Provisions

The legislation includes several major provisions:

- **Renewable Energy**: 10-year extension of tax credits for solar, wind, and geothermal energy
- **Electric Vehicles**: Expanded tax credits up to $12,500 for qualifying EVs
- **Climate Resilience**: $50 billion for infrastructure improvements in vulnerable communities
- **Emissions Targets**: Binding reduction targets for major industries

## Industry Response

The reaction from industry has been mixed. Renewable energy companies have praised the extended tax credits, while some manufacturing groups have expressed concern about the binding emissions targets.

Environmental organizations have largely welcomed the legislation, though some note that the binding targets may not go far enough to meet the Paris Agreement goals.

The bill now heads to the House, where it faces an uncertain future. Several moderate House members have already expressed reservations about certain provisions.`;

const ITERATIONS = 100000;

const start = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
  content.split('\n\n').map((paragraph, index) => {
    if (paragraph.startsWith('## ')) {
      return paragraph.replace('## ', '');
    }
    if (paragraph.startsWith('> ')) {
      return paragraph.replace('> ', '');
    }
    if (paragraph.startsWith('- ')) {
      const items = paragraph.split('\n').filter(line => line.startsWith('- '));
      return items.map((item, i) => item.replace('- ', '').replace(/\*\*(.*?)\*\*/g, '$1'));
    }
    return paragraph;
  });
}
const end = performance.now();
console.log(`Execution time for ${ITERATIONS} iterations without memoization (parsing only): ${end - start} ms`);

const startMemo = performance.now();
const memoizedResult = content.split('\n\n').map((paragraph, index) => {
  if (paragraph.startsWith('## ')) {
    return paragraph.replace('## ', '');
  }
  if (paragraph.startsWith('> ')) {
    return paragraph.replace('> ', '');
  }
  if (paragraph.startsWith('- ')) {
    const items = paragraph.split('\n').filter(line => line.startsWith('- '));
    return items.map((item, i) => item.replace('- ', '').replace(/\*\*(.*?)\*\*/g, '$1'));
  }
  return paragraph;
});
for (let i = 0; i < ITERATIONS; i++) {
  const result = memoizedResult; // Simulating returning the memoized result
}
const endMemo = performance.now();
console.log(`Execution time for ${ITERATIONS} iterations with memoization (parsing only): ${endMemo - startMemo} ms`);
