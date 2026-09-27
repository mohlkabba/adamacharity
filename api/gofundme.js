// Live GoFundMe totals for the homepage tally.
// GoFundMe's GraphQL endpoint only allows its own domains to call it from a
// browser, so the site asks this function instead. Vercel caches the answer
// for 5 minutes, so GoFundMe sees at most one request every few minutes.
const SLUG = 'help-yadama-restore-independence-and-dignity';
const QUERY = `query GetFundraiser($slug: ID!) {
  fundraiser(slug: $slug) {
    currentAmount { amount currencyCode }
    goalAmount { amount currencyCode }
    donationCount
  }
}`;

module.exports = async (req, res) => {
  try {
    const response = await fetch('https://graphql.gofundme.com/graphql', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'user-agent': 'Mozilla/5.0 (compatible; YADAMA website)' },
      body: JSON.stringify({ operationName: 'GetFundraiser', variables: { slug: SLUG }, query: QUERY }),
    });
    const json = await response.json();
    const fundraiser = json && json.data && json.data.fundraiser;
    if (!fundraiser) throw new Error('No fundraiser data');

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=3600');
    res.status(200).json({
      raised: fundraiser.currentAmount.amount,
      goal: fundraiser.goalAmount.amount,
      currency: fundraiser.currentAmount.currencyCode,
      donations: fundraiser.donationCount,
    });
  } catch (error) {
    res.setHeader('Cache-Control', 's-maxage=60');
    res.status(502).json({ error: 'GoFundMe totals are unavailable right now' });
  }
};
