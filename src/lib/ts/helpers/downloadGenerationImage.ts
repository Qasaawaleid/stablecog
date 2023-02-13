import { getImageFileNameFromGeneration } from '$ts/helpers/getImageFileNameFromGeneration';

export async function downloadGenerationImage({
	url,
	isUpscaled,
	prompt,
	seed,
	guidanceScale,
	inferenceSteps
}: TDownloadGenerationImageProps) {
	const res = await fetch(url);
	const blob = await res.blob();
	const fileName = getImageFileNameFromGeneration({
		url,
		isUpscaled,
		prompt,
		seed,
		guidanceScale,
		inferenceSteps
	});
	const a = document.createElement('a');
	a.href = URL.createObjectURL(blob);
	a.download = fileName;
	a.click();
	a.remove();
}

interface TDownloadGenerationImageProps {
	url: string;
	isUpscaled: boolean;
	prompt: string;
	seed: number;
	guidanceScale: number;
	inferenceSteps: number;
}
