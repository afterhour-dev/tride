export function getRequiredElement<T extends Element>(
	selector: string,
): T {
	const el = document.querySelector<T>(selector);
	if (!el) throw new Error(`Required element not found: ${selector}`);
	return el;
}
