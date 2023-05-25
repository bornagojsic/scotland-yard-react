import { useState } from 'react';

const useMaxWidth = (width) => {
	const [maxWidth, setMaxWidth] = useState(width);
	return [maxWidth, setMaxWidth];
};

const useMaxHeight = (height) => {
	const [maxHeight, setMaxHeight] = useState(height);
	return [maxHeight, setMaxHeight];
};

const useMinDimension = (dimension) => {
	const [minDimesion, setMinDimension] = useState(dimension);
	return [minDimesion, setMinDimension];
};

export { useMaxWidth, useMaxHeight, useMinDimension };