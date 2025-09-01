export function id(idg: string) {
	return document.getElementById(idg);
}
export function hide(element: HTMLElement) {
	element.classList.add("hidden");
}
export function show(element: HTMLElement) {
	element.classList.remove("hidden");
}
export function scene1() {
	alert("yay");
}
