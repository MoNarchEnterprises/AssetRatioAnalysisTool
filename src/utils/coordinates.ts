export const pixelToChartCoords = (
  x: number,
  y: number,
  chartWidth: number,
  chartHeight: number,
  xDomain: [number, number],
  yDomain: [number, number],
  margin: { top: number; right: number; bottom: number; left: number }
) => {
  // Adjust coordinates for margin
  const effectiveX = x - margin.left;
  const effectiveY = y - margin.top;

  const effectiveWidth = chartWidth - margin.left - margin.right;
  const effectiveHeight = chartHeight - margin.top - margin.bottom;

  const xRange = xDomain[1] - xDomain[0];
  const yRange = yDomain[1] - yDomain[0];

  // Calculate the date and price values
  const dateValue = xDomain[0] + (effectiveX / effectiveWidth) * xRange;
  const priceValue = yDomain[1] - (effectiveY / effectiveHeight) * yRange;

  return { x: dateValue, y: priceValue };
};

export const chartToPixelCoords = (
  date: number,
  price: number,
  chartWidth: number,
  chartHeight: number,
  xDomain: [number, number],
  yDomain: [number, number],
  margin: { top: number; right: number; bottom: number; left: number }
) => {
  const xRange = xDomain[1] - xDomain[0];
  const yRange = yDomain[1] - yDomain[0];

  const effectiveWidth = chartWidth - margin.left - margin.right;
  const effectiveHeight = chartHeight - margin.top - margin.bottom;

  // Calculate pixel coordinates
  const effectiveX = ((date - xDomain[0]) / xRange) * effectiveWidth;
  const effectiveY = ((yDomain[1] - price) / yRange) * effectiveHeight;

  // Add margin offsets
  const x = effectiveX + margin.left;
  const y = effectiveY + margin.top;

  return { x, y };
};