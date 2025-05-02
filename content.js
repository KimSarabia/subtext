// === List of flagged phrases and explanations ===
const flaggedTerms = {
	"female scientist": "Consider whether gender is necessary. Wikipedia style prefers gender-neutral phrasing.",
	"chairman": "Use 'chairperson' or 'chair' unless the title is official.",
	"manpower": "Consider 'workforce' or 'personnel' for gender-neutral phrasing.",
	"businessman": "Try 'businessperson' or just 'entrepreneur'.",
	"unmanned": "Use 'uncrewed' or 'autonomous' where appropriate."
};

// === Scan and flag terms ===
function scanAndFlag( node ) {
	if ( node.nodeType === 3 ) { // text node
		const parent = node.parentElement;
		if ( !parent || parent.tagName === "SCRIPT" || parent.tagName === "STYLE" ) return;

		let newHTML = node.textContent;
		let replaced = false;

		for ( const term in flaggedTerms ) {
			const regex = new RegExp( `\\b(${term})\\b`, 'gi' );
			if ( regex.test( newHTML ) ) {
				const tooltip = flaggedTerms[term];
				newHTML = newHTML.replace( regex, `<span class="subtext-flag" title="${tooltip}">$1</span>` );
				replaced = true;
			}
		}

		if ( replaced ) {
			const span = document.createElement( "span" );
			span.innerHTML = newHTML;
			parent.replaceChild( span, node );
		}
	} else if ( node.nodeType === 1 && node.childNodes && !["SCRIPT", "STYLE"].includes( node.tagName ) ) {
		node.childNodes.forEach( scanAndFlag );
	}
}

// === Start scan on page load ===
const content = document.getElementById( "mw-content-text" );
if ( content ) scanAndFlag( content );
